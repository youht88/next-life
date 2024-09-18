'use client'
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-800">
      Toggle Theme
    </button>
  );
}

export default function App() {
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
    </div>
  );
}