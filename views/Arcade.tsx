
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Brain, BookOpen, Map, ArrowRight, X, Send, Loader2, Trophy, Heart, Zap, Sword, Target } from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';
import { generateChatResponse } from '../geminiService';

const Arcade: React.FC = () => {
  const { addHistory, user } = useApp();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>({
    messages: [],
    loading: false,
    input: '',
    score: 0,
    health: 100,
    stats: { level: 1, xp: 0 }
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.messages]);

  const games = [
    { id: 'guess', name: 'Guessing Core', icon: Brain, color: 'from-orange-500 to-amber-400', desc: 'Can you fool the master AI?', prompt: "Let's play a guessing game. You (the AI) try to guess the object I am thinking of by asking me questions one by one. I will answer with Yes/No/Maybe. Start by saying hello and asking your first question." },
    { id: 'story', name: 'Story Quest', icon: BookOpen, color: 'from-green-500 to-teal-400', desc: 'Choose your own AI adventure', prompt: "Start an interactive 'Choose Your Own Adventure' story set in a cyberpunk world. After every part of the story, give me 3 numbered options to choose from." },
    { id: 'quiz', name: 'Expert Quiz', icon: Target, color: 'from-blue-500 to-indigo-400', desc: 'Beat the smartest bot in trivia', prompt: "Start a trivia quiz game. Ask me multiple-choice questions one by one. Keep track of my score." },
    { id: 'rpg', name: 'Chatbot RPG', icon: Sword, color: 'from-purple-500 to-violet-400', desc: 'Procedural text-based world', prompt: "Let's play a text-based RPG. I am a hero in a dark fantasy land. You are the game master. Describe my starting location and ask me what I want to do. Include stats like [HP: 100, LVL: 1] in your responses." },
  ];

  const handleStartGame = async (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setSelectedGame(gameId);
    setGameState({
      messages: [],
      loading: true,
      input: '',
      score: 0,
      health: 100,
      stats: { level: 1, xp: 0 }
    });

    try {
      const response = await generateChatResponse(game.prompt, [], [], user?.isPremium);
      setGameState(prev => ({
        ...prev,
        messages: [{ role: 'model', content: response, timestamp: Date.now() }],
        loading: false
      }));

      addHistory({
        id: Date.now().toString(),
        title: `Played ${game.name}`,
        view: View.Arcade,
        timestamp: Date.now(),
        preview: `A new session in ${game.name}.`,
        messages: [{ id: '1', role: 'model', content: response, timestamp: Date.now(), type: 'text' }]
      });
    } catch (err) {
      console.error(err);
      setGameState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAction = async () => {
    if (!gameState.input.trim() || gameState.loading) return;

    const userInput = gameState.input;
    const newMessages = [...gameState.messages, { role: 'user', content: userInput, timestamp: Date.now() }];
    
    setGameState(prev => ({ ...prev, messages: newMessages, input: '', loading: true }));

    try {
      const chatHistory = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await generateChatResponse(userInput, chatHistory, [], user?.isPremium);
      
      let healthUpdate = gameState.health;
      if (response.includes("HP:")) {
        const match = response.match(/HP:\s*(\d+)/);
        if (match) healthUpdate = parseInt(match[1]);
      }

      setGameState(prev => ({
        ...prev,
        messages: [...newMessages, { role: 'model', content: response, timestamp: Date.now() }],
        loading: false,
        health: healthUpdate,
        score: response.includes("Score:") ? prev.score + 10 : prev.score
      }));
    } catch (err) {
      console.error(err);
      setGameState(prev => ({ ...prev, loading: false }));
    }
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    return (
      <div className="flex flex-col h-full animate-in zoom-in duration-500 bg-transparent">
        <div className="p-4 glass border-b border-white/10 flex justify-between items-center z-10 stagger-1">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game?.color} flex items-center justify-center shadow-lg shadow-black/40`}>
                {game && <game.icon size={24} className="text-white" />}
             </div>
             <div>
               <h3 className="text-sm font-black uppercase italic tracking-widest">{game?.name}</h3>
               <div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500">
                    <Heart size={10} fill="currentColor" /> {gameState.health}%
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-yellow-500">
                    <Trophy size={10} /> {gameState.score}
                  </div>
               </div>
             </div>
          </div>
          <button onClick={() => setSelectedGame(null)} className="w-10 h-10 flex items-center justify-center glass border border-white/5 rounded-full hover:bg-white/5 transition-all active:scale-90"><X size={20}/></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
           {gameState.messages.map((m: any, idx: number) => (
             <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[28px] text-sm shadow-xl ${
                  m.role === 'user' ? 'bg-[#00f2ff] text-black font-black uppercase italic tracking-tighter rounded-tr-none' : 'glass border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
             </div>
           ))}
           {gameState.loading && (
             <div className="flex justify-start animate-in fade-in">
               <div className="glass border border-white/10 p-5 rounded-[28px] rounded-tl-none flex flex-col gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">AI Thinking...</span>
               </div>
             </div>
           )}
        </div>

        <div className="fixed bottom-24 left-0 right-0 p-4 z-20">
          <div className="max-w-2xl mx-auto glass-dark backdrop-blur-3xl border border-white/10 rounded-[32px] p-2.5 shadow-2xl flex items-center gap-3">
             <input 
               value={gameState.input}
               onChange={(e) => setGameState(prev => ({ ...prev, input: e.target.value }))}
               onKeyDown={(e) => e.key === 'Enter' && handleAction()}
               placeholder="Decide your next move..."
               className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-medium placeholder:text-zinc-800 placeholder:font-black placeholder:uppercase"
             />
             <button 
              onClick={handleAction}
              disabled={gameState.loading || !gameState.input.trim()}
              className="w-12 h-12 flex items-center justify-center bg-[#00f2ff] text-black rounded-2xl shadow-lg disabled:opacity-50 active:scale-90 transition-all"
             >
               <Send size={20} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="stagger-1">
        <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">AI <span className="neon-blue">Arcade</span></h2>
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Neural Gaming Protocol</p>
      </div>

      <div className="space-y-4">
        {games.map((game, idx) => {
          const Icon = game.icon;
          const staggerClass = `stagger-${idx + 2}`;
          return (
            <button
              key={game.id}
              onClick={() => handleStartGame(game.id)}
              className={`w-full flex items-center p-6 glass border border-white/5 rounded-[40px] hover:border-[#00f2ff]/30 transition-all text-left relative overflow-hidden group active:scale-[0.98] ${staggerClass}`}
            >
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${game.color} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${game.color} shadow-2xl mr-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <Icon size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg text-white uppercase italic tracking-tight group-hover:text-[#00f2ff] transition-colors">{game.name}</h3>
                <p className="text-[9px] text-gray-600 mt-1 font-black uppercase tracking-widest">{game.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                <ArrowRight size={20} className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-8 glass rounded-[48px] border border-[#00f2ff]/10 text-center relative overflow-hidden stagger-6">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent animate-pulse" />
        <div className="flex items-center justify-center gap-2 mb-6">
          <Trophy size={14} className="text-yellow-500" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Neural Leaderboard</h4>
        </div>
        <div className="space-y-4">
          {[
            { n: 'ARCHITECT_PRO', s: '98,400', icon: Sword },
            { n: 'NEURAL_PHOENIX', s: '84,100', icon: Zap },
            { n: 'VOID_WALKER', s: '76,900', icon: Map },
          ].map((u, i) => (
            <div key={u.n} className="flex justify-between items-center text-[10px] font-black border-b border-white/5 pb-3 px-2 group hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                 <span className="text-gray-700 w-4">0{i+1}</span>
                 <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:text-[#00f2ff] transition-colors">
                    <u.icon size={12} />
                 </div>
                 <span className="text-gray-400 font-mono tracking-tighter uppercase">{u.n}</span>
              </div>
              <span className="neon-blue tabular-nums">{u.s} PTS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Arcade;
