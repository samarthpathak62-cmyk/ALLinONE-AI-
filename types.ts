
export enum View {
  Home = 'home',
  Chat = 'chat',
  MediaLab = 'medialab',
  DocumentLab = 'documentlab',
  CodingLab = 'codinglab',
  Arcade = 'arcade',
  GameMaker = 'gamemaker', // This is currently Logic Studio
  GameEngine = 'gameengine', // New Game Creator
  GameLab3D = '3dgamelab',
  VoiceLab = 'voicelab',
  History = 'history',
  Settings = 'settings',
  Premium = 'premium',
  Login = 'login',
  Feedback = 'feedback'
}

export interface User {
  id: string; 
  username: string;
  avatar?: string;
  themeColor?: string; // Hex color for app background
  joinDate: number;
  lastActive: number;
  totalMessages: number;
  isPremium: boolean;
  premiumExpiryDate: number | null;
  status: 'active' | 'limited_mode';
  stats: {
    chats: number;
    generations: number;
    tokens: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'code' | 'file';
  mediaUrl?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  view: View;
  timestamp: number;
  preview: string;
  messages: ChatMessage[]; 
}
