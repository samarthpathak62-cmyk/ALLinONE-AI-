
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Music, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';

const VoiceLab: React.FC = () => {
  const { addHistory } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [activeVoice, setActiveVoice] = useState('Zephyr');

  const voices = [
    { name: 'Zephyr', type: 'Neutral & Fast' },
    { name: 'Kore', type: 'Professional & Calm' },
    { name: 'Puck', type: 'Playful & Energetic' },
    { name: 'Fenrir', type: 'Deep & Authoritative' },
  ];

  const toggleListening = () => {
    const newState = !isListening;
    setIsListening(newState);
    if (newState) {
      addHistory({
        id: Date.now().toString(),
        title: 'Voice Session',
        view: View.VoiceLab,
        timestamp: Date.now(),
        preview: `Interacted with the AI using ${activeVoice} voice profile.`,
        messages: []
      });
    }
  };

  const handleToolClick = (toolName: string) => {
    addHistory({
      id: Date.now().toString(),
      title: `Used ${toolName}`,
      view: View.VoiceLab,
      timestamp: Date.now(),
      preview: `Executed voice tool: ${toolName}.`,
      messages: []
    });
  };

  return (
    <div className="p-6 flex flex-col items-center h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full stagger-1 mb-12">
        <h2 className="text-3xl font-black text-center tracking-tight uppercase italic">Voice <span className="neon-blue">Lab</span></h2>
        <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Neural Audio Engine</p>
      </div>

      <div className="relative mb-16 stagger-2">
        <div className={`absolute inset-0 w-56 h-56 -m-16 border border-[#00f2ff]/20 rounded-full transition-all duration-1000 ${isListening ? 'animate-ping scale-150' : 'opacity-0'}`} />
        <div className={`absolute inset-0 w-56 h-56 -m-16 border border-[#00f2ff]/10 rounded-full transition-all duration-700 delay-150 ${isListening ? 'animate-ping scale-125' : 'opacity-0'}`} />
        <div className={`absolute inset-0 w-56 h-56 -m-16 bg-[#00f2ff]/5 blur-3xl rounded-full transition-opacity duration-500 ${isListening ? 'opacity-100' : 'opacity-0'}`} />
        
        <button 
          onClick={toggleListening}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl z-10 active:scale-90 ${
            isListening ? 'bg-red-500 shadow-red-500/40' : 'bg-[#00f2ff] shadow-[#00f2ff]/40 hover:shadow-[#00f2ff]/60'
          }`}
        >
          {isListening ? <MicOff size={36} className="text-white" /> : <Mic size={36} className="text-black" />}
        </button>
      </div>

      <div className="w-full space-y-10 max-w-sm pb-24">
         <div className="text-center stagger-3">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
              {isListening ? "I'm Listening..." : "Tap to Initialize"}
            </h3>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {isListening ? "Core sensory system active" : "Global multilingual vocalization ready"}
            </p>
         </div>

         <div className="grid grid-cols-2 gap-3 stagger-4">
            <button onClick={() => handleToolClick('STORYTELLER')} className="group flex flex-col items-center gap-3 p-6 glass border border-white/5 rounded-3xl hover:border-[#00f2ff]/30 transition-all active:scale-95">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:text-[#00f2ff] transition-colors">
                <BookOpen size={24} className="text-purple-400 group-hover:text-[#00f2ff]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">STORYTELLER</span>
            </button>
            <button onClick={() => handleToolClick('SONG MAKER')} className="group flex flex-col items-center gap-3 p-6 glass border border-white/5 rounded-3xl hover:border-[#00f2ff]/30 transition-all active:scale-95">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:text-[#00f2ff] transition-colors">
                <Music size={24} className="text-blue-400 group-hover:text-[#00f2ff]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">SONG MAKER</span>
            </button>
            <button onClick={() => handleToolClick('IMPROVE SPEECH')} className="group flex flex-col items-center gap-3 p-6 glass border border-white/5 rounded-3xl hover:border-[#00f2ff]/30 transition-all active:scale-95">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:text-[#00f2ff] transition-colors">
                <Sparkles size={24} className="text-yellow-400 group-hover:text-[#00f2ff]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">ENHANCER</span>
            </button>
            <button onClick={() => handleToolClick('TEXT TO SPEECH')} className="group flex flex-col items-center gap-3 p-6 glass border border-white/5 rounded-3xl hover:border-[#00f2ff]/30 transition-all active:scale-95">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:text-[#00f2ff] transition-colors">
                <Volume2 size={24} className="text-green-400 group-hover:text-[#00f2ff]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">VOCALIZER</span>
            </button>
         </div>

         <div className="space-y-4 stagger-5">
           <div className="flex items-center justify-between px-2">
             <h4 className="text-[9px] font-black text-gray-500 tracking-[0.4em] uppercase">Neural Profiles</h4>
             <div className="w-12 h-[1px] bg-white/5" />
           </div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {voices.map(v => (
                <button 
                  key={v.name}
                  onClick={() => setActiveVoice(v.name)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl text-[10px] font-black border transition-all active:scale-90 uppercase tracking-widest ${
                    activeVoice === v.name ? 'bg-[#00f2ff] text-black border-transparent shadow-[0_0_20px_rgba(0,242,255,0.2)]' : 'glass border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {v.name}
                </button>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default VoiceLab;
