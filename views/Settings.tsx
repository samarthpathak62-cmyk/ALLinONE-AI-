
import React, { useState, useRef } from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { 
  User as UserIcon, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  Calendar,
  MessageCircle,
  Hash,
  Edit2,
  Check,
  MessageSquarePlus,
  Upload,
  Fingerprint,
  Palette,
  RotateCcw,
  Pipette,
  Heart
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, setView, setUser, clearHistory, textColor } = useApp();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(user?.username || '');
  const [customHex, setCustomHex] = useState(user?.themeColor || '#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeColors = [
    { name: 'Pure Black', hex: '#000000' },
    { name: 'Midnight', hex: '#0a0b1e' },
    { name: 'Amethyst', hex: '#120a1e' },
    { name: 'Emerald', hex: '#0a1e15' },
    { name: 'Crimson', hex: '#1e0a0a' },
    { name: 'Charcoal', hex: '#121212' },
  ];

  const saveUsername = () => {
    if (user) {
      setUser({ ...user, username: tempUsername });
      setIsEditingUsername(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (user) {
          setUser({ ...user, avatar: ev.target?.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const changeTheme = (color: string) => {
    if (user) {
      setUser({ ...user, themeColor: color });
      setCustomHex(color);
    }
  };

  const handleCustomColor = (color: string) => {
    setCustomHex(color);
    if (user) {
      setUser({ ...user, themeColor: color });
    }
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-6 pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="stagger-1">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase italic leading-none">
          <Fingerprint className="text-[#00f2ff]" /> Identity Center
        </h2>
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 ml-10">User Profile & Environment</p>
      </div>

      {/* Identity Card */}
      <div className="p-8 rounded-[48px] glass border border-[#00f2ff]/10 relative overflow-hidden bg-gradient-to-br from-zinc-950/40 to-black/40 shadow-2xl stagger-2">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] animate-pulse">
           <Fingerprint size={200} />
        </div>
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-2 border-[#00f2ff]/30 p-1.5 bg-black shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
               {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
               ) : (
                 <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                    <UserIcon size={48} className="text-[#00f2ff]/40" />
                 </div>
               )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2.5 bg-[#00f2ff] text-black rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all border-2 border-black"
            >
              <Upload size={14} />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>
          
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-3 mb-2">
              {isEditingUsername ? (
                <div className="flex gap-2 animate-in zoom-in duration-300">
                  <input 
                    className="bg-zinc-800 border border-[#00f2ff]/50 rounded-xl px-4 py-2 text-sm outline-none font-black text-white uppercase tracking-widest"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    autoFocus
                  />
                  <button onClick={saveUsername} className="p-3 bg-[#00f2ff] text-black rounded-xl shadow-lg active:scale-90"><Check size={16}/></button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">{user?.username || 'Guest User'}</h3>
                  <button onClick={() => setIsEditingUsername(true)} className="text-gray-700 hover:text-white transition-colors"><Edit2 size={16}/></button>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
              <Hash size={10} className="text-[#00f2ff]" />
              <span>{user?.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 glass rounded-[32px] border border-white/5 flex flex-col items-center group hover:border-[#00f2ff]/20 transition-all">
                 <Calendar size={20} className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Linked Since</span>
                 <span className="text-[10px] font-black mt-2 uppercase text-white tracking-widest">{user ? formatDate(user.joinDate) : 'N/A'}</span>
              </div>
              <div className="p-6 glass rounded-[32px] border border-white/5 flex flex-col items-center group hover:border-[#00f2ff]/20 transition-all">
                 <MessageCircle size={20} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Neural Syncs</span>
                 <span className="text-[10px] font-black mt-2 uppercase text-white tracking-widest">{user?.totalMessages || 0} MESSAGES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Visual Customization Section */}
        <section className="space-y-4 stagger-3">
          <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
            <Palette size={12} className="text-[#00f2ff]" /> UI Environment
          </h4>
          
          <div className="w-full glass border border-white/5 rounded-[40px] p-8 space-y-10 shadow-2xl bg-black/20">
            <div className="space-y-5">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00f2ff] block">Premium Neural Palette</span>
              <div className="flex flex-wrap gap-4">
                {themeColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => changeTheme(color.hex)}
                    className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center relative active:scale-90 ${
                      (user?.themeColor === color.hex || (!user?.themeColor && color.hex === '#000000'))
                        ? 'border-[#00f2ff] scale-110 shadow-[0_0_20px_rgba(0,242,255,0.4)] z-10'
                        : 'border-white/5 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {(user?.themeColor === color.hex || (!user?.themeColor && color.hex === '#000000')) && (
                      <Check size={20} className="text-[#00f2ff] animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-white/5 w-full" />

            {/* Custom Color Engine */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00f2ff] block">Neural Engine Core</span>
                <button 
                  onClick={() => handleCustomColor('#000000')}
                  className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-600 hover:text-white transition-colors"
                >
                  <RotateCcw size={10} /> Reset Default
                </button>
              </div>
              
              <div className="flex items-center gap-6 bg-black/40 p-5 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
                <div className="relative group">
                  <input 
                    type="color" 
                    value={customHex} 
                    onChange={(e) => handleCustomColor(e.target.value)}
                    className="w-16 h-16 rounded-2xl bg-transparent cursor-pointer border-none p-0 overflow-hidden shadow-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/40 group-hover:text-white transition-colors">
                    <Pipette size={20} />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                   <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Neural HEX Signature</p>
                   <div className="flex items-center gap-3">
                     <span className="text-[#00f2ff] font-black tracking-tighter text-lg italic">#</span>
                     <input 
                       type="text" 
                       value={customHex.replace('#', '').toUpperCase()} 
                       onChange={(e) => {
                         const val = e.target.value;
                         if (val.length <= 6) {
                            handleCustomColor(`#${val}`);
                         }
                       }}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono font-black tracking-[0.3em] uppercase outline-none focus:border-[#00f2ff]/50 transition-all"
                       placeholder="000000"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 stagger-4">
          <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2">Access Level</h4>
          <div className="w-full flex items-center justify-between p-6 glass border border-white/5 rounded-[40px] hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase tracking-tight italic">Protocol Tier</span>
                  <span className="text-[8px] text-gray-500 uppercase font-black tracking-[0.2em]">{user?.isPremium ? 'GLOBAL ACCESS ACTIVE' : 'STANDARD RESTRICTIONS'}</span>
                </div>
              </div>
              <div className={`text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest ${user?.isPremium ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                {user?.isPremium ? 'ULTRA PRO' : 'GUEST'}
              </div>
          </div>
          {!user?.isPremium && (
            <button onClick={() => setView(View.Premium)} className="w-full p-6 bg-white text-black font-black rounded-[40px] text-xs uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all hover:bg-[#00f2ff] hover:shadow-[#00f2ff]/20">
              UPGRADE NEURAL ENGINE
            </button>
          )}
        </section>

        {/* Neural Support & Feedback */}
        <section className="space-y-4 stagger-5">
          <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2">System Support</h4>
          <button 
            onClick={() => setView(View.Feedback)}
            className="w-full flex items-center justify-between p-6 glass border border-white/5 rounded-[40px] hover:border-[#00f2ff]/30 transition-all text-left group active:scale-[0.98]"
          >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                  <MessageSquarePlus size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-tight italic">Submit Feedback</span>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-all group-hover:translate-x-1" />
              </div>
          </button>
        </section>

        <section className="space-y-4 stagger-6">
          <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2">Data Operations</h4>
          <button onClick={clearHistory} className="w-full flex items-center justify-between p-6 glass border border-white/5 rounded-[40px] hover:bg-red-500/10 hover:border-red-500/20 transition-all text-left group active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Trash2 size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-tight italic text-red-500">Purge Activity Logs</span>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 transition-colors">
                <ChevronRight size={18} className="text-zinc-800 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
              </div>
          </button>
        </section>
      </div>

      <div className="flex flex-col items-center justify-center py-10 text-gray-600 space-y-3 stagger-7">
         <div className="flex items-center gap-2 text-[10px] font-black italic tracking-tighter opacity-40">
            <Info size={12} />
            <span>ALLINONE AI — PRO CORE v3.2 GLOBAL</span>
         </div>
         <p className="text-[8px] uppercase tracking-[0.5em] font-black opacity-20 text-center leading-relaxed px-10">Neural Identity Secured • Quantum Encryption Active • No User Tracking Protocol</p>
      </div>
    </div>
  );
};

export default Settings;
