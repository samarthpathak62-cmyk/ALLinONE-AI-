
import React, { useState } from 'react';
import { 
  Terminal, 
  Wand2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Loader2, 
  Download, 
  Zap, 
  ShieldCheck, 
  Database, 
  Layout, 
  Share2,
  CheckCircle2,
  X,
  FileCode
} from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';
import { architectCode } from '../geminiService';

const LogicStudio: React.FC = () => {
  const { addHistory, user } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'scaffold' | 'database' | 'logic'>('scaffold');

  const handleArchitect = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setOutput(null);

    const modePrompts = {
      scaffold: "Generate a complete folder and file structure for a professional app based on this description. Include tech stack recommendations.",
      database: "Design a high-performance database schema (SQL or NoSQL) for the following system. List all tables, fields, and relationships.",
      logic: "Analyze and explain the complex business logic or algorithm needed for the following feature. Use pseudo-code or step-by-step logic."
    };

    try {
      const response = await architectCode(`${modePrompts[activeMode]}\n\nUser Request: ${prompt}`, "", user?.isPremium || false);
      setOutput(response || "Neural generation failed. Please refine your request.");
      
      addHistory({
        id: Date.now().toString(),
        title: `Logic Studio: ${activeMode.toUpperCase()}`,
        view: View.GameMaker,
        timestamp: Date.now(),
        preview: `Designed ${activeMode} for: ${prompt.substring(0, 30)}...`,
        messages: []
      });
    } catch (err) {
      console.error(err);
      setOutput("Neural Link Error: Architecture could not be finalized.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ALLINONE_STUDIO_${activeMode.toUpperCase()}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-5 border-b border-white/5 flex items-center justify-between glass sticky top-0 z-20 stagger-1">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#00f2ff] border border-white/5 shadow-2xl">
               <Terminal size={24} />
            </div>
            <div>
               <h2 className="text-sm font-black uppercase italic tracking-widest leading-none">Logic <span className="text-[#00f2ff]">Studio</span></h2>
               <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em] mt-1">Systems Architect Core</p>
            </div>
         </div>
         <div className="flex gap-2">
            {output && (
              <button 
                onClick={handleExport}
                className="w-10 h-10 flex items-center justify-center glass border border-white/10 rounded-xl text-white hover:text-[#00f2ff] transition-all shadow-xl active:scale-90"
              >
                <Download size={18} />
              </button>
            )}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-10">
          
          <div className="text-center space-y-4 stagger-2">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full text-[9px] font-black text-[#00f2ff] uppercase tracking-[0.4em] animate-pulse shadow-[0_0_20px_rgba(0,242,255,0.05)]">
                <ShieldCheck size={12} /> GLOBAL PRECISION MODE
             </div>
             <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-2xl">CORE SYSTEM<br/>ENGINEERING</h3>
             <p className="text-[10px] text-gray-500 leading-relaxed font-black uppercase tracking-widest max-w-[280px] mx-auto opacity-70">Define folder structures, database schemas, and neural business logic protocols.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-1.5 bg-white/5 rounded-[32px] border border-white/5 stagger-3">
            <button 
              onClick={() => setActiveMode('scaffold')}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeMode === 'scaffold' ? 'bg-[#00f2ff] text-black shadow-xl shadow-[#00f2ff]/10' : 'text-gray-600 hover:text-white'}`}
            >
              <Layout size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Scaffold</span>
            </button>
            <button 
              onClick={() => setActiveMode('database')}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeMode === 'database' ? 'bg-[#00f2ff] text-black shadow-xl shadow-[#00f2ff]/10' : 'text-gray-600 hover:text-white'}`}
            >
              <Database size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Schema</span>
            </button>
            <button 
              onClick={() => setActiveMode('logic')}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeMode === 'logic' ? 'bg-[#00f2ff] text-black shadow-xl shadow-[#00f2ff]/10' : 'text-gray-600 hover:text-white'}`}
            >
              <Zap size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
            </button>
          </div>

          <div className="glass p-8 rounded-[40px] border border-white/5 focus-within:border-[#00f2ff]/30 transition-all shadow-2xl relative stagger-4 bg-zinc-950/30">
             <div className="absolute top-4 left-6 flex items-center gap-2 opacity-20 pointer-events-none">
                <FileCode size={12} />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Initialize Input_Stream</span>
             </div>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder={
                 activeMode === 'scaffold' ? "Describe the system architecture..." :
                 activeMode === 'database' ? "Design database relationships..." :
                 "Define complex logic algorithms..."
               }
               className="w-full bg-transparent border-none focus:ring-0 text-sm h-36 resize-none placeholder:text-zinc-800 font-black uppercase tracking-widest mt-6"
             />
             <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                <div className="flex gap-4 text-zinc-800">
                   <Layers size={18}/>
                   <Cpu size={18}/>
                </div>
                <button 
                 onClick={handleArchitect}
                 disabled={!prompt.trim() || isLoading}
                 className="flex items-center gap-3 bg-[#00f2ff] text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,242,255,0.2)] disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  EXECUTE BUILD
                </button>
             </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in">
               <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-[#00f2ff]/5 border-t-[#00f2ff] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={28} className="text-[#00f2ff] animate-pulse" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f2ff] animate-pulse">Calculating Vectors...</p>
                  <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Ensuring 100% Structural Integrity</p>
               </div>
            </div>
          )}

          {output && !isLoading && (
            <div className="animate-in fade-in slide-in-from-top-6 duration-500 space-y-6 pb-20">
               <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] italic">Verified Architectural Blueprint</h4>
                  <button onClick={() => setOutput(null)} className="w-8 h-8 flex items-center justify-center glass border border-white/5 rounded-full text-gray-600 hover:text-white transition-all"><X size={16} /></button>
               </div>
               <div className="glass-dark p-10 rounded-[48px] border border-[#00f2ff]/20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#00f2ff]/5 blur-3xl rounded-full" />
                  
                  <div className="relative z-10 font-mono text-[11px] leading-relaxed text-gray-200 whitespace-pre-wrap selection:bg-[#00f2ff]/30">
                     {output}
                  </div>
                  
                  <div className="mt-10 flex gap-4">
                     <button 
                       onClick={() => { navigator.clipboard.writeText(output); alert("Core Blueprint Copied!"); }}
                       className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                     >
                       <Share2 size={16} /> SHARE BLUEPRINT
                     </button>
                     <button 
                       onClick={handleExport}
                       className="flex-1 flex items-center justify-center gap-3 py-5 bg-white text-black rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                     >
                       <CheckCircle2 size={16} /> EXPORT CORE
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogicStudio;
