'use client';

import { Message } from '@/lib/types';
import { copyToClipboard, formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Message Content */}
      <div className={`${isUser ? 'max-w-[70%]' : 'w-full'}`}>
        <div
          className={`${
            isUser
              ? 'bg-gray-100 dark:bg-gray-800 rounded-2xl px-5 py-3'
              : 'px-0 py-1'
          }`}
        >
          {isUser ? (
            <div className="text-[15px] leading-7 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="markdown-content text-[15px] leading-7 text-gray-900 dark:text-gray-100">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({children}) => <p className="my-4 first:mt-0 last:mb-0">{children}</p>,
                  h1: ({children}) => <h1 className="text-2xl font-semibold mt-6 mb-4">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-semibold mt-6 mb-4">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-semibold mt-6 mb-4">{children}</h3>,
                  code: ({inline, children, ...props}: any) => 
                    inline ? (
                      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ),
                  pre: ({children}) => <pre className="my-4">{children}</pre>,
                  ul: ({children}) => <ul className="my-4 list-disc list-inside space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="my-4 list-decimal list-inside space-y-1">{children}</ol>,
                  // ReactMarkdown ensures li is wrapped in ul/ol
                  li: ({children}) => <li className="my-1">{children}</li>,
                  a: ({children, href}) => (
                    <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Sources - Only for AI messages */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                📚 Nguồn tham khảo:
              </p>
              <div className="space-y-2">
                {message.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        📄 {source.documentName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Trang {source.pageNumber}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      &quot;{source.content}&quot;
                    </p>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Độ chính xác: {Math.round(source.score * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata - Actions for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={copied ? 'Đã copy' : 'Copy'}
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

