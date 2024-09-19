'use client'
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { useEffect, useState } from "react";

type props = {
  client: Client | null
  assistant: Assistant | null
  thread: Thread | null
  userInput: string
}
type ResponseMetadata = {
  finish_reason?: string
}

export default function AIMessage({ client, thread, assistant, userInput }: props) {
  const [text, setText] = useState<string>("")
  const [lastInput, setLastInput] = useState<string>("")
  const [nodes, setNodes] = useState<string[]>([])
  const [tools,setTools] = useState<string>("")
  let effect = false
  useEffect(() => {
    setText("....")
    console.log("userInput:", userInput, "lastInput:", lastInput, "effect", effect)
    if (userInput == lastInput || effect) return;
    effect = true
    getAIResponse(userInput)
    //test1(userInput)
  }, [])
  const test1 = async (userInput: string) => {
    let idx = 0
    let timer: NodeJS.Timeout
    timer = setInterval(() => {
      setText(userInput.substring(0, idx))
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
  const getAIResponse = async (userInput: string) => {
    let aimsg = ""
    if (client) {
      const streamResponse = client.runs.stream(
        thread!["thread_id"],
        assistant!["assistant_id"],
        {
          "input": { messages: [{ "role": "user", "content": userInput }] },
          "streamMode": ["events", "updates", "messages"]
        }
      );
      let llmResponse = "";
      for await (const chunk of streamResponse) {
        console.log(chunk);
        if (chunk.event === "updates") {
          setNodes((prev) => [...prev, Object.keys(chunk.data)[0]])
        }
        if (chunk.event === "messages/partial") {
          chunk.data.forEach((dataItem: { role: string; content: string; tool_calls: never[]; invalid_tool_calls: never[]; response_metadata: {}; })  => {
            if (dataItem.role && dataItem.role === "user") {
              console.log(`Human: ${dataItem.content}`);
            } else {
              const toolCalls = dataItem.tool_calls || [];
              const invalidToolCalls = dataItem.invalid_tool_calls || [];
              const content = dataItem.content || "";
              const responseMetadata:ResponseMetadata = dataItem.response_metadata || {};

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
          setText(llmResponse)
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
    }
  }
  return (<>
    <div className="p-1 bg-green-100 text-orange-400">
      <div className="flex flex-col gap-1">
        <div className="text-purple-300"> {tools} </div>
        <h2>{nodes.join('->')}</h2>
        {text}
      </div>
    </div>
  </>)
}