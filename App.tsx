
import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, User, HistoryItem } from './types';
import Home from './views/Home';
import Chat from './views/Chat';
import MediaLab from './views/MediaLab';
import DocumentLab from './views/DocumentLab';
import CodingLab from './views/CodingLab';
import Arcade from './views/Arcade';
import GameMaker from './views/GameMaker';
import GameEngine from './views/GameEngine';
import GameLab3D from './views/GameLab3D';
import VoiceLab from './views/VoiceLab';
import History from './views/History';
import Settings from './views/Settings';
import Premium from './views/Premium';
import Login from './views/Login';
import Feedback from './views/Feedback';
import Navigation from './components/Navigation';
import TopBar from './components/TopBar';

interface AppContextType {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  incrementMessageCount: () => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  startNewChat: (targetView?: View) => void;
  generateNewId: () => string;
  textColor: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Helper to determine text color (Black or White) based on background brightness
const getContrastColor = (hexcolor: string) => {
  if (!hexcolor) return '#ffffff';
  // Remove hash if present
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // YIQ formula for perceived brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('allinone_user_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse user", e);
    }
    return null;
  });

  const [currentView, setView] = useState<View>(user ? View.Home : View.Login);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('allinone_history_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const generateNewId = () => "ALLINONE_" + Math.random().toString(36).substring(2, 8).toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('allinone_user_v3', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('allinone_history_v3', JSON.stringify(history));
  }, [history]);

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => {
      const exists = prev.findIndex(h => h.id === item.id);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = { ...updated[exists], ...item, timestamp: Date.now() };
        return updated;
      }
      return [item, ...prev];
    });
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveSessionId(null);
  };

  const incrementMessageCount = () => {
    if (user) {
      setUser({ ...user, totalMessages: user.totalMessages + 1, lastActive: Date.now() });
    }
  };

  const startNewChat = (targetView: View = View.Chat) => {
    setActiveSessionId(null);
    setView(targetView);
  };

  useEffect(() => {
    if (!user && currentView !== View.Login) {
      setView(View.Login);
    }
  }, [user, currentView]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 blur-[100px] bg-[#00f2ff]/20 animate-pulse rounded-full"></div>
          <div className="relative w-24 h-24 rounded-[40px] bg-gradient-to-br from-[#00f2ff] to-[#0066ff] flex items-center justify-center shadow-[0_0_60px_rgba(0,242,255,0.3)]">
              <span className="text-black font-black text-4xl tracking-tighter italic">A1</span>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center text-center">
          <h1 className="text-2xl font-black tracking-[0.3em] neon-blue italic">ALLINONE AI</h1>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Global Ultra Pro Core</p>
        </div>
      </div>
    );
  }

  const appBackground = user?.themeColor || '#000000';
  const textColor = getContrastColor(appBackground);

  return (
    <AppContext.Provider value={{ 
      currentView, setView, user, setUser, history, addHistory, clearHistory, 
      incrementMessageCount, activeSessionId, setActiveSessionId, startNewChat, generateNewId, textColor
    }}>
      <div 
        className="flex flex-col h-[100dvh] w-full overflow-hidden relative selection:bg-[#00f2ff]/30 transition-colors duration-500"
        style={{ 
          backgroundColor: appBackground,
          color: textColor
        }}
      >
        {user && currentView !== View.Login && <TopBar />}
        
        <main className={`flex-1 overflow-y-auto relative ${user && currentView !== View.Login ? 'pb-24' : ''}`}>
          {renderView()}
        </main>

        {user && currentView !== View.Login && <Navigation />}
      </div>
    </AppContext.Provider>
  );

  function renderView() {
    switch (currentView) {
      case View.Login: return <Login />;
      case View.Home: return <Home />;
      case View.Chat: return <Chat />;
      case View.MediaLab: return <MediaLab />;
      case View.DocumentLab: return <DocumentLab />;
      case View.CodingLab: return <CodingLab />;
      case View.Arcade: return <Arcade />;
      case View.GameMaker: return <GameMaker />;
      case View.GameEngine: return <GameEngine />;
      case View.GameLab3D: return <GameLab3D />;
      case View.VoiceLab: return <VoiceLab />;
      case View.History: return <History />;
      case View.Settings: return <Settings />;
      case View.Premium: return <Premium />;
      case View.Feedback: return <Feedback />;
      default: return <Home />;
    }
  }
};

export default App;
