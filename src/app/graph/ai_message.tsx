'use client'
import { CodeMarkdownWidget } from '@/components/alt/code_markdown';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { Client } from '@langchain/langgraph-sdk';
import { Collapse, CollapseProps, Divider, Typography } from 'antd';
import { Suspense, useEffect, useState } from "react";
import { GraphProps } from './interface';

const {Text,Paragraph} = Typography

type ResponseMetadata = {
  finish_reason?: string
}
type WebRefs = {
  title: string
  url: string
}
type ToolCall = {
  run_id: string
  toolStr: string
  result?: string
}
export default function AIMessage({ ...props }) {
  const { graphClient, text, addMessage } = props
  const [resText, setResText] = useState<string>("")
  const [nodes, setNodes] = useState<string[]>([])
  const [tools, setTools] = useState<ToolCall[]>([])
  const [webRefs, setWebRefs] = useState<WebRefs[]>([])
  const [ragRefs, setRagRefs] = useState([])
  const [replRefs, setReplRefs] = useState("")
  let effect = false
  useEffect(() => {
    if (effect) return;
    effect = true
    console.log("graphClient:", graphClient)
    if (graphClient.client instanceof Client) {
      getAIResponse_graphcloud(text, graphClient)
    } else {
      getAIResponse_langserve(text, graphClient)
    }
    //test1(userInput)
  }, [])
  const test1 = async (userInput: string) => {
    let idx = 0
    let timer: NodeJS.Timeout
    timer = setInterval(() => {
      setResText(userInput.substring(0, idx))
      idx++
      if (idx > userInput.length) clearInterval(timer)
    }, 50)
  }
  const formatToolCalls = (toolCalls: { id: any; name: any; args: any; }[]) => {
    if (toolCalls && toolCalls.length > 0) {
      const formattedCalls = toolCalls.map((call: { id: any; name: any; args: any; }) => {
        return {
        run_id: call.id,
        toolStr:`Tool Call ID: ${call.id}, Function: ${call.name}, Arguments: ${JSON.stringify(call.args)}`
      }});
      setTools((prev) => [...prev, ...formattedCalls]);
      return formattedCalls.join("\n");
    }
  }
  const getAIResponse_langserve = async (userInput: string, graphClient: GraphProps) => {
    const { client } = graphClient;
    console.log("client:", client)
    if (client) {
      try {
        let llmResponse = ""
        // const eventStream = await client.streamEvents(
        //   { messages: [new HumanMessage(userInput)],summary:"",mmwp:{} },
        //   { version: "v2" }
        const eventStream = await client.streamEvents(
          { messages: [new HumanMessage(userInput)],error:"",modelData:{},summary:"" },
          { version: "v2" }
      );

        for await (const event of eventStream) {
          //console.log(event)
          if (event.event === "on_chat_model_start"){
            llmResponse=""
            setResText(llmResponse)
          }else if (event.event === "on_chat_model_stream") {
            llmResponse += event.data.chunk.content;
            setResText(llmResponse)
            //console.log(event)
          } else if ((event.event == "on_chain_start" || event.event == "on_chain_end")) {
            const name = event.name
            if (!name.startsWith('/') && !name.startsWith('_'))
              if (event.event == "on_chain_start") {
                setNodes((prev) => [...prev, 'S:' + name])
              } else {
                setNodes((prev) => [...prev, 'E:' + name])
              }
          } else if (event.event == "on_tool_start") {
            const run_id = event.run_id
            const name = event.name
            const args = JSON.stringify(event.data.input)
            const toolStr = `${name}(${args})`
            setTools((prev) => [...prev, {run_id,toolStr}])
          } else if (event.event == "on_tool_end") {
            const run_id = event.run_id
            const content = event.data.output.content
            setTools((prev)=>prev.map((item)=>{
              if (item.run_id == run_id){
                item.result = content
              }
              return item
            }))
            if (event.name == "duckduckgo_results_json") {
              console.log(content)
              const newRefs = extractTitlesAndLinks(content)
              setWebRefs((prev) => [...prev, ...newRefs])
            } else if (event.name == "tavily_search_results_json") {
              const output = event.data.output as Array<any>
              const newRefs = output.map((item: any) => { return { "title": item.url, "url": item.url } })
              setWebRefs((prev) => [...prev, ...newRefs])
            } else if (event.name == "python_repl") {
              const codeStr = "```\n"
              const command = codeStr + event.data.input.command
              setReplRefs(command)
            } else {
              console.log(event)
            }
          } else {
            console.log(event)
          }
        }
      } catch (e) {
        await addMessage({ text: `${e}`, sender: "system" })
      }
    }
  }
  const getAIResponse_graphcloud = async (userInput: string, graphClient: GraphProps) => {
    const { client, assistant, thread } = graphClient;
    console.log("client:", client, "assistant:", assistant, "thread:", thread)
    if (client) {
      let streamResponse
      if (thread) {
        //判断是否来自用户的回答
        const state = await client.threads.getState(thread["thread_id"]);
        let userMessage = { "role": "user", "content": userInput }
        console.log("!!!!", state)
        if (state.next.length > 0 && !state.tasks[0].error) {
          await client.threads.updateState(
            thread.thread_id,  // Thread ID
            {
              values: { "messages": [userMessage] },  // Updated message
              asNode: state.next[0]
            }  // Acting as human_review_node
          );
          streamResponse = client.runs.stream(
            thread!["thread_id"],
            assistant!["assistant_id"],
            {
              "input": null,
              "streamMode": ["events", "updates", "messages"],
              //"streamMode": ["updates","events"],
              "interruptBefore": ["nodeA"]
            }
          );
        } else {
          streamResponse = client.runs.stream(
            thread!["thread_id"],
            assistant!["assistant_id"],
            {
              "input": { messages: [{ "role": "user", "content": userInput }] },
              "streamMode": ["events", "updates", "messages"],
              //"streamMode": ["updates","events"],
              "interruptBefore": ["nodeA"]
            }
          );
        }
      } else {
        streamResponse = client.runs.stream(
          null,
          assistant!["assistant_id"],
          {
            "input": { messages: [{ "role": "user", "content": userInput }] },
            "streamMode": ["events", "updates"] //"messages"]
          }
        );
      }
      let llmResponse = "";
      for await (const chunk of streamResponse) {
        console.log(chunk);
        if (chunk.event === "error") {
          await addMessage({ text: `${chunk.data.error}|${chunk.data.message}`, sender: "system" })
        }
        if (chunk.event === "updates") {
          setNodes((prev) => [...prev, Object.keys(chunk.data)[0]])
        }
        if (chunk.event === "messages/partial") {
          chunk.data.forEach((dataItem: { role: string; content: string; tool_calls: never[]; invalid_tool_calls: never[]; response_metadata: {}; }) => {
            if (dataItem.role && dataItem.role === "user") {
              console.log(`Human: ${dataItem.content}`);
            } else {
              const toolCalls = dataItem.tool_calls || [];
              const invalidToolCalls = dataItem.invalid_tool_calls || [];
              const content = dataItem.content || "";
              const responseMetadata: ResponseMetadata = dataItem.response_metadata || {};

              if (content) {
                console.log(`AI: ${content}`);
              }

              if (toolCalls.length > 0) {
                console.log("Tool Calls:");
                console.log(formatToolCalls(toolCalls));
              }

              if (invalidToolCalls.length > 0) {
                console.log("Invalid Tool Calls:");
                console.log(formatToolCalls(invalidToolCalls));
              }

              if (responseMetadata) {
                const finishReason = responseMetadata.finish_reason || "N/A";
                console.log(`Response Metadata: Finish Reason - ${finishReason}`);
              }
            }
          });
          console.log("-".repeat(50));
        }
        if (chunk.event === "events" && chunk.data.event === "on_chat_model_stream"
          && chunk.data.data.chunk.content.length > 0) {
          llmResponse += chunk.data.data.chunk.content;
          setResText(llmResponse)
        }
        // if (chunk.data && chunk.event !== "metadata") {
        //   const messages = chunk.data["messages"]
        //   const message = messages[messages.length - 1]
        //   if (message.type=='ai' && message.content){
        //       aimsg = message.content
        //       setText(aimsg)
        //   }else{
        //     setText("think....")
        //   }
        // }
      }
      //检查是否interrupt
      if (thread) {
        const state = await client.threads.getState(thread["thread_id"]);
        console.log("is interrupt?", state.next, state)
        if (state.next.length > 0) {
          const lastMessageContent = (state.values as { messages: BaseMessage[] }).messages.slice(-1)[0].content
          setResText(lastMessageContent as string)
        }
        console.log("HERE!!!!!!")
        await addMessage({ text: "hello1", sender: "system" })
        await addMessage({ text: "hello2", sender: "user" })
        await addMessage({ text: "hello3", sender: "ai" })
      }
    } else {
      setResText(userInput)
    }
  }
  function extractTitlesAndLinks(text: string): WebRefs[] {
    // 使用正则表达式匹配 title 和 link
    const pattern = /title:\s*(.*?),\s*link:\s*(https?:\/\/[^\s,]+)/g;
    const result: Array<{ title: string; url: string }> = [];
    let match: RegExpExecArray | null;

    // 使用 exec 方法来查找匹配项
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1].trim();
      const url = match[2].trim();
      result.push({ title, url });
    }

    // 返回 JSON 格式的字符串
    return result
  }
  const getToolItems = ():CollapseProps['items']=>{
      const ellipsis = {rows:2, expandable: true, symbol: 'more'} 
      const items = tools.map((item)=>{
        return {
          key:item.run_id,
          label: <div className="text-blue-500"> {`${item.toolStr} - ${item.run_id}`} </div>,
          children: <Paragraph copyable ellipsis={ellipsis}> {item.result} </Paragraph>
        } 
      })
      return items
  }
  const markdownContent = `
# Hello, Markdown!


This is a **Markdown** document that includes a table and code block:

| Name  | Age |
|-------|-----|
| Alice | 25  |
| Bob   | 30  |

\`\`\`javascript
function greet(name) {
  return 'Hello, ' + name + '!';
}
console.log(greet('Alice'));
\`\`\`
`
  return (<>
    <Suspense fallback={<div className="w-10 h-10 bg-yellow-600"></div>} >
      <div className="rounded-sm px-2 py-1 text-orange-400">
        <div className="flex flex-col gap-1">
          <div className="text-purple-300">
            {
              tools.length>0
              ? <Collapse size={"small"} items={getToolItems()} /> 
              : <></>
            }
            {/* <ul>
              {tools.map((item, idx) => <li> {item} </li>)}
            </ul> */}
          </div>
          <div className="text-green-600">{nodes.join('->')}</div>
          {/* <CodeMarkdownWidget text = {markdownContent} /> */}
          <CodeMarkdownWidget text={resText} />
          {webRefs.length > 0 ?
            <div className="flex flex-col">
              <Divider variant='dashed'><div className="text-blue-300 text-xs">以下为参考信息</div></Divider>
              <div className="text-blue-600">
                <ul>
                  {webRefs.map((item, idx) => <li>[{idx + 1}] <a href={item.url}>{item.title}</a></li>)}
                </ul>
              </div>
            </div>
            : <></>}
          {replRefs != "" ?
            <div className="flex flex-col">
              <Divider variant="dashed"><div className="text-blue-300 text-xs">以下为脚本信息</div></Divider>
              <div className="text-blue-600">
                <CodeMarkdownWidget text={replRefs} />
              </div>
            </div>
            : <></>}
        </div>
      </div>
    </Suspense>
  </>)
}

