"use client"
// pages/index.tsx
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
// lib/mongodb.ts
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import Chat from './chat';

const uri = "http://youht.cc:18123"; // 从环境变量中获取 MongoDB URI
const options = {};

console.log("HERE!!!!!!!!")

export default function Home(){
    const [scrollToBottom, setScrollToBottom] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [theme, setTheme] = useState('light')
    // 用于处理滚动到最底部
    const handleNewMessage = useCallback(() => {
      setScrollToBottom(true);
    }, []);
    const [client, setClient] = useState<Client|null>(null);
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [thread, setThread] = useState<Thread|null>(null);
    useEffect(() => {
      const initLanggraph = async ()=>{
        if (client) return;
        console.log("initLanggraph....")
        const _client = new Client({apiUrl:uri}); 
        setClient(_client);
        const _assistants = await _client.assistants.search();
        setAssistants(_assistants)
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
          <Chat client={client} assistants={assistants} thread={thread}  />
        </div>
      </div>
    );
  };
