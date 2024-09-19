"use client"
import { useState } from 'react';
import Chat from '../chat';
import { useLanggraph } from '../use_langgraph';

export default function Home(){
    const [theme, setTheme] = useState('dark')
    const { client, assistant, thread } = useLanggraph("test");

    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-hidden">
          <Chat client={client} assistant={assistant} thread={thread}  />
        </div>
      </div>
    );
  };
