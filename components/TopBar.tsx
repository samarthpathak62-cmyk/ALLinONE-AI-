
import React from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { Crown, User } from 'lucide-react';

const TopBar: React.FC = () => {
  const { user, currentView, setView, textColor } = useApp();

  return (
    <header 
      className="flex items-center justify-between px-6 border-b backdrop-blur-xl sticky top-0 z-50 transition-all"
      style={{ 
        borderColor: `${textColor}10`,
        backgroundColor: 'transparent',
        height: 'calc(64px + env(safe-area-inset-top))',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#0066ff] flex items-center justify-center shadow-lg border border-white/10">
          <span className="text-black font-black text-lg italic">A1</span>
        </div>
        <div className="flex flex-col">
          <h1 
            className="font-black tracking-tighter uppercase italic text-sm"
            style={{ color: textColor }}
          >
            ALLINONE AI
          </h1>
          <span 
            className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50"
          >
            PRO CORE v3.2
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.isPremium ? (
          <div className="flex items-center gap-2 text-yellow-500 px-3 py-1.5 rounded-full text-[10px] font-black border border-yellow-500/20 bg-yellow-500/5 uppercase tracking-widest">
            <Crown size={12} fill="currentColor" />
            <span>PRO</span>
          </div>
        ) : (
          <button 
            onClick={() => setView(View.Premium)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black border hover:opacity-80 transition-all uppercase tracking-widest"
            style={{ 
              borderColor: `${textColor}20`,
              backgroundColor: `${textColor}05`,
              color: textColor
            }}
          >
            <span>UPGRADE</span>
          </button>
        )}

        <button 
          onClick={() => setView(View.Settings)}
          className="w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden hover:border-[#00f2ff]/30 transition-all shadow-xl"
          style={{ 
            borderColor: `${textColor}20`,
            backgroundColor: `${textColor}05`
          }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={20} style={{ color: `${textColor}40` }} />
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
