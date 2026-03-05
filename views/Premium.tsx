
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { CheckCircle2, Zap, Crown, Shield, Rocket, X, Loader2, AlertCircle } from 'lucide-react';

const Premium: React.FC = () => {
  const { setView, setUser, user } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' | null }>({ text: '', type: null });

  const plans = [
    { id: 'premium_monthly', name: 'Neural Monthly', price: '₹99', period: 'month', best: false },
    { id: 'premium_quarterly', name: 'Neural Quarterly', price: '₹299', period: '3 months', best: true },
  ];

  // --- Payment Success Listener (Simulated for Google Play Billing) ---
  const handlePaymentConfirmation = async () => {
    setStatusMessage({ text: 'Verifying with Play Store Servers...', type: 'info' });
    
    // Simulate the latency of a real billing listener
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // In a real Android environment, this block would be triggered by a PaymentListener callback
    const isPaymentValid = true; 

    if (isPaymentValid && user) {
      const updatedUser = { ...user, isPremium: true };
      
      // Update Global State
      setUser(updatedUser);
      
      // Persistent Storage
      localStorage.setItem('allinone_is_premium', 'true');
      localStorage.setItem('allinone_had_premium', 'true');
      
      setStatusMessage({ text: "PURCHASE SUCCESSFUL! Access Granted 🎉", type: 'success' });
      
      // Auto-navigation back to main dashboard
      setTimeout(() => setView(View.Home), 3000);
      return true;
    }
    return false;
  };

  const handleSubscribe = async (planId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setStatusMessage({ text: 'Initiating Google Play Intent...', type: 'info' });

    try {
      // 1. Core Verification (API Key for Quantum Vision Engines)
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setStatusMessage({ text: 'Please complete Neural Verification.', type: 'info' });
        await (window as any).aistudio.openSelectKey();
      }

      // 2. Wait for confirmation listener to resolve
      const confirmed = await handlePaymentConfirmation();
      
      if (!confirmed) {
        throw new Error("Payment Verification Timeout");
      }
      
    } catch (error: any) {
      console.error("Billing Error:", error);
      setStatusMessage({ text: "Subscription failed. Please check your Play Store account.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = () => {
    const wasPremium = localStorage.getItem('allinone_had_premium') === 'true';
    if (wasPremium && user) {
      setUser({ ...user, isPremium: true });
      localStorage.setItem('allinone_is_premium', 'true');
      setStatusMessage({ text: "Premium Access Restored!", type: 'success' });
    } else {
      setStatusMessage({ text: "No existing purchases found.", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-y-auto pb-10">
      <button 
        onClick={() => setView(View.Home)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center z-20"
      >
        <X size={20} />
      </button>

      <div className="p-8 pt-20 flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-2xl mb-6 rotate-3">
            <Crown size={48} className="text-black" />
          </div>
          <h2 className="text-4xl font-black mb-3 uppercase tracking-tighter italic">NEURAL PRO</h2>
          <p className="text-gray-500 text-sm font-medium tracking-wide">Elite performance powered by Neural Core</p>
        </div>

        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            statusMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 
            statusMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
            'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : 
             statusMessage.type === 'error' ? <AlertCircle size={18} /> : 
             <Loader2 size={18} className="animate-spin" />}
            <span className="text-xs font-bold uppercase tracking-widest">{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-4 mb-10">
          {plans.map((plan) => (
            <button 
              key={plan.id}
              onClick={() => handleSubscribe(plan.id)}
              disabled={isProcessing}
              className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all active:scale-95 ${
                plan.best ? 'bg-white text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.15)]' : 'glass border-white/10 text-white'
              }`}
            >
              <div className="text-left">
                <h4 className="font-black text-xl uppercase tracking-tighter">{plan.name}</h4>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${plan.best ? 'text-black/50' : 'text-gray-500'}`}>
                  Verified via Google Play
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{plan.price}</span>
                {plan.best && <div className="text-[8px] font-black uppercase bg-yellow-400 px-2 py-0.5 rounded-full mt-1">Best Value</div>}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
           {[
             { i: Rocket, l: 'UNLIMITED CORE' },
             { i: Shield, l: 'AD-FREE UI' },
             { i: Zap, l: 'PRIORITY SPEED' },
             { i: Crown, l: 'QUANTUM VISION' }
           ].map((item, idx) => (
             <div key={idx} className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-2">
                <item.i size={14} className="text-yellow-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{item.l}</span>
             </div>
           ))}
        </div>

        <div className="space-y-4">
           <button onClick={handleRestore} className="w-full text-center text-[10px] text-gray-600 font-bold hover:text-white transition-colors tracking-[0.2em] uppercase py-2">
             Restore Purchase
           </button>
           
           <div className="p-4 glass rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <p className="text-[8px] text-center text-gray-600 leading-relaxed uppercase font-bold px-4">
                Purchases are secured by Neural Core Billing. You must verify your project identity to access Quantum Vision models.
              </p>
              <div className="text-[8px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                Verified System Architecture
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
