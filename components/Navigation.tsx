
import React from 'react';
import { View } from '../types';
import { useApp } from '../App';
import { 
  Home, 
  MessageSquare, 
  Layers, 
  Code, 
  History, 
  Settings,
  Gamepad2,
  Terminal,
  Zap
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { currentView, setView, textColor } = useApp();

  const navItems = [
    { id: View.Home, icon: Home, label: 'Home' },
    { id: View.Chat, icon: MessageSquare, label: 'Chat' },
    { id: View.MediaLab, icon: Layers, label: 'Media' },
    { id: View.CodingLab, icon: Code, label: 'Logic' },
    { id: View.History, icon: History, label: 'Logs' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-[30px] border-t px-2 pt-3 flex justify-around items-center z-50 transition-all"
      style={{ 
        borderColor: `${textColor}05`,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-500 group ${
              isActive ? 'scale-110 -translate-y-1' : 'opacity-60 grayscale'
            }`}
            style={{ 
              color: isActive ? '#00f2ff' : textColor
            }}
          >
            {isActive && (
              <div className="absolute -top-1 w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff] animate-pulse" />
            )}
            <div className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]' : ''}`}>
               <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[8px] mt-1 font-black uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
