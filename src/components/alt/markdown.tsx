import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    inline?: boolean;
    className?: string;
    children: React.ReactNode; // 必需
  } & Omit<React.HTMLProps<HTMLElement>, 'ref'>;

  interface MarkdownProps {
    text: string;
  }
export const MarkdownWidget:React.FC<MarkdownProps> = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      components={{
        code({
          inline,
          className,
          children,
          ...props
        }: Props) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={dark}
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
};
