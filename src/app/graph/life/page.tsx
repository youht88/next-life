"use client"
// pages/index.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
// lib/mongodb.ts
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import Chat from '../chat';

const uri = "http://192.168.23.57:8123"; // 从环境变量中获取 MongoDB URI
const options = {};

console.log("HERE!!!!!!!!")
export default function Home(){
    const [theme, setTheme] = useState('light')
    const [client, setClient] = useState<Client|null>(null);
    const [assistant, setAssistant] = useState<Assistant|null>(null);
    const [thread, setThread] = useState<Thread|null>(null);
    useEffect(() => {
      const initLanggraph = async ()=>{
        if (client) return;
        console.log("initLanggraph....")
        const _client = new Client({apiUrl:uri}); 
        setClient(_client);
        const _assistants = await _client.assistants.search();
        const assistant = _assistants.find((a:Assistant) => a.graph_id=="life")
        setAssistant(assistant!)
        const _thread =  await _client.threads.create();
        setThread(_thread)
      }
      initLanggraph()
    }, [])
    
    return (
      <div className="flex flex-col h-screen">
        <Head>
          <title>Chat with AI</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex-1 overflow-hidden">
          <Chat client={client} assistant={assistant} thread={thread}  />
        </div>
      </div>
    );
  };
