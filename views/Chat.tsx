
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse, MediaPart } from '../geminiService';
import { ChatMessage, View } from '../types';
import { useApp } from '../App';
import { 
  Send, 
  ImageIcon, 
  Paperclip, 
  Mic, 
  MicOff, 
  Copy, 
  Share2, 
  X, 
  FileText, 
  Loader2, 
  PlusCircle, 
  Check, 
  User as UserIcon,
  Bot,
  Edit2,
  Upload,
  Clock,
  Sparkles,
  Cpu
} from 'lucide-react';

const Chat: React.FC = () => {
  const { addHistory, incrementMessageCount, user, history, activeSessionId, setActiveSessionId, startNewChat, textColor } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string, type: string, data: string} | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (activeSessionId) {
      const session = history.find(h => h.id === activeSessionId);
      if (session && session.messages) {
        setMessages(session.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeSessionId, history]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + ' ' + transcript).trim());
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAttachedFile({
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ALLinONE AI Message',
          text: content,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy(content, 'share-fallback');
      alert('Native sharing is not supported on this browser. Message copied to clipboard instead.');
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;
    if (isListening) toggleListening();

    const currentSessionId = activeSessionId || Date.now().toString();
    if (!activeSessionId) setActiveSessionId(currentSessionId);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (attachedFile ? `Attached file: ${attachedFile.name}` : ''),
      timestamp: Date.now(),
      type: attachedFile 
        ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') 
        : 'text',
      mediaUrl: attachedFile && attachedFile.type.startsWith('image/') 
        ? `data:${attachedFile.type};base64,${attachedFile.data}` 
        : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentFile = attachedFile;
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);
    incrementMessageCount();

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const mediaParts: MediaPart[] = currentFile ? [{ inlineData: { mimeType: currentFile.type, data: currentFile.data } }] : [];
      const response = await generateChatResponse(currentInput || "Analyze this context.", chatHistory, mediaParts, user?.isPremium);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || 'Neural engine timeout. Try again.',
        timestamp: Date.now(),
        type: 'text'
      };

      const finalMessages = [...messages, userMsg, aiMsg];
      setMessages(finalMessages);
      addHistory({
        id: currentSessionId,
        title: currentInput ? (currentInput.substring(0, 30)) : "Neural Sync",
        view: View.Chat,
        timestamp: Date.now(),
        preview: response ? response.substring(0, 60) : 'Session Active',
        messages: finalMessages
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const borderOpacity = textColor === '#000000' ? 'border-black/10' : 'border-white/10';
  const glassClass = textColor === '#000000' ? 'bg-black/5' : 'bg-white/5';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* Neural Session Header */}
      <div className="flex justify-between items-center px-6 py-4 glass border-b transition-all" style={{ borderColor: `${textColor}10` }}>
         <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#00f2ff] animate-ping opacity-30 absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-[#00f2ff] relative" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] text-[#00f2ff] uppercase">Core Sync</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{activeSessionId ? 'Thread_Restored' : 'New_Protocol'}</span>
            </div>
         </div>
         <button 
          onClick={() => startNewChat(View.Chat)}
          className="flex items-center gap-2 text-[9px] font-black text-gray-500 hover:text-[#00f2ff] transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 uppercase tracking-widest active:scale-95"
         >
           <PlusCircle size={14} /> NEW THREAD
         </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-10 pb-44 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10 space-y-6 animate-in fade-in duration-1000">
             <div className="w-24 h-24 rounded-[40px] bg-[#00f2ff]/5 border border-[#00f2ff]/20 flex items-center justify-center relative shadow-[0_0_80px_rgba(0,242,255,0.05)] mb-4 group">
                <div className="absolute inset-0 bg-[#00f2ff]/10 rounded-[40px] animate-pulse blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Bot className="text-[#00f2ff] relative z-10 animate-float" size={48} />
             </div>
             <div>
                <h2 className="text-4xl font-black italic tracking-tighter mb-2 neon-blue uppercase leading-none">ALLinONE AI</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Cpu size={12} className="text-gray-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">v3.2 Global Ultra Core</span>
                </div>
                <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest p-3 glass border border-white/5 rounded-2xl">Ask complex logic questions</p>
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest p-3 glass border border-white/5 rounded-2xl">Upload documents for analysis</p>
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest p-3 glass border border-white/5 rounded-2xl">Multilingual neural processing</p>
                </div>
             </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex gap-4 animate-in slide-in-from-bottom-4 zoom-in-95 duration-500 delay-[${idx * 50}ms] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-2xl transition-all ${
              msg.role === 'user' ? 'bg-[#00f2ff]/20 border-[#00f2ff]/30 text-[#00f2ff]' : 'glass border-white/10 text-gray-500'
            }`}>
              {msg.role === 'user' ? <UserIcon size={20} strokeWidth={2.5} /> : <Bot size={20} strokeWidth={2.5} className="text-[#00f2ff]" />}
            </div>

            <div className={`max-w-[85%] group`}>
              <div className={`relative rounded-[28px] p-5 shadow-2xl transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-[#00f2ff] text-black font-semibold rounded-tr-none' 
                  : 'glass-dark border border-white/5 text-white rounded-tl-none'
              }`}>
                {msg.mediaUrl && msg.type === 'image' && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-black/10 shadow-2xl scale-in duration-500">
                    <img src={msg.mediaUrl} alt="Neural Preview" className="w-full h-auto object-cover max-h-72" />
                  </div>
                )}
                
                {msg.type === 'file' && !msg.mediaUrl && (
                  <div className="mb-4 p-4 rounded-2xl bg-black/10 border border-black/5 flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <FileText size={20} className={msg.role === 'user' ? 'text-black' : 'text-[#00f2ff]'} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">{msg.content.replace('Attached file: ', '')}</span>
                      <span className="text-[8px] opacity-50 font-black uppercase tracking-widest">Neural Data Packet</span>
                    </div>
                  </div>
                )}
                
                <p className="text-sm whitespace-pre-wrap leading-relaxed tracking-tight">{msg.content}</p>

                <div className={`flex items-center gap-4 mt-4 pt-3 border-t transition-opacity duration-300 ${
                  msg.role === 'user' ? 'border-black/10 text-black/50' : 'border-white/5 text-gray-600'
                }`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center gap-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleCopy(msg.content, msg.id)} className="p-1 hover:scale-110 transition-transform">
                      {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => handleShare(msg.content)} className="p-1 hover:scale-110 transition-transform"><Share2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-10 h-10 rounded-2xl glass border border-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] shadow-2xl">
              <Cpu size={20} className="animate-spin-slow" />
            </div>
            <div className="glass-dark border border-white/5 rounded-[28px] rounded-tl-none p-6 flex flex-col gap-4 min-w-[180px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff]/40 to-transparent animate-shimmer" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.3em] block">Neural Synthesis</span>
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">Analyzing logical vectors...</span>
              </div>
              <Sparkles className="absolute right-4 bottom-4 text-[#00f2ff]/10 animate-float" size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Futuristic Command Bar */}
      <div className="fixed bottom-24 left-0 right-0 p-4 z-40">
        <div className="max-w-3xl mx-auto space-y-3">
          {attachedFile && (
            <div className="px-5 py-4 glass-dark backdrop-blur-3xl rounded-[24px] border border-[#00f2ff]/30 animate-in slide-in-from-bottom-8 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                {attachedFile.type.startsWith('image/') ? (
                  <div className="w-12 h-12 rounded-xl border border-[#00f2ff]/20 overflow-hidden">
                    <img src={`data:${attachedFile.type};base64,${attachedFile.data}`} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-3 bg-[#00f2ff]/10 rounded-xl border border-[#00f2ff]/20">
                    <FileText className="text-[#00f2ff]" size={20} />
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-[10px] text-white font-black uppercase tracking-widest truncate max-w-[180px]">{attachedFile.name}</p>
                  <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">Neural Context Ready</p>
                </div>
              </div>
              <button onClick={() => setAttachedFile(null)} className="p-2 text-red-500 hover:bg-white/5 rounded-full transition-colors"><X size={18} /></button>
            </div>
          )}

          <div className="glass border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[32px] p-2.5 shadow-[0_0_80px_rgba(0,0,0,0.6)] flex items-center gap-2 group focus-within:border-[#00f2ff]/30 transition-all duration-500">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-90 ${
                  attachedFile?.type.startsWith('image/') ? 'bg-[#00f2ff] text-black shadow-[#00f2ff]/20' : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
                title="Upload Image"
              >
                <ImageIcon size={18} />
              </button>

              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*/*";
                    fileInputRef.current.click();
                  }
                }}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-90 ${
                  attachedFile && !attachedFile.type.startsWith('image/') ? 'bg-[#00f2ff] text-black shadow-[#00f2ff]/20' : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
                title="Upload File"
              >
                <Paperclip size={18} />
              </button>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder="Inject neural command..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-1 resize-none outline-none max-h-40 font-medium placeholder:text-zinc-800 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
            />

            <button onClick={toggleListening} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-700 hover:text-[#00f2ff]'}`}>
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <button 
              onClick={handleSend} 
              disabled={(!input.trim() && !attachedFile) || isLoading} 
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                (input.trim() || attachedFile) && !isLoading 
                  ? 'bg-[#00f2ff] text-black shadow-[0_0_30px_rgba(0,242,255,0.4)] scale-110 active:scale-90' 
                  : 'bg-white/5 text-gray-800 opacity-50'
              }`}
            >
              {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Chat;
