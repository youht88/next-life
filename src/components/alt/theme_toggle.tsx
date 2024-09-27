'use client'
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem("theme",newTheme)
      return newTheme;
    });
  };

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
      Toggle Theme
    </button>
  );
}

export default ThemeToggle;