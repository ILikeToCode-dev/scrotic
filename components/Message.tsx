// Renders a single chat message, distinguishing between user and model.
import React from 'react';
import { Message as MessageType, Sender } from '../types';
import { ModelIcon, UserIcon } from './icons';
import ThinkingIndicator from './ThinkingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUserModel = message.sender === Sender.User;

  // The model sometimes includes its name in the response. Let's strip it.
  const cleanText = message.text.replace(/^Gemini\s*\n*/i, '');

  return (
    <div className={`flex items-start gap-3 my-4`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUserModel ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
        {isUserModel ? <UserIcon className="w-5 h-5" /> : <ModelIcon className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="font-bold">{isUserModel ? 'You' : 'Gemini'}</p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.imageUrl && (
                <div className="my-2">
                    <img src={message.imageUrl} alt="User upload" className="max-w-xs rounded-lg border" />
                </div>
            )}
            {message.isTyping && !message.text ? (
              <ThinkingIndicator />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {cleanText}
              </ReactMarkdown>
            )}
        </div>
      </div>
    </div>
  );
};

export default Message;