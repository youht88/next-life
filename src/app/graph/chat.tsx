'use client'
// components/Chat.tsx
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AIMessage from './ai_message';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

type props = {
  client: Client | null
  assistant: Assistant | null
  thread: Thread | null
}

export default function Chat({client,thread,assistant}:props) {
    const [theme, setTheme] = useState('dark')
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const handleSend = async () => {
      if (!input.trim()) return;
      // 添加用户消息
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      // 清空输入框
      setInput('');

      // 模拟 AI 响应
      const aiMessage: Message = { text: "...", sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);

      // 将焦点重新设置到输入框
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
  
    // 处理键盘事件
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // 检查是否在中文输入法状态
      if (event.nativeEvent.isComposing || event.key === 'Enter' && !event.nativeEvent.isComposing) {
        if (event.key === 'Enter') {
          event.preventDefault(); // 防止换行
          handleSend();
        }
      }
    };
    // 自动滚动到最底部
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, [messages]); // 监听 messages 的变化
    
    useEffect(() => {
        console.log("chat theme:",localStorage.getItem("theme"))
    }, []);

    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col w-full h-full p-4">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right mr-2' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                  {msg.sender==='user' ? msg.text : <AIMessage client={client} thread={thread} assistant={assistant} userInput={input} />}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-lg dark:text-white"
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

