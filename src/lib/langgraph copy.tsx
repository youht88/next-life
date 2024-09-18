'use client'
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface _LanggraphContext{
    client: Client | null
    assistants: Assistant[] | null
    thread: Thread | null
}
const LanggraphContext = createContext<_LanggraphContext | null>(null);

export const LanggraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client|null>(null);
  const [assistants, setAssistants] = useState<Assistant[]|null>(null);
  const [thread, setThread] = useState<Thread|null>(null);

  useEffect(() => {
    const uri = 'http://youht.cc:18123';
    const options = {};
    setClient(new Client({apiUrl:uri}));      
    const searchAssistants = async ()=>{
        const _assistants = await client!.assistants.search()
        setAssistants(_assistants)
    }
    const createThread = async () => {
        const _thread = await client!.threads.create()
        setThread(_thread)
    };

    searchAssistants()
    createThread();

    // 清理函数
    return () => {
    };
  }, []);
  return (
    <LanggraphContext.Provider value={{client,assistants,thread}}>
      {children}
    </LanggraphContext.Provider>
  );
};

export const useLanggraph = () => {
  const context = useContext(LanggraphContext);
  if (!context) {
    throw new Error('useLanggraph must be used within a LanggraphProvider');
  }
  return context;
};