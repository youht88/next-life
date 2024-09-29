"use client"
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Chat from './chat';
import { GraphProps } from './interface';
import { useLangserve } from './use_langserve';

export default function Home(){
    const searchParams = useSearchParams()
    const agent = searchParams.get("agent")
    const [theme, setTheme] = useState('light')
    //const graphClient:GraphProps = useGraphcloud(agent!)    
    const graphClient:GraphProps = useLangserve(agent!)   
    return (
      <div className="flex flex-col h-screen">
        <Head>
          <title>Chat with AI</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex-1 overflow-hidden">
          <Chat {...graphClient}  />
        </div>
      </div>
    );
  };