
// Displays the list of messages and the input area.
import React, { useRef, useEffect } from 'react';
import Message from './Message';
import InputArea from './InputArea';
import { Message as MessageType, Sender } from '../types';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (message: string, image?: { data: string; mimeType: string; }) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (messagesEndRef.current && container) {
      const isUserScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 100;
      
      // Don't autoscroll if the user has scrolled up to read history
      if (!isUserScrolledUp) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Fix: Simplify dependency array for scrolling effect.
  }, [messages]);

  const problemMessage = messages.find(m => m.sender === Sender.User && (m.imageUrl || m.text.trim().length > 0));
  const otherMessages = messages.filter(m => m.id !== problemMessage?.id);

  return (
    <div className="flex flex-col h-full bg-gray-50 border rounded-lg shadow-sm">
      {problemMessage && (
        <div className="p-4 border-b bg-white flex-shrink-0">
          <p className="text-sm font-semibold text-gray-600 mb-2">The Problem</p>
          <Message message={problemMessage} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
        {otherMessages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;