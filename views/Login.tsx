
import React, { useState } from 'react';
import { useApp } from '../App';
import { View, User } from '../types';
import { Shield, Sparkles, Hash, ArrowRight, UserPlus, Fingerprint, LogIn } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

const Login: React.FC = () => {
  const { setUser, setView, generateNewId } = useApp();
  const [allocationStep, setAllocationStep] = useState<'welcome' | 'generating' | 'ready'>('welcome');
  const [generatedId, setGeneratedId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ensure we start at welcome
  React.useEffect(() => {
    setAllocationStep('welcome');
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      if (googleUser) {
        const newUser: User = {
          id: googleUser.uid,
          username: googleUser.displayName || `User_${googleUser.uid.slice(0, 6)}`,
          avatar: googleUser.photoURL || undefined,
          joinDate: Date.now(),
          lastActive: Date.now(),
          totalMessages: 0,
          isPremium: false,
          premiumExpiryDate: null,
          status: 'active',
          stats: { chats: 0, generations: 0, tokens: 0 }
        };
        setUser(newUser);
        setView(View.Home);
      }
    } catch (error: any) {
      console.error("Google login failed", error);
      if (error.message?.includes('auth/invalid-api-key')) {
        alert("Firebase API Key is missing. Please configure VITE_FIREBASE_API_KEY in your environment.");
      } else {
        alert("Login failed. Please check your connection or try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startAllocation = () => {
    setAllocationStep('generating');
    setTimeout(() => {
      setGeneratedId(generateNewId());
      setAllocationStep('ready');
    }, 2000);
  };

  const finalizeIdentity = () => {
    const newUser: User = {
      id: generatedId,
      username: username || `Guest_${generatedId.split('_')[1]}`,
      joinDate: Date.now(),
      lastActive: Date.now(),
      totalMessages: 0,
      isPremium: false,
      premiumExpiryDate: null,
      status: 'active',
      stats: { chats: 0, generations: 0, tokens: 0 }
    };
    setUser(newUser);
    setView(View.Home);
  };

  return (
    <div 
      className="min-h-[100dvh] bg-black flex flex-col p-6 justify-between relative overflow-hidden font-sans"
      style={{
        paddingTop: 'calc(24px + env(safe-area-inset-top))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-[#00f2ff]/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center mt-12 text-center">
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#00f2ff] to-[#0066ff] flex items-center justify-center shadow-[0_0_50px_rgba(0,242,255,0.4)] mb-6 rotate-3 animate-float">
            <Fingerprint size={40} className="text-black" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase italic neon-blue">ALLINONE AI</h1>
        <p className="text-gray-500 max-w-[240px] text-[9px] leading-relaxed font-black uppercase tracking-[0.4em]">
          Global Ultra Pro Core • Automated Secure Protocol
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full py-10">
        {allocationStep === 'welcome' && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tight">Welcome to Core</h2>
              <p className="text-gray-500 text-[11px] leading-relaxed uppercase tracking-widest px-6 opacity-70">
                Sign in to synchronize your neural profile across the global network.
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-6 bg-white text-black font-black rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gray-100 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    Login or Sign Up
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full gap-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Secure Access</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <button 
                  onClick={startAllocation}
                  className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] hover:text-[#00f2ff] transition-colors py-2"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {allocationStep === 'generating' && (
          <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#00f2ff]/10 border-t-[#00f2ff] animate-spin" />
              <Hash size={40} className="absolute inset-0 m-auto text-[#00f2ff] animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-[#00f2ff] text-sm font-black uppercase tracking-[0.5em] animate-pulse">Hashing Neural ID...</p>
              <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-3 font-bold">Establishing secure handshake</p>
            </div>
          </div>
        )}

        {allocationStep === 'ready' && (
          <div className="w-full space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="w-full p-10 glass border border-[#00f2ff]/30 rounded-[48px] text-center space-y-8 shadow-[0_0_60px_rgba(0,242,255,0.15)]">
               <div className="text-[11px] text-[#00f2ff] font-black uppercase tracking-[0.4em]">Identity Forged</div>
               <div className="text-4xl font-black neon-blue font-mono tracking-tighter flex items-center justify-center gap-2">
                 {generatedId}
               </div>
               
               <div className="space-y-4 pt-4">
                 <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest text-left px-3">Neural Handle (Optional)</div>
                 <input 
                   type="text" 
                   placeholder="e.g. CORE_USER_01"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm outline-none focus:border-[#00f2ff]/50 transition-all font-bold text-white placeholder:text-white/20"
                 />
                 <p className="text-[9px] text-zinc-600 uppercase font-black text-left px-3 leading-relaxed">This ID is your permanent key to the global neural network.</p>
               </div>
            </div>

            <button 
              onClick={finalizeIdentity}
              className="w-full py-6 bg-[#00f2ff] text-black font-black rounded-3xl shadow-[0_0_40px_rgba(0,242,255,0.3)] active:scale-95 transition-all text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              ENTER CORE <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-16 text-gray-800 pb-8">
         <Shield size={24} className="opacity-40" />
         <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
         <Sparkles size={24} className="opacity-40" />
      </div>
    </div>
  );
};

export default Login;
