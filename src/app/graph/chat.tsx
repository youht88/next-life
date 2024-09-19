'use client'
// components/Chat.tsx
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AIMessage from './ai_message';
import SystemMessage from './system_message';
import UserMessage from './user_message';

interface Message {
  text: string;
  sender: 'user' | 'ai' | 'system';
}

type props = {
  client: Client | null
  assistant: Assistant | null
  thread: Thread | null
}

export default function Chat({ client, thread, assistant }: props) {
  const [theme, setTheme] = useState('dark')
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const handleSend = async () => {
    if (!input.trim()) return;
    setUserInput(input.trim())
    // 添加用户消息
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    // 清空输入框
    setInput('');

    if (input.startsWith('/')) {
      const systemMessage: Message = { text: input, sender: 'system' }
      setMessages((prev) => [...prev, systemMessage]);
    } else {
      const aiMessage: Message = { text: "...", sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    }
    // 将焦点重新设置到输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 检查是否在中文输入法状态
    if (event.key === 'Enter') {
      event.preventDefault(); // 防止换行
      handleSend();
    }
  };
  // 自动滚动到最底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]); // 监听 messages 的变化

  useEffect(() => {
    console.log("chat theme:", localStorage.getItem("theme"))
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col w-full h-full p-4">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right mr-2' : msg.sender === 'ai' ? 'text-left' : 'text-center'}`}>
              <span className={`inline-block p-2 rounded-lg text-sm `}>
                {(() => {
                  switch (msg.sender) {
                    case 'user':
                      return <UserMessage text = {msg.text}></UserMessage>
                    case 'ai':
                      return <AIMessage client={client} thread={thread} assistant={assistant} userInput={userInput} />
                    default:
                      return <SystemMessage text={msg.text}></SystemMessage>
                  }
                })()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-10" />
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg dark:text-white text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-r-lg dark:text-black"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

