// A toolbar for the whiteboard with drawing tools.
import React from 'react';
import { PencilIcon, EraserIcon } from './icons';
import { WhiteboardTool } from '../types';

interface WhiteboardToolbarProps {
  tool: WhiteboardTool;
  setTool: (tool: WhiteboardTool) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
}

const COLORS = ['#000000', '#EF4444', '#3B82F6', '#22C55E'];
const SIZES = [2, 5, 10];

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-white rounded-lg shadow-md border">
      {/* Tool Selector */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Pen"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Eraser"
        >
          <EraserIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Color Palette */}
      <div className="flex items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full transition-transform transform ${color === c ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'}`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Size Selector */}
      <div className="flex items-center gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full flex items-center justify-center transition-colors ${size === s ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`}
            style={{ width: s + 16, height: s + 16 }}
            title={`Size ${s}`}
          >
            <div className="bg-black rounded-full" style={{ width: s, height: s }}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
