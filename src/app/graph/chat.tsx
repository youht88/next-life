'use client'
// components/Chat.tsx
import { StringLib } from '@/lib/data_utils';
import { Assistant, Client, Cron, Thread } from '@langchain/langgraph-sdk';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AIMessage from './ai_message';
import { Message } from './interface';
import SystemMessage from './system_message';
import UserMessage from './user_message';


type graphCloudProps = {
  client: Client | null | undefined
  assistant: Assistant | null | undefined
  thread: Thread | null | undefined
}

export default function Chat({ client, thread, assistant }: graphCloudProps) {
  const [theme, setTheme] = useState('dark')
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userInput = input.trim()
    // 添加用户消息
    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    // 清空输入框
    setInput('');

    if (userInput.startsWith('/')) {
      handleSystemMessage(input)
    } else {
      const aiMessage: Message = { text: userInput, client, assistant, thread, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    }
    // 将焦点重新设置到输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleSystemMessage = async (input: string) => {
    const inputs = input.trim().split(" ").filter(item => item)
    const method = inputs.shift()
    const true_input = inputs.join(" ")
    switch (method) {
      case '/once':
        const once_msg1: Message = { text: "单次执行,不记录到对话", once: true, sender: 'system' }
        const once_msg2: Message = { text: true_input, once: true, sender: 'ai', client, assistant }
        setMessages((prev) => [...prev, once_msg1, once_msg2]);
        break;
      case '/cron':
        const schedule_list = true_input.split(" ")
        const msg = schedule_list.splice(5).join(" ")
        const schedule = schedule_list.join(" ")
        const schedule_description = StringLib.translateCron(schedule)
        console.log("???? cron schedule:", schedule, '|', msg)
        const cron_job: Cron = await client!.crons.create(
          assistant!["assistant_id"],
          {
            schedule,
            input: { "messages": [{ "role": "user", "content": msg }] }
          },
        )
        const cron_msg: Message = { text: `${schedule_description}\n任务ID=${cron_job.cron_id},为避免浪费资源,请及时删除该任务`, sender: 'system' };
        setMessages((prev) => [...prev, cron_msg]);
        break;
      case '/drop':
        const run_id = true_input
        await client!.crons.delete(run_id);
        setMessages((prev) => [...prev, { text: `任务${run_id}已删除.`, sender: 'system' }]);
        break;
      case '/list':
        const res = await client!.crons.search();
        const res_sample = res.map((item) => {
          return {
            id: item.cron_id,
            schedule: item.schedule,
            content: item.payload.input ?? ["messages"][0] ?? ["content"]
          }
        })
        if (res_sample.length == 0) {
          setMessages((prev) => [...prev, { text: "没有定时任务", sender: 'system' }]);
        } else {
          setMessages((prev) => [...prev, { text: `${JSON.stringify(res_sample)}`, sender: 'system' }]);
        }
        break
      case '/h':
      case '/help':
      default:
        const help_text = "**指令说明:**\
          \n 1. **/help** 显示指令说明\
          \n 2. **/cron <cron> <msg>** 定时执行msg,例如:每小时执行一次 /cron 0 * * * * 3+2=？\
          \n 4. **/once <msg>** 一次性执行\
          \n 5. **/drop <run_id>** 删除已经定义任务"
        const systemMessage: Message = { text: help_text, sender: 'system' }
        setMessages((prev) => [...prev, systemMessage]);
    }
  }
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
              <span className={`inline-block p-1 bg-gray-100 border rounded-lg text-sm `}>
                {(() => {
                  switch (msg.sender) {
                    case 'user':
                      return <UserMessage {...msg}></UserMessage>
                    case 'ai':
                      return <AIMessage {...msg} />
                    default:
                      return <SystemMessage {...msg}></SystemMessage>
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

