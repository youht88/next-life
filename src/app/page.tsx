'use client'
import ThemeToggle from '@/components/alt/theme_toggle';
import { Badge, Descriptions, DescriptionsProps, Divider, Flex } from 'antd';

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
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'UserName',
      children: <p>youht</p>,
    },
    {
      key: '2',
      label: 'Telephone',
      children: <p>13906056442</p>,
    },
    {
      key: '3',
      label: 'Live',
      children: <Flex className="gap-2"><Badge status="processing"/><p>厦门</p></Flex>,
    },
    {
      key: '4',
      label: 'Remark',
      children: <p>其他备注信息</p>,
    },
    {
      key: '5',
      label: 'Address',
      children: <p>No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</p>,
    },
  ];
  
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
        <Divider></Divider>
        <Descriptions title="User Info" bordered items={items} />
      </main>
      <div className="absolute top-10 right-10 bg-slate-200 p-2.5 }">
          <JSONTree data={jsonData} invertTheme={true}></JSONTree>
      </div>
    </div>
  );
}