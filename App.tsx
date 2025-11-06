// The main application component that orchestrates the entire UI and state management.
import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import Whiteboard, { WhiteboardHandle } from './components/Whiteboard';
import HistoryPanel from './components/HistoryPanel';
import { Message, Sender, WhiteboardPath, FileSystemItem, WhiteboardFile, WhiteboardFolder } from './types';
import { generateTextStream, startChat } from './services/geminiService';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [paths, setPaths] = useState<WhiteboardPath[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const whiteboardRef = useRef<WhiteboardHandle>(null);
    const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    // Initialize chat service on mount
    useEffect(() => {
        startChat();
    }, []);

    // Load file system from local storage on mount
    useEffect(() => {
        try {
            const savedFileSystem = localStorage.getItem('socraticTutorFileSystem');
            if (savedFileSystem) {
                setFileSystem(JSON.parse(savedFileSystem));
            }
        } catch (error) {
            console.error("Failed to load from local storage", error);
        }
    }, []);

    // Save file system to local storage on change
    useEffect(() => {
        try {
            localStorage.setItem('socraticTutorFileSystem', JSON.stringify(fileSystem));
        } catch (error) {
            console.error("Failed to save to local storage", error);
        }
    }, [fileSystem]);

    const handleNewPath = (path: WhiteboardPath) => {
        setPaths(prev => [...prev, path]);
    };

    const handleSendMessage = async (text: string, image?: { data: string; mimeType: string }) => {
        setIsLoading(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: Sender.User,
        };
        if (image) {
            userMessage.imageUrl = `data:${image.mimeType};base64,${image.data}`;
        }
        
        const isNewProblem = messages.length === 0 || messages.every(m => m.sender !== Sender.User);
        if (isNewProblem) {
            startChat(); // Reset chat history for a new problem
        }
        
        const newMessages = isNewProblem ? [userMessage] : [...messages, userMessage];
        setMessages(newMessages);

        const modelMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '',
            sender: Sender.Model,
            isTyping: true,
        };
        setMessages(prev => [...prev, modelMessage]);

        try {
            const stream = generateTextStream(text, image);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev =>
                    prev.map(m =>
                        m.id === modelMessage.id ? { ...m, text: fullResponse, isTyping: true } : m
                    )
                );
            }
             setMessages(prev =>
                    prev.map(m =>
                        m.id === modelMessage.id ? { ...m, text: fullResponse, isTyping: false } : m
                    )
                );

        } catch (error) {
            console.error('Error generating text:', error);
             setMessages(prev =>
                prev.map(m =>
                    m.id === modelMessage.id ? { ...m, text: "Sorry, I encountered an error.", isTyping: false } : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    const findItem = (items: FileSystemItem[], itemId: string): FileSystemItem | null => {
        for (const item of items) {
            if (item.id === itemId) return item;
            if (item.type === 'folder') {
                const found = findItem(item.children, itemId);
                if (found) return found;
            }
        }
        return null;
    };

    const deleteItemRecursive = (items: FileSystemItem[], itemId: string): FileSystemItem[] => {
        return items.filter(item => {
            if (item.id === itemId) return false;
            if (item.type === 'folder') {
                item.children = deleteItemRecursive(item.children, itemId);
            }
            return true;
        });
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item and all its contents?')) {
            setFileSystem(prev => deleteItemRecursive(prev, itemId));
            if (activeFileId === itemId) {
                handleClearCanvas();
            }
        }
    };

    const renameItemRecursive = (items: FileSystemItem[], itemId: string, newName: string): FileSystemItem[] => {
        return items.map(item => {
            if (item.id === itemId) {
                return { ...item, name: newName };
            }
            if (item.type === 'folder') {
                return { ...item, children: renameItemRecursive(item.children, itemId, newName) };
            }
            return item;
        });
    };

    const handleRenameItem = (itemId: string, newName: string) => {
        setFileSystem(prev => renameItemRecursive(prev, itemId, newName));
    };

    const handleMoveItem = (draggedItemId: string, targetFolderId: string | null) => {
        let draggedItem: FileSystemItem | null = null;
        
        const removeItem = (items: FileSystemItem[], id: string): FileSystemItem[] => {
            const newItems: FileSystemItem[] = [];
            for (const item of items) {
                if (item.id === id) {
                    draggedItem = item;
                } else {
                    if (item.type === 'folder') {
                        item.children = removeItem(item.children, id);
                    }
                    newItems.push(item);
                }
            }
            return newItems;
        };
        
        const fsCopy = JSON.parse(JSON.stringify(fileSystem));
        const tempFileSystem = removeItem(fsCopy, draggedItemId);
        if (!draggedItem) return;

        draggedItem.parentId = targetFolderId;

        const addItem = (items: FileSystemItem[], targetId: string | null, itemToAdd: FileSystemItem): FileSystemItem[] => {
            if (targetId === null) {
                return [itemToAdd, ...items];
            }
            return items.map(item => {
                if (item.id === targetId && item.type === 'folder') {
                    item.children = [itemToAdd, ...item.children];
                } else if (item.type === 'folder') {
                    item.children = addItem(item.children, targetId, itemToAdd);
                }
                return item;
            });
        };

        setFileSystem(addItem(tempFileSystem, targetFolderId, draggedItem));
    };
    
    const handleSelectFile = (file: WhiteboardFile) => {
        setActiveFileId(file.id);
        setPaths(file.paths);
        setMessages(file.messages);
        startChat(); // Reset chat to load history from file, though history isn't implemented in service yet
    };

    const updateFileInTree = (items: FileSystemItem[], fileToUpdate: WhiteboardFile): FileSystemItem[] => {
        return items.map(item => {
            if (item.id === fileToUpdate.id) {
                return fileToUpdate;
            }
            if (item.type === 'folder') {
                return { ...item, children: updateFileInTree(item.children, fileToUpdate) };
            }
            return item;
        });
    };

    const handleSaveFile = (parentId: string | null) => {
        if (activeFileId) {
            const item = findItem(fileSystem, activeFileId);
            const updatedFile: WhiteboardFile = {
                id: activeFileId,
                type: 'file',
                name: item?.name || 'Untitled',
                paths: paths,
                messages: messages,
                parentId: (item as WhiteboardFile)?.parentId ?? null,
            };
            setFileSystem(prev => updateFileInTree(prev, updatedFile));
            alert('File updated successfully!');
        } else {
            const newFile: WhiteboardFile = {
                id: `file-${Date.now()}`,
                type: 'file',
                name: `Problem ${new Date().toLocaleDateString()}`,
                paths: paths,
                messages: messages,
                parentId: parentId,
            };
            
            const addItem = (items: FileSystemItem[], targetId: string | null, itemToAdd: FileSystemItem): FileSystemItem[] => {
                if (targetId === null) {
                    return [itemToAdd, ...items];
                }
                return items.map(item => {
                    if (item.id === targetId && item.type === 'folder') {
                        item.children = [itemToAdd, ...item.children];
                    } else if (item.type === 'folder') {
                        item.children = addItem(item.children, targetId, itemToAdd);
                    }
                    return item;
                });
            };
            
            setFileSystem(prev => addItem(prev, parentId, newFile));
            setActiveFileId(newFile.id);
            alert('File saved successfully!');
        }
    };
    
    const handleAddFolder = (parentId: string | null) => {
        const newFolder: WhiteboardFolder = {
            id: `folder-${Date.now()}`,
            type: 'folder',
            name: 'New Folder',
            children: [],
            parentId: parentId,
        };
        const addItem = (items: FileSystemItem[], targetId: string | null, itemToAdd: FileSystemItem): FileSystemItem[] => {
            if (targetId === null) {
                return [itemToAdd, ...items];
            }
            return items.map(item => {
                if (item.id === targetId && item.type === 'folder') {
                    item.children = [itemToAdd, ...item.children];
                } else if (item.type === 'folder') {
                    item.children = addItem(item.children, targetId, itemToAdd);
                }
                return item;
            });
        };
        setFileSystem(prev => addItem(prev, parentId, newFolder));
    };

    const handleClearCanvas = () => {
        setPaths([]);
        setMessages([]);
        setActiveFileId(null);
        startChat(); // Reset for a fresh start
    };

    return (
        <div className="flex h-screen font-sans bg-gray-100 text-gray-900">
            <HistoryPanel 
                onClear={handleClearCanvas}
                onSaveFile={handleSaveFile}
                onAddFolder={handleAddFolder}
                canSaveFile={paths.length > 0 || messages.some(m => m.sender === Sender.User)}
                messages={messages}
                fileSystem={fileSystem}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                onDeleteItem={handleDeleteItem}
                onRenameItem={handleRenameItem}
                onMoveItem={handleMoveItem}
            />
            <main className="flex-1 grid grid-cols-2 grid-rows-1 gap-4 p-4">
                <div className="col-span-1 row-span-1 min-w-0">
                    <Whiteboard ref={whiteboardRef} paths={paths} onNewPath={handleNewPath} />
                </div>
                <div className="col-span-1 row-span-1 min-w-0 h-full">
                    <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </main>
        </div>
    );
};

export default App;
