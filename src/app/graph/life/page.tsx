"use client"
// pages/index.tsx
import Head from 'next/head';
import React, { useCallback, useRef, useState } from 'react';
import Chat from './chat';

const Home: React.FC = () => {
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 用于处理滚动到最底部
  const handleNewMessage = useCallback(() => {
    setScrollToBottom(true);
  }, []);

  // 处理滚动逻辑
  React.useEffect(() => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setScrollToBottom(false);
    }
  }, [scrollToBottom]);

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Chat with AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 overflow-hidden">
        <Chat onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
};

export default Home;