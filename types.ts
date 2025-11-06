// Defines the shared data structures used throughout the application.

export enum Sender {
  User = 'user',
  Model = 'model',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  imageUrl?: string;
  isTyping?: boolean;
}

export interface WhiteboardPoint {
    x: number;
    y: number;
    pressure: number;
}

export type WhiteboardTool = 'pen' | 'eraser';

export interface WhiteboardPath {
    id: string;
    points: WhiteboardPoint[];
    color: string;
    size: number;
    tool: WhiteboardTool;
}

export interface WhiteboardFile {
    id: string;
    type: 'file';
    name: string;
    paths: WhiteboardPath[];
    messages: Message[];
    parentId: string | null;
}

export interface WhiteboardFolder {
    id: string;
    type: 'folder';
    name: string;
    children: FileSystemItem[];
    parentId: string | null;
}

export type FileSystemItem = WhiteboardFile | WhiteboardFolder;
