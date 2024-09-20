import { CheckCheck, Copy } from 'lucide-react';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface CodeBlockProps extends React.ComponentProps<'code'> {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2 秒后重置状态
  };

  return !inline && match ? (
    <div className="code-block-container">
      <SyntaxHighlighter
        {...props}
        style={oneDark}
        showLineNumbers={true}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
      <CopyToClipboard text={String(children)} onCopy={handleCopy}>
        <div className={`copy-button ${isCopied ? 'copied' : ''}`}>
          {isCopied ? <CheckCheck size={16}/> : <Copy size={16}/>}
        </div>
      </CopyToClipboard>
    </div>
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
};

export const CodeMarkdownWidget = ({ text }: { text: string }) => {
    return (
      <ReactMarkdown components={{ code: CodeBlock }}>{text}</ReactMarkdown>
    );
  };
  
