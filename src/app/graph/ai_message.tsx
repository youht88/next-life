'use client'
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { useEffect, useState } from "react";

type props = {
    client: Client | null
    assistant: Assistant | null
    thread: Thread | null
    userInput: string
}

export default function AIMessage({client,thread,assistant,userInput}:props){
    const [text,setText] = useState<string>("")
    useEffect(()=>{
        setText("....")
        getAIResponse(userInput)
    },[])
    const getAIResponse = async (userInput: string): Promise<string> => {
        let aimsg = ""
        if (client) {
          const streamResponse = client.runs.stream(
            thread!["thread_id"],
            assistant!["assistant_id"],
            { "input": { messages:[ {"role":"user","content":userInput}] } }
          );
          for await (const chunk of streamResponse) {
            console.log(chunk);
            if (chunk.data && chunk.event !== "metadata") {
              const messages = chunk.data["messages"]
              const message = messages[messages.length - 1]
              if (message.type=='ai' && message.content){
                  aimsg = message.content
                  setText(aimsg)
              }else{
                setText("think....")
              }

            }
          }
        }
        return aimsg
      };
    return (<>
        <div className="p-2 bg-green-100 text-orange-400">
            {text}
        </div>
    </>)
}