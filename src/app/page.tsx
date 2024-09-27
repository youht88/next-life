'use client'
import ThemeToggle from '@/components/alt/theme_toggle';

import { JSONTree } from 'react-json-tree';

export default function App() {
  const jsonData={
    "name":"youht",
    "age": 20,
    "class": [ {
        "name":"A",
        "score":23.22
    },{
        "name":"b",
        "score":60.42
    }]
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">主题切换示例</h1>
        <ThemeToggle />
      </header>
      <main className="p-4">
        <p className="text-gray-800 dark:text-gray-200">
          这是一个使用 shadcn 和 Tailwind CSS 的主题切换示例。
        </p>
      </main>
      <div className="absolute top-10 right-10 bg-slate-200 p-2.5 }">
          <JSONTree data={jsonData} invertTheme={true}></JSONTree>
      </div>
    </div>
  );
}