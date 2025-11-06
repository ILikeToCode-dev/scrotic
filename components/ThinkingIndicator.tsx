// A simple loading indicator component.
import React from 'react';

const ThinkingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{animationDelay: '75ms'}}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{animationDelay: '150ms'}}></div>
    </div>
  );
};

export default ThinkingIndicator;
