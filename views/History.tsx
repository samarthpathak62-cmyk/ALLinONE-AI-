
import React, { useState } from 'react';
import { History as HistoryIcon, Search, Trash2, ChevronRight, MessageSquare, Layers, Code, Mic, Gamepad2, Box, RotateCcw, Sparkles, Loader2, FileText, Cpu } from 'lucide-react';
import { View, HistoryItem } from '../types';
import { useApp } from '../App';
import { summarizeHistory } from '../geminiService';

const History: React.FC = () => {
  const { history, clearHistory, setView, setActiveSessionId } = useApp();
  const [search, setSearch] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const filtered = history.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleSummarize = async () => {
    if (history.length === 0) return;
    setIsSummarizing(true);
    try {
      const recentMessages = history
        .filter(h => h.view === View.Chat)
        .flatMap(h => h.messages || [])
        .slice(0, 20)
        .map(m => `${m.role.toUpperCase()}: ${m.content}`);
      
      const result = await summarizeHistory(recentMessages);
      setSummary(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const getIcon = (type: View) => {
    switch (type) {
      case View.Chat: return <MessageSquare size={18} />;
      case View.MediaLab: return <Layers size={18} />;
      case View.CodingLab: return <Code size={18} />;
      case View.VoiceLab: return <Mic size={18} />;
      case View.Arcade: return <Gamepad2 size={18} />;
      case View.GameLab3D: return <Box size={18} />;
      case View.DocumentLab: return <FileText size={18} />;
      case View.GameEngine: return <Cpu size={18} />;
      default: return <HistoryIcon size={18} />;
    }
  };

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'JUST NOW';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}M AGO`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}H AGO`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleRecover = (item: HistoryItem) => {
    if (item.view === View.Chat || item.view === View.CodingLab || item.view === View.DocumentLab) {
      setActiveSessionId(item.id);
      setView(item.view);
    } else {
      setView(item.view);
    }
  };

  return (
    <div className="p-6 pb-24 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-10 stagger-1">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">Neural <span className="neon-blue">Logs</span></h2>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Activity Core Archive</p>
        </div>
        <button 
          onClick={clearHistory}
          className="text-gray-600 hover:text-red-500 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 active:scale-90"
        >
          <Trash2 size={14} /> PURGE
        </button>
      </div>

      <div className="flex gap-3 mb-8 stagger-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-[#00f2ff] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Scan memory logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass border border-white/5 rounded-2xl outline-none focus:border-[#00f2ff]/30 text-sm font-black uppercase tracking-widest placeholder:text-zinc-800"
          />
        </div>
        <button 
          onClick={handleSummarize}
          disabled={isSummarizing || history.length === 0}
          className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 ${
            isSummarizing ? 'bg-zinc-900 animate-pulse' : 'bg-white text-black hover:bg-[#00f2ff] shadow-white/5'
          }`}
          title="Neural Intelligence Summary"
        >
          {isSummarizing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </button>
      </div>

      {summary && (
        <div className="mb-10 p-8 glass border border-[#00f2ff]/20 rounded-[40px] animate-in slide-in-from-top-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-5 animate-pulse"><Sparkles size={60} /></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]">Executive Summary</h3>
            <button onClick={() => setSummary(null)} className="p-2 glass border border-white/5 rounded-full text-gray-600 hover:text-white"><RotateCcw size={14}/></button>
          </div>
          <div className="text-[11px] text-gray-300 leading-relaxed space-y-3 whitespace-pre-wrap font-medium">
            {summary}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const staggerClass = `stagger-${Math.min(idx + 3, 8)}`;
          return (
            <button 
              key={item.id}
              onClick={() => handleRecover(item)}
              className={`w-full flex items-center p-6 glass border border-white/5 rounded-[40px] hover:bg-white/5 hover:border-[#00f2ff]/20 transition-all text-left group active:scale-[0.98] ${staggerClass}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-[#00f2ff] transition-all border border-white/5 mr-5 relative shadow-2xl group-hover:scale-105 group-hover:rotate-2">
                {getIcon(item.view)}
                <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black text-sm text-gray-100 truncate uppercase tracking-tight italic leading-none">{item.title}</h3>
                  <span className="text-[8px] text-gray-600 font-black tracking-widest whitespace-nowrap ml-4">{formatDate(item.timestamp)}</span>
                </div>
                <p className="text-[10px] text-gray-600 truncate font-black uppercase tracking-widest opacity-60 leading-none mt-1">{item.preview}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 ml-4 border border-white/5 transition-all group-hover:translate-x-1">
                <ChevronRight size={18} className="text-zinc-800 group-hover:text-white" />
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-24 opacity-5 stagger-3">
            <HistoryIcon size={80} className="mx-auto mb-6" />
            <p className="text-xs font-black uppercase tracking-[0.5em]">Activity Core Empty</p>
          </div>
        )}
      </div>
      <div className="h-10" />
    </div>
  );
};

export default History;
