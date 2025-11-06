// A side panel for managing whiteboard files and folders.
import React, { useState, useEffect } from 'react';
import { UserIcon, TrashIcon, FileIcon, FolderIcon, EditIcon } from './icons';
import { Message, Sender, FileSystemItem, WhiteboardFile } from '../types';
import WhiteboardThumbnail from './HistoryThumbnail';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface FileItemProps {
  item: FileSystemItem;
  level: number;
  activeFileId: string | null;
  onSelectFile: (file: WhiteboardFile) => void;
  onDeleteItem: (itemId: string) => void;
  onRenameItem: (itemId: string, newName: string) => void;
  onMoveItem: (draggedItemId: string, targetFolderId: string | null) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, level, activeFileId, onSelectFile, onDeleteItem, onRenameItem, onMoveItem }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(item.name);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    if (name.trim()) {
      onRenameItem(item.id, name.trim());
    } else {
      setName(item.name); // Revert if empty
    }
    setIsRenaming(false);
  };
  
  const handleItemClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(item);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId !== item.id) {
        setIsDragOver(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.stopPropagation();
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const draggedItemId = e.dataTransfer.getData('text/plain');
      if (draggedItemId && draggedItemId !== item.id) {
        onMoveItem(draggedItemId, item.id);
      }
    }
  };


  return (
    <div className="w-full">
      <div 
        onClick={isRenaming ? undefined : handleItemClick}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group flex items-center p-1.5 rounded-md cursor-pointer transition-colors
            ${isDragging ? 'opacity-40' : ''}
            ${isDragOver ? 'bg-blue-100 ring-2 ring-blue-300' : ''}
            ${activeFileId === item.id && !isDragOver ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        style={{ paddingLeft: `${level * 16 + 6}px` }}
      >
        <div className="flex items-center gap-2 flex-1 truncate">
          {item.type === 'folder' ? (
            <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          ) : (
            <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="w-full text-sm bg-white border border-blue-400 rounded px-1 py-0"
            />
          ) : (
            <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsRenaming(true)} className="p-1 text-gray-500 hover:text-blue-600 rounded"><EditIcon className="w-4 h-4" /></button>
            <button onClick={() => onDeleteItem(item.id)} className="p-1 text-gray-500 hover:text-red-600 rounded"><TrashIcon className="w-4 h-4" /></button>
        </div>
      </div>
      {item.type === 'file' && activeFileId === item.id && (
          <div className="py-1" style={{ paddingLeft: `${level * 16 + 6}px` }}>
            <WhiteboardThumbnail paths={item.paths} width={220 - (level * 16 + 6)} height={100} />
          </div>
      )}
      {item.type === 'folder' && isExpanded && (
        <div className="w-full">
          {item.children.map(child => (
            <FileItem 
                key={child.id}
                item={child}
                level={level + 1}
                activeFileId={activeFileId}
                onSelectFile={onSelectFile}
                onDeleteItem={onDeleteItem}
                onRenameItem={onRenameItem}
                onMoveItem={onMoveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};


interface FilePanelProps {
    onClear: () => void;
    onSaveFile: (parentId: string | null) => void;
    onAddFolder: (parentId: string | null) => void;
    canSaveFile: boolean;
    messages: Message[];
    fileSystem: FileSystemItem[];
    activeFileId: string | null;
    onSelectFile: (file: WhiteboardFile) => void;
    onDeleteItem: (itemId: string) => void;
    onRenameItem: (itemId: string, newName: string) => void;
    onMoveItem: (draggedItemId: string, targetFolderId: string | null) => void;
}

const FilePanel: React.FC<FilePanelProps> = ({ 
    onClear,
    onSaveFile,
    onAddFolder,
    canSaveFile,
    messages,
    fileSystem,
    activeFileId,
    onSelectFile,
    onDeleteItem,
    onRenameItem,
    onMoveItem
}) => {
    const problemMessage = messages.find(m => m.sender === Sender.User);
    const [isRootDragOver, setIsRootDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsRootDragOver(true);
    };
    const handleDragLeave = () => {
        setIsRootDragOver(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsRootDragOver(false);
        const draggedItemId = e.dataTransfer.getData('text/plain');
        if (draggedItemId) {
            // Check if the drop is on the panel itself and not on a child that stopped propagation
            if (e.target === e.currentTarget) {
                onMoveItem(draggedItemId, null);
            }
        }
    };

    return (
        <aside className="w-72 h-full flex flex-col border-r bg-white shadow-lg p-4 flex-shrink-0">
            {problemMessage && (
                <div className="mb-4 pb-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">The Problem</h2>
                     <div className="flex items-start gap-3 my-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold">You</p>
                             <div className="prose prose-sm dark:prose-invert max-w-none">
                                {problemMessage.imageUrl && (
                                    <div className="my-2"><img src={problemMessage.imageUrl} alt="User upload" className="max-w-full rounded-lg border" /></div>
                                )}
                                {problemMessage.text && (
                                     <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{problemMessage.text}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2 mb-4">
                 <button 
                    onClick={() => onSaveFile(null)} 
                    disabled={!canSaveFile}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileIcon className="w-5 h-5" />
                    <span>Save as File</span>
                </button>
                 <div className="flex items-center gap-2 pt-2">
                     <button
                        onClick={() => onAddFolder(null)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded text-gray-700 font-medium bg-gray-100 hover:bg-gray-200"
                    >
                        <FolderIcon className="w-5 h-5 text-gray-500" />
                        <span>New Folder</span>
                    </button>
                    <button
                        onClick={onClear}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded text-red-600 font-medium hover:bg-red-50"
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span>Clear Canvas</span>
                    </button>
                </div>
            </div>
            
            <h3 className="text-md font-semibold text-gray-700 mb-2 border-t pt-4">Files</h3>
            <div 
                className={`flex-1 overflow-y-auto space-y-1 pr-2 -mr-4 rounded-md transition-colors ${isRootDragOver ? 'bg-blue-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                 {fileSystem.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 pt-4 px-2">
                        <p>Your saved drawings and folders will appear here.</p>
                    </div>
                ) : (
                    fileSystem.map((item) => (
                        <FileItem 
                            key={item.id}
                            item={item}
                            level={0}
                            activeFileId={activeFileId}
                            onSelectFile={onSelectFile}
                            onDeleteItem={onDeleteItem}
                            onRenameItem={onRenameItem}
                            onMoveItem={onMoveItem}
                        />
                    ))
                )}
            </div>
        </aside>
    );
};

export default FilePanel;