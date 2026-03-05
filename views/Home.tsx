
import React from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { 
  MessageSquare, 
  Layers, 
  Code, 
  Gamepad2, 
  Mic, 
  ArrowRight, 
  FileText,
  Fingerprint,
  Trophy,
  Terminal,
  Cpu,
  Heart,
  Sparkles,
  Zap
} from 'lucide-react';

const Home: React.FC = () => {
  const { setView, user, textColor } = useApp();

  const quickTools = [
    { id: View.Chat, label: 'Neural Chat', icon: MessageSquare, color: 'from-blue-600 to-cyan-500', desc: 'Main Assistant' },
    { id: View.MediaLab, label: 'Visual Studio', icon: Layers, color: 'from-purple-600 to-pink-600', desc: 'Art & Video' },
    { id: View.CodingLab, label: 'Logic Lab', icon: Code, color: 'from-green-600 to-emerald-500', desc: '100% Correct Code' },
    { id: View.Arcade, label: 'Neural Arcade', icon: Gamepad2, color: 'from-orange-600 to-red-500', desc: 'Classic Games' },
  ];

  const experiments = [
    { id: View.VoiceLab, label: 'Voice Core', icon: Mic, desc: 'Ultra-Real Voices' },
    { id: View.GameEngine, label: 'Neural Engine', icon: Cpu, desc: 'Forge Game Worlds' },
    { id: View.GameMaker, label: 'Logic Studio', icon: Terminal, desc: 'System Design Hub' },
    { id: View.Feedback, label: 'Neural Feedback', icon: Heart, desc: 'Evolve the Core' },
  ];

  const borderOpacity = textColor === '#000000' ? 'border-black/10' : 'border-white/10';
  const glassBg = textColor === '#000000' ? 'bg-black/5' : 'bg-white/5';

  return (
    <div className="p-6 pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <section className="flex justify-between items-start stagger-1">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            Welcome, <span className="neon-blue">{user?.username || 'Explorer'}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-gray-500 font-black text-[9px] uppercase tracking-[0.2em]">
              {user?.totalMessages === 0 ? "Neural Link Established" : "Core Systems Online"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
           <div className="text-[9px] font-black text-[#00f2ff] uppercase tracking-widest bg-[#00f2ff]/10 px-2 py-0.5 rounded-full border border-[#00f2ff]/20">{user?.id}</div>
           <div className="flex items-center gap-1.5 text-[8px] font-black uppercase opacity-60">
             <Trophy size={10} className="text-yellow-500" /> {user?.totalMessages} Syncs
           </div>
        </div>
      </section>

      {/* Hero Interactive Card - FIXED HEIGHT AND BUTTON VISIBILITY */}
      <div className="relative group overflow-hidden rounded-[40px] min-h-[220px] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 border border-white/5 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] stagger-2 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#00f2ff]/5 blur-[80px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-[#00f2ff] animate-spin-slow" />
            <span className="bg-[#00f2ff]/10 text-[#00f2ff] text-[7px] font-black px-2 py-0.5 rounded-full border border-[#00f2ff]/20 uppercase tracking-[0.3em]">Quantum Engine Active</span>
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-2xl mb-1">
            PRECISION <br/>ARCHITECT
          </h3>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-90 max-w-[180px]">
            100% bug-free neural processing initialized.
          </p>
        </div>

        <div className="relative z-10 mt-4">
          <button 
            onClick={() => setView(View.CodingLab)}
            className="flex items-center gap-2 bg-[#00f2ff] text-black px-6 py-3.5 rounded-2xl text-[10px] font-black shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:shadow-[0_0_50px_rgba(0,242,255,0.5)] active:scale-95 transition-all uppercase tracking-[0.2em] group"
          >
            ACTIVATE CORE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <Fingerprint className="absolute right-6 bottom-6 text-white/[0.03] w-48 h-48 animate-float pointer-events-none" strokeWidth={0.5} />
      </div>

      {/* Quick Tools Grid */}
      <section className="space-y-6 stagger-3">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
             <Zap size={12} className="text-[#00f2ff]" />
             <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Neural Protocols</h3>
           </div>
           <div className="flex-1 ml-4 h-[1px] bg-gradient-to-r from-white/5 to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {quickTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setView(tool.id)}
                className={`flex flex-col items-start p-6 rounded-[32px] glass border ${borderOpacity} hover:border-[#00f2ff]/30 transition-all text-left relative overflow-hidden group active:scale-95`}
              >
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 blur-xl group-hover:bg-[#00f2ff]/10 transition-colors" />
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h4 className="font-black text-sm uppercase italic tracking-tight">{tool.label}</h4>
                <p className="text-[9px] text-gray-500 mt-1 font-black uppercase tracking-widest opacity-60">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Experimental Hub */}
      <section className="space-y-6 stagger-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
             <Cpu size={12} className="text-purple-500" />
             <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Experimental Hub</h3>
           </div>
           <div className="flex-1 ml-4 h-[1px] bg-gradient-to-r from-white/5 to-transparent" />
        </div>
        <div className="space-y-3">
          {experiments.map((exp) => {
            const Icon = exp.icon;
            return (
              <button
                key={exp.id}
                onClick={() => setView(exp.id)}
                className={`w-full flex items-center justify-between p-5 rounded-[32px] glass border ${borderOpacity} hover:bg-white/5 transition-all group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${glassBg} border ${borderOpacity} group-hover:text-[#00f2ff] group-hover:border-[#00f2ff]/30 transition-all duration-500`}>
                    <Icon size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm uppercase italic tracking-tight">{exp.label}</h4>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest opacity-60">{exp.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ArrowRight size={18} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center py-4">
        <div className="px-4 py-2 glass-dark border border-white/5 rounded-full flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">Neural Sync 100% Stable</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
