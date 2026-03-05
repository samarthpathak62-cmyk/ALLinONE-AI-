
import React, { useEffect } from 'react';
import { Box, Move, User, Target, Layers } from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';

const GameLab3D: React.FC = () => {
  const { addHistory } = useApp();

  useEffect(() => {
    addHistory({
      id: Date.now().toString(),
      title: 'Explored 3D Playground',
      view: View.GameLab3D,
      timestamp: Date.now(),
      preview: 'Entered the interactive 3D simulation environment.',
      messages: []
    });
  }, []);

  return (
    <div className="p-6 flex flex-col h-full bg-[#050505]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight uppercase">3D <span className="neon-blue">Playground</span></h2>
        <div className="flex gap-2">
           <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#00f2ff]">
              <Layers size={16} />
           </div>
        </div>
      </div>

      <div className="flex-1 relative glass border border-white/5 rounded-3xl overflow-hidden bg-grid">
         {/* Visual 3D simulation placeholders */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Floor grid effect */}
              <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#00f2ff]/10 to-transparent" 
                   style={{ perspective: '1000px', transform: 'rotateX(60deg)' }}>
                <div className="w-full h-full bg-[linear-gradient(rgba(0,242,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
              
              {/* Character Placeholder */}
              <div className="absolute left-1/2 bottom-32 -translate-x-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#00f2ff] rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="w-8 h-12 bg-white/20 rounded-full border border-white/40 backdrop-blur-md" />
              </div>

              {/* Random floating 3D objects */}
              <div className="absolute top-20 left-20 w-10 h-10 border border-[#00f2ff]/30 rotate-12 animate-spin-slow">
                <Box size={40} className="text-[#00f2ff]/40" />
              </div>
              <div className="absolute top-40 right-20 w-12 h-12 border border-purple-500/30 -rotate-12 animate-bounce">
                <Target size={40} className="text-purple-500/40" />
              </div>
            </div>
         </div>

         {/* On-screen controls overlay */}
         <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
            {/* Joystick Simulator */}
            <div className="w-24 h-24 rounded-full glass border border-white/10 p-2 pointer-events-auto shadow-2xl">
               <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#00f2ff]/30 border border-[#00f2ff]/50 flex items-center justify-center cursor-move active:scale-95 transition-all">
                    <Move size={16} className="text-[#00f2ff]" />
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pointer-events-auto">
               <button className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center shadow-lg active:scale-90 transition-all text-white/60">
                  <User size={24} />
               </button>
               <button className="w-16 h-16 rounded-full bg-[#00f2ff] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)] active:scale-90 transition-all text-black font-black">
                  ACTION
               </button>
            </div>
         </div>

         {/* Status Message */}
         <div className="absolute top-8 left-8 p-3 glass border border-white/10 rounded-xl max-w-[150px]">
            <span className="text-[10px] font-bold block text-[#00f2ff] mb-1">NPC STATUS</span>
            <p className="text-[8px] text-gray-400">AI Sentinel is scanning for commands...</p>
         </div>
      </div>

      <div className="mt-6 flex gap-4">
         <div className="flex-1 glass p-4 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Environment</h4>
            <p className="text-sm">Neon Grid Level 01</p>
         </div>
         <div className="flex-1 glass p-4 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Physics</h4>
            <p className="text-sm">Low-G Active</p>
         </div>
      </div>
    </div>
  );
};

export default GameLab3D;
