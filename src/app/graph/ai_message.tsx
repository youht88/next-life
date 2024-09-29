'use client'
import { CodeMarkdownWidget } from '@/components/alt/code_markdown';
//import { MarkdownWidget } from '@/components/alt/markdown';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { Client } from '@langchain/langgraph-sdk';
import { Suspense, useEffect, useState } from "react";
import { GraphProps } from './interface';

type ResponseMetadata = {
  finish_reason?: string
}

export default function AIMessage({ ...props }) {
  const { graphClient, text, addMessage } = props
  const [resText, setResText] = useState<string>("")
  const [nodes, setNodes] = useState<string[]>([])
  const [tools, setTools] = useState<string>("")
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
        return `Tool Call ID: ${call.id}, Function: ${call.name}, Arguments: ${JSON.stringify(call.args)}`;
      });
      setTools(formattedCalls.join("\n"));
      return formattedCalls.join("\n");
    }
    setTools("No tool calls")
    return "No tool calls";
  }
  const getAIResponse_langserve = async (userInput: string, graphClient: GraphProps) => {
    const { client } = graphClient;
    console.log("client:", client)
    if (client) {
      try {
        let llmResponse = ""
        const eventStream = await client.streamEvents(
          { messages: [new HumanMessage(userInput)] },
          { version: "v2" }
        );

        for await (const event of eventStream) {
          //console.log(event)
          if (event.event === "on_chat_model_stream") {
            llmResponse += event.data.chunk.content;
            setResText(llmResponse)
          } else if ((event.event == "on_chain_start" || event.event == "on_chain_end")) {
            const name = event.name
            if (!name.startsWith('/') && !name.startsWith('_') )
            if (event.event=="on_chain_start"){
              setNodes((prev) => [...prev, 'S:'+name])
            }else{
              setNodes((prev) => [...prev, 'E:'+name])
            }
          } else if (event.event == "on_tool_start"){
              const name = event.name
              setTools(name)
          }else {
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
  return (<>
    <Suspense fallback={<div className="w-10 h-10 bg-yellow-600"></div>} >
      <div className="rounded-sm px-2 py-1 text-orange-400">
        <div className="flex flex-col gap-1">
          <div className="text-purple-300"> {tools} </div>
          <div className="text-green-600">{nodes.join('->')}</div>
          <CodeMarkdownWidget text={resText} />
        </div>
      </div>
    </Suspense>
  </>)
}