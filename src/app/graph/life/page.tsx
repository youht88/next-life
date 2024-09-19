"use client"
import Head from 'next/head';
import { useState } from 'react';
import Chat from '../chat';
import { useLanggraph } from '../use_langgraph';

export default function Home(){
    const [theme, setTheme] = useState('light')
    const {client,assistant,thread} = useLanggraph("life")    
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
