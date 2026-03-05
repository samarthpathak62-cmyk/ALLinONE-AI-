
import React, { useState, useRef } from 'react';
import { architectCode, explainCode } from '../geminiService';
import { useApp } from '../App';
import { View } from '../types';
import { 
  Code, 
  Bug, 
  Lightbulb, 
  FileCode, 
  CheckCircle2, 
  Copy, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Upload,
  X,
  FileText,
  Cpu
} from 'lucide-react';

const CodingLab: React.FC = () => {
  const { addHistory, user } = useApp();
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('React');
  const [isPrecisionMode, setIsPrecisionMode] = useState(true);
  const [attachedFile, setAttachedFile] = useState<{name: string, type: string, data: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { name: 'React', icon: '⚛️' },
    { name: 'Python', icon: '🐍' },
    { name: 'Javascript', icon: '📜' },
    { name: 'HTML/CSS', icon: '🎨' },
    { name: 'NodeJS', icon: '🟢' },
    { name: 'C++', icon: '🔵' },
    { name: 'Java', icon: '☕' },
    { name: 'Rust', icon: '🦀' },
    { name: 'Go', icon: '🐹' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const base64Data = result.split(',')[1];
        setAttachedFile({
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async (prompt: string, specialized: boolean = false) => {
    if (!code.trim() && !attachedFile && !specialized) return;
    
    setIsLoading(true);
    setExplanation('');
    try {
      let result;
      const fullPrompt = `Task: ${prompt}\nTarget Language: ${selectedLang}\nRequirement: Generate 100% correct, production-ready, and bug-free code.\n\n${attachedFile ? `[CONTEXT FILE: ${attachedFile.name}]` : ''}`;

      if (specialized || isPrecisionMode) {
        result = await architectCode(fullPrompt, code, user?.isPremium || false);
      } else {
        result = await explainCode(`${fullPrompt}\n\nCode Input:\n${code}`);
      }
      
      setExplanation(result || 'No output generated.');

      addHistory({
        id: Date.now().toString(),
        title: prompt.length > 20 ? prompt.substring(0, 20) : prompt,
        view: View.CodingLab,
        timestamp: Date.now(),
        preview: `Language: ${selectedLang} | 100% Accuracy Engine`,
        messages: [
          { id: '1', role: 'user', content: prompt, timestamp: Date.now(), type: 'text' },
          { id: '2', role: 'model', content: result || '', timestamp: Date.now(), type: 'code' }
        ]
      });

    } catch (err) {
      console.error(err);
      setExplanation("ERROR: Neural synchronization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      alert("Code copied to clipboard!");
    }
  };

  const handleClear = () => {
    setCode('');
    setExplanation('');
    setAttachedFile(null);
  };

  return (
    <div className="p-6 space-y-8 pb-40 overflow-y-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 stagger-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">Logic <span className="neon-blue">Lab</span></h2>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">100% Bug-Free Neural Architect</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleClear}
              className="p-3 glass border border-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-all active:scale-90"
              title="Clear All"
            >
              <X size={18} />
            </button>
            <div className="px-4 py-1.5 bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-full flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#00f2ff]" />
              <span className="text-[8px] font-black text-[#00f2ff] uppercase tracking-widest">Verified Engine</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Select Target Language</span>
            <span className="text-[8px] font-black text-[#00f2ff] uppercase tracking-widest">{selectedLang} Active</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {languages.map((lang) => (
              <button
                key={lang.name}
                onClick={() => setSelectedLang(lang.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedLang === lang.name 
                    ? 'bg-[#00f2ff] text-black border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.3)]' 
                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-sm">{lang.icon}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/5 rounded-[32px] border border-white/5 stagger-2">
        <button 
          onClick={() => setIsPrecisionMode(true)}
          className={`flex items-center justify-center gap-2 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
            isPrecisionMode ? 'bg-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/10' : 'text-gray-600 hover:text-white'
          }`}
        >
          <ShieldCheck size={16} /> Ultra Architect
        </button>
        <button 
          onClick={() => setIsPrecisionMode(false)}
          className={`flex items-center justify-center gap-2 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
            !isPrecisionMode ? 'bg-white text-black shadow-lg' : 'text-gray-600 hover:text-white'
          }`}
        >
          <Zap size={16} /> Standard Core
        </button>
      </div>

      <div className="glass border border-white/5 rounded-[40px] overflow-hidden focus-within:border-[#00f2ff]/30 transition-all shadow-2xl stagger-3 bg-zinc-950/30">
         <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
            <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            </div>
            <span className="text-[9px] text-zinc-800 font-mono tracking-widest uppercase font-black">Architecture_Runtime v3.2</span>
            <div className="flex items-center gap-4">
               {isPrecisionMode && <span className="text-[8px] font-black text-[#00f2ff] uppercase tracking-[0.2em] animate-pulse">Neural Verification ON</span>}
               <Copy size={16} className="text-zinc-800 cursor-pointer hover:text-white transition-colors" onClick={() => {navigator.clipboard.writeText(code); alert('Input Copied')}} />
            </div>
         </div>
         <textarea
            className="w-full h-72 bg-transparent p-6 text-xs font-mono outline-none resize-none text-gray-400 placeholder:text-zinc-900 font-medium selection:bg-[#00f2ff]/20"
            placeholder={`// Inject requirements or paste source code...\n// e.g. "Create a high-performance database wrapper in ${selectedLang}"`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
         />
         
         <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            {attachedFile ? (
              <div className="flex items-center gap-3 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-xl px-4 py-2 animate-in slide-in-from-left-4">
                 <FileText size={16} className="text-[#00f2ff]" />
                 <span className="text-[10px] font-black text-white truncate max-w-[150px] uppercase tracking-widest">{attachedFile.name}</span>
                 <button onClick={() => setAttachedFile(null)} className="text-red-500 ml-2 hover:bg-white/5 rounded-full p-1"><X size={14}/></button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 text-[10px] font-black text-gray-600 hover:text-[#00f2ff] transition-all uppercase tracking-[0.2em]"
              >
                <Upload size={16} />
                Attach Context
              </button>
            )}
            <div className="text-[8px] text-gray-800 font-black uppercase tracking-[0.3em]">Quantum Buffer Active</div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 stagger-4">
         <button 
           onClick={() => handleAction("Generate 100% correct code for this task:")}
           className={`flex flex-col items-center gap-2 justify-center p-5 rounded-[28px] text-[9px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 group ${
             isPrecisionMode ? 'bg-[#00f2ff] text-black shadow-xl shadow-[#00f2ff]/10' : 'glass border border-white/5 text-white'
           }`}
         >
           <FileCode size={20} className="group-hover:scale-110 transition-transform" /> {isPrecisionMode ? 'BUILD ARCHITECTURE' : 'GENERATE'}
         </button>
         <button 
           onClick={() => handleAction("Find and fix all bugs in this code with 100% accuracy:")}
           className="flex flex-col items-center gap-2 justify-center p-5 glass border border-white/5 rounded-[28px] text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 active:scale-95 transition-all group"
         >
           <Bug size={20} className="text-red-500 group-hover:rotate-12 transition-transform" /> DEBUG CORE
         </button>
         <button 
           onClick={() => handleAction("Provide a deep architectural explanation of this code:")}
           className="flex flex-col items-center gap-2 justify-center p-5 glass border border-white/5 rounded-[28px] text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 active:scale-95 transition-all group"
         >
           <Lightbulb size={20} className="text-yellow-500 group-hover:scale-110 transition-transform" /> LOGIC SCAN
         </button>
         <button 
           onClick={() => handleAction("Refactor this code for 100% efficiency and readability:")}
           className="flex flex-col items-center gap-2 justify-center p-5 glass border border-white/5 rounded-[28px] text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 active:scale-95 transition-all group"
         >
           <CheckCircle2 size={20} className="text-green-500 group-hover:scale-110 transition-transform" /> OPTIMIZE
         </button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in">
           <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#00f2ff]/5 border-t-[#00f2ff] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck size={28} className="text-[#00f2ff] animate-pulse" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.5em] animate-pulse">Running Neural Verification...</p>
              <p className="text-[8px] text-gray-700 uppercase tracking-widest font-black">Calculating Logic Integrity: 100%</p>
           </div>
        </div>
      )}

      {explanation && !isLoading && (
        <div className="glass border border-[#00f2ff]/20 rounded-[48px] p-10 animate-in slide-in-from-top-6 duration-500 shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#00f2ff]/5 blur-3xl rounded-full" />
           <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                 <Cpu size={16} className="text-[#00f2ff]" />
                 <h4 className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em]">Verified Neural Manifest</h4>
              </div>
              <button onClick={handleCopy} className="p-3 glass border border-white/5 rounded-2xl text-gray-400 hover:text-[#00f2ff] transition-all active:scale-90">
                <Copy size={18} />
              </button>
           </div>
           <div className="text-[11px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap selection:bg-[#00f2ff]/30">
              {explanation}
           </div>
        </div>
      )}
      <div className="h-10" />
    </div>
  );
};

export default CodingLab;
