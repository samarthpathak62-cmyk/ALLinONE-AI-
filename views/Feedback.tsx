
import React, { useState } from 'react';
import { MessageSquarePlus, Star, Send, Loader2, CheckCircle2, Bug, Lightbulb, Heart, ArrowLeft } from 'lucide-react';
import { useApp } from '../App';
import { View } from '../types';

const Feedback: React.FC = () => {
  const { setView } = useApp();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<'bug' | 'feature' | 'praise' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!category || !comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    // Simulate Neural Core transmission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setView(View.Home);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-black italic mb-2 uppercase tracking-tighter">Transmission Complete</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Your feedback has been integrated into the Global Ultra Pro Core. Thank you for evolving with us.
        </p>
        <button 
          onClick={() => setView(View.Home)}
          className="mt-8 text-[10px] font-black uppercase text-[#00f2ff] tracking-[0.2em]"
        >
          Returning to Dashboard...
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-lg mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => setView(View.Settings)} className="p-2 glass rounded-full text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase italic">Neural <span className="neon-blue">Feedback</span></h2>
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em]">Direct Link to Core Development</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">How is the intelligence?</h3>
        <div className="flex justify-between items-center glass p-6 rounded-3xl border border-white/5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              className={`transition-all duration-300 ${rating >= star ? 'scale-125 text-[#00f2ff]' : 'text-gray-700 hover:text-gray-500'}`}
            >
              <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Select category</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setCategory('bug')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              category === 'bug' ? 'bg-red-500/20 border-red-500 text-red-400' : 'glass border-white/5 text-gray-500'
            }`}
          >
            <Bug size={20} />
            <span className="text-[9px] font-bold uppercase">Bug</span>
          </button>
          <button 
            onClick={() => setCategory('feature')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              category === 'feature' ? 'bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]' : 'glass border-white/5 text-gray-500'
            }`}
          >
            <Lightbulb size={20} />
            <span className="text-[9px] font-bold uppercase">Idea</span>
          </button>
          <button 
            onClick={() => setCategory('praise')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              category === 'praise' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'glass border-white/5 text-gray-500'
            }`}
          >
            <Heart size={20} />
            <span className="text-[9px] font-bold uppercase">Praise</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Detailed Log</h3>
        <div className="glass p-6 rounded-3xl border border-white/10 focus-within:border-[#00f2ff]/50 transition-all">
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your message to the developers..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm h-32 resize-none placeholder:text-gray-800"
          />
        </div>
      </section>

      <button 
        disabled={!category || !comment.trim() || isSubmitting}
        onClick={handleSubmit}
        className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.3)] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {isSubmitting ? 'Uplinking...' : 'Establish Neural Link'}
      </button>

      <div className="text-center pt-4">
        <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">
          Verified User ID: {useApp().user?.id} • Identity Encrypted
        </p>
      </div>
    </div>
  );
};

export default Feedback;
