// Provides the text input field and send button for the chat.
import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, XCircleIcon } from './icons';

interface ImageFile {
    data: string; // base64 encoded
    mimeType: string;
    previewUrl: string; // data URL
}

interface InputAreaProps {
  onSendMessage: (message: string, image?: { data: string, mimeType: string }) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            // data:[<mime type>];base64,<data>
            const base64Data = dataUrl.split(',')[1];
            setImage({
                data: base64Data,
                mimeType: file.type,
                previewUrl: dataUrl
            });
        };
        reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again
    if(e.target) {
        e.target.value = '';
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || image) && !isLoading) {
      onSendMessage(inputValue, image ? { data: image.data, mimeType: image.mimeType } : undefined);
      setInputValue('');
      setImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
       {image && (
          <div className="relative mb-2 w-24 h-24 rounded-md overflow-hidden border">
              <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 p-0.5 bg-gray-900/60 text-white rounded-full hover:bg-gray-900/80 transition-colors"
                  aria-label="Remove image"
              >
                  <XCircleIcon className="w-5 h-5" />
              </button>
          </div>
      )}
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your math problem..."
          className="w-full p-2 pl-12 pr-12 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-800 placeholder:text-gray-500"
          rows={1}
          disabled={isLoading}
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          disabled={isLoading}
          aria-label="Upload image"
        >
            <PaperclipIcon className="w-5 h-5"/>
        </button>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || (!inputValue.trim() && !image)}
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
};

export default InputArea;