'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatBubbleProps {
  chatbotUrl: string;
}

export default function ChatBubble({ chatbotUrl }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewSession, setIsNewSession] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 处理iframe加载完成事件
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // 处理点击切换聊天窗口显示状态
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isNewSession && !isOpen) {
      setIsNewSession(false);
    }
  };

  // 点击按钮外部时关闭聊天窗口
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const bubbleContainer = document.getElementById('chat-bubble-container');
      if (bubbleContainer && !bubbleContainer.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div id="chat-bubble-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 聊天窗口 */}
      {isOpen && (
        <div className="mb-4 rounded-lg shadow-xl overflow-hidden bg-white dark:bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] w-96 h-[600px] animate-slide-up sm:w-96 max-sm:w-[calc(100vw-32px)] max-sm:h-[70vh]">
          <div className="flex justify-between items-center px-4 py-3 bg-[var(--sidebar-bg)] border-b border-[var(--sidebar-border)]">
            <h3 className="font-medium text-[var(--foreground)] flex items-center">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              SK Docs AI助手
            </h3>
            <button
              onClick={toggleChat}
              className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              aria-label="关闭聊天窗口"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="relative w-full h-[calc(100%-48px)]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)] z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--link-color)]"></div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={chatbotUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title="SK Docs Chatbot"
            ></iframe>
          </div>
        </div>
      )}

      {/* 聊天泡泡按钮 */}
      <button
        onClick={toggleChat}
        className="rounded-full w-14 h-14 bg-[var(--link-color)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--link-hover)] transition-colors focus:outline-none animate-pulse-slow"
        aria-label={isOpen ? "关闭聊天" : "打开聊天"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
      
      {/* 新消息提示或欢迎提示 */}
      {!isOpen && isNewSession && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-[var(--sidebar-bg)] text-[var(--foreground)] px-4 py-2 rounded-lg shadow-md border border-[var(--sidebar-border)] mb-2 animate-bounce">
          <div className="relative text-sm font-medium">
            有问题？点击开始聊天！
            <div className="absolute w-2 h-2 bg-white dark:bg-[var(--sidebar-bg)] rotate-45 border-r border-b border-[var(--sidebar-border)] -bottom-1 right-6"></div>
          </div>
        </div>
      )}
    </div>
  );
}
