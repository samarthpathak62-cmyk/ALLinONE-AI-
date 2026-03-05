
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Send, 
  X, 
  Loader2, 
  Bot, 
  User as UserIcon, 
  Search, 
  FileSearch, 
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Cpu
} from 'lucide-react';
import { generateChatResponse, MediaPart } from '../geminiService';
import { ChatMessage, View } from '../types';
import { useApp } from '../App';

const DocumentLab: React.FC = () => {
  const { addHistory, incrementMessageCount, user, setView } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string, size: string, data: string} | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      setIsScanning(true);
      reader.onload = async (ev) => {
        const result = ev.target?.result as string;
        const base64Data = result.split(',')[1];
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setAttachedFile({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          data: base64Data
        });
        setIsScanning(false);
        
        setMessages([{
          id: 'welcome',
          role: 'model',
          content: `PROTOCOL: Document "${file.name}" has been mapped and indexed in memory. Core semantic scanning complete. Ready for interrogation.`,
          timestamp: Date.now(),
          type: 'text'
        }]);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("System only accepts .pdf files for deep semantic analysis.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !attachedFile || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    incrementMessageCount();

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const mediaParts: MediaPart[] = [{ 
        inlineData: { 
          mimeType: 'application/pdf', 
          data: attachedFile.data 
        } 
      }];

      const response = await generateChatResponse(
        `PDF CONTEXT ANALYSIS: ${currentInput}`, 
        chatHistory, 
        mediaParts, 
        user?.isPremium
      );
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || 'Neural engine failed to parse response.',
        timestamp: Date.now(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMsg]);

      addHistory({
        id: Date.now().toString(),
        title: `DOC: ${attachedFile.name}`,
        view: View.DocumentLab,
        timestamp: Date.now(),
        preview: currentInput.substring(0, 40) + '...',
        messages: [...messages, userMsg, aiMsg]
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept="application/pdf"
      />

      <div className="flex justify-between items-center px-6 py-4 glass border-b border-white/5 z-20 stagger-1">
         <div className="flex items-center gap-4">
            <button onClick={() => setView(View.Home)} className="w-10 h-10 flex items-center justify-center glass border border-white/5 rounded-full text-gray-500 hover:text-white transition-all active:scale-90">
               <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col">
               <span className="text-[10px] font-black tracking-[0.4em] text-[#00f2ff] uppercase leading-none">Doc Intelligence</span>
               {attachedFile && <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest truncate max-w-[120px] mt-1">{attachedFile.name}</span>}
            </div>
         </div>
         {attachedFile && (
           <button 
            onClick={() => { setAttachedFile(null); setMessages([]); }}
            className="text-[9px] font-black text-red-500 hover:text-red-400 transition-all bg-red-500/5 px-4 py-2 rounded-full border border-red-500/20 active:scale-95"
           >
             PURGE LAB
           </button>
         )}
      </div>

      {!attachedFile && !isScanning ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 animate-in fade-in duration-700">
           <div className="w-36 h-36 rounded-[48px] bg-[#00f2ff]/5 border border-[#00f2ff]/10 flex items-center justify-center relative group stagger-2">
              <div className="absolute inset-0 bg-[#00f2ff]/10 blur-[80px] rounded-full opacity-30 animate-pulse" />
              <FileText className="text-[#00f2ff] relative z-10 animate-float" size={64} strokeWidth={1.5} />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-black border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] shadow-2xl">
                 <Sparkles size={20} className="animate-spin-slow" />
              </div>
           </div>
           
           <div className="text-center space-y-3 stagger-3">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase neon-blue">Document Lab</h2>
              <p className="text-[10px] text-gray-600 max-w-[240px] mx-auto leading-relaxed font-black uppercase tracking-widest opacity-80">
                Engage deep semantic indexing on any PDF document. Contextual analysis active.
              </p>
           </div>

           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center gap-3 px-10 py-5 bg-[#00f2ff] text-black font-black rounded-[32px] shadow-[0_0_50px_rgba(0,242,255,0.25)] hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-[0.3em] stagger-4"
           >
             <Upload size={22} />
             INJECT PDF CORE
           </button>

           <div className="flex gap-6 pt-6 stagger-5">
              {[
                { icon: FileSearch, label: 'SCAN' },
                { icon: Search, label: 'MAP' },
                { icon: MessageSquare, label: 'SYNC' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                   <div className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-[#00f2ff] transition-all group-hover:scale-110">
                      <item.icon size={20} />
                   </div>
                   <span className="text-[7px] font-black uppercase text-gray-700 tracking-[0.4em] group-hover:text-gray-400 transition-colors">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      ) : isScanning ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
           <div className="relative">
              <div className="w-28 h-28 rounded-full border-2 border-[#00f2ff]/5 border-t-[#00f2ff] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <FileText className="text-[#00f2ff] animate-pulse" size={40} strokeWidth={1} />
              </div>
           </div>
           <div className="text-center space-y-3">
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-[#00f2ff] animate-pulse">Neural Threading...</h3>
              <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest leading-relaxed">Mapping Semantic Vectors & Document Structure</p>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 pb-44 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex gap-4 animate-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-xl ${
                    msg.role === 'user' ? 'bg-[#00f2ff]/10 border-[#00f2ff]/20 text-[#00f2ff]' : 'glass border-white/10 text-[#00f2ff]'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={18} /> : <Cpu size={18} />}
                  </div>

                  <div className={`max-w-[85%] rounded-[28px] p-5 shadow-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#00f2ff] text-black font-black uppercase italic tracking-tighter rounded-tr-none' 
                      : 'glass-dark border border-white/10 text-white rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed tracking-tight">{msg.content}</p>
                    <div className="mt-4 pt-3 border-t border-black/5 text-[9px] opacity-40 uppercase font-black tracking-widest">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 animate-in fade-in">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-700">
                    <Cpu size={18} className="animate-spin-slow" />
                  </div>
                  <div className="glass-dark border border-white/10 rounded-[28px] rounded-tl-none p-5 flex flex-col gap-3 shadow-xl">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[8px] text-[#00f2ff] font-black uppercase tracking-[0.3em]">Parsing Context...</span>
                  </div>
                </div>
              )}
           </div>

           <div className="fixed bottom-24 left-0 right-0 p-4 z-40">
              <div className="max-w-2xl mx-auto glass-dark border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[32px] p-2.5 flex items-center gap-3 shadow-2xl">
                 <div className="pl-3 flex items-center gap-3 border-r border-white/10 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] shadow-lg">
                       <FileText size={20} />
                    </div>
                 </div>
                 
                 <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Query document core..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-1 outline-none font-medium placeholder:text-zinc-800 placeholder:font-black placeholder:uppercase"
                 />

                 <button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading} 
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                      input.trim() && !isLoading 
                        ? 'bg-[#00f2ff] text-black shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:scale-105 active:scale-90' 
                        : 'bg-white/5 text-gray-800 opacity-50'
                    }`}
                 >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                 </button>
              </div>
           </div>
        </div>
      )}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DocumentLab;
