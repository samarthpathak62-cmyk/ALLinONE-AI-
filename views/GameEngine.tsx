
import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Zap, 
  Box, 
  Cpu, 
  Wand2, 
  Loader2, 
  Share2, 
  CheckCircle2, 
  X,
  Target,
  Sword,
  Mountain
} from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';
import { generateChatResponse } from '../geminiService';

const GameEngine: React.FC = () => {
  const { addHistory, user } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [mode, setMode] = useState<'world' | 'mechanics' | 'assets'>('world');

  const handleBuild = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setOutput(null);

    const modePrompts = {
      world: "Create a detailed game world description, lore, and environment settings based on this:",
      mechanics: "Design detailed gameplay mechanics, player controls, and combat/interaction systems for this game idea:",
      assets: "Forge a list of visual and audio assets (character designs, sound effects, environmental art prompts) for this game:"
    };

    try {
      const result = await generateChatResponse(
        `${modePrompts[mode]}\n\nRequest: ${prompt}`, 
        [], 
        [], 
        user?.isPremium || false
      );
      
      setOutput(result || "Neural Engine failed to compile logic.");
      
      addHistory({
        id: Date.now().toString(),
        title: `Game Engine: ${mode.toUpperCase()}`,
        view: View.GameEngine,
        timestamp: Date.now(),
        preview: `Forged ${mode} for: ${prompt.substring(0, 30)}...`,
        messages: []
      });
    } catch (err) {
      console.error(err);
      setOutput("Neural Link Error: Game core could not be initialized.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-2 stagger-1">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Neural <span className="text-[#a855f7]">Engine</span></h2>
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Procedural Game Core v3.0</p>
      </section>

      <div className="grid grid-cols-3 gap-3 stagger-2">
        {[
          { id: 'world', icon: Mountain, label: 'LORE' },
          { id: 'mechanics', icon: Zap, label: 'LOGIC' },
          { id: 'assets', icon: Box, label: 'ASSETS' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`flex flex-col items-center gap-3 p-5 rounded-[32px] border transition-all active:scale-95 ${
              mode === m.id ? 'bg-[#a855f7] text-black border-transparent shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'glass border-white/5 text-gray-600 hover:text-white'
            }`}
          >
            <m.icon size={20} strokeWidth={mode === m.id ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="glass p-8 rounded-[48px] border border-white/5 focus-within:border-[#a855f7]/50 transition-all shadow-2xl bg-black/40 relative overflow-hidden stagger-3">
         <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#a855f7]/5 blur-3xl rounded-full" />
         <textarea 
           value={prompt}
           onChange={(e) => setPrompt(e.target.value)}
           placeholder={
             mode === 'world' ? "Inject world seeds... E.g. 'A civilization living inside a giant clock...'" :
             mode === 'mechanics' ? "Define interaction rules... E.g. 'Rewinding time costs memories...'" :
             "Asset requirements... E.g. 'Clockwork golems with bronze steam vents...'"
           }
           className="w-full bg-transparent border-none focus:ring-0 text-sm h-36 resize-none placeholder:text-zinc-800 font-black uppercase tracking-widest relative z-10 mt-2"
         />
         <div className="flex justify-between items-center mt-8 relative z-10 pt-6 border-t border-white/5">
            <div className="flex gap-4 text-zinc-800">
               <Target size={20}/>
               <Sword size={20}/>
            </div>
            <button 
             onClick={handleBuild}
             disabled={!prompt.trim() || isLoading}
             className="flex items-center gap-3 bg-[#a855f7] text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(168,85,247,0.3)] disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Cpu size={18} />}
              Initialize Link
            </button>
         </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in">
           <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#a855f7]/5 border-t-[#a855f7] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Wand2 size={32} className="text-[#a855f7] animate-pulse" />
              </div>
           </div>
           <p className="text-[10px] font-black text-[#a855f7] uppercase tracking-[0.5em] animate-pulse">Forging Realities...</p>
        </div>
      )}

      {output && !isLoading && (
        <div className="animate-in slide-in-from-top-6 duration-500 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] italic">Neural Core Manifest</h4>
              <button onClick={() => setOutput(null)} className="w-10 h-10 flex items-center justify-center glass border border-white/5 rounded-full text-gray-600 hover:text-white transition-all"><X size={18} /></button>
           </div>
           <div className="glass-dark p-10 rounded-[56px] border border-[#a855f7]/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#a855f7]/5 blur-3xl rounded-full" />
              <div className="relative z-10 text-[11px] leading-relaxed text-gray-200 whitespace-pre-wrap font-mono selection:bg-[#a855f7]/30">
                 {output}
              </div>
              <div className="mt-10 flex gap-4">
                 <button 
                  onClick={() => { navigator.clipboard.writeText(output); alert("Manifest Copied!"); }}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                   <Share2 size={16} /> SHARE LOGIC
                 </button>
                 <button className="flex-1 py-5 bg-[#a855f7] text-black rounded-3xl text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                   <CheckCircle2 size={16} /> DEPLOY CORE
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GameEngine;
