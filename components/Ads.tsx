
import React from 'react';
import { X } from 'lucide-react';

const Ads: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="mx-4 mb-2 relative">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 bg-black/80 border border-white/10 rounded-full p-1 z-10"
      >
        <X size={12} />
      </button>
      <div className="w-full h-12 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center group cursor-pointer hover:border-[#00f2ff]/30 transition-all">
        <span className="text-zinc-500 text-[10px] absolute left-2 top-1 font-bold">AD</span>
        <p className="text-sm font-medium text-zinc-400 group-hover:text-white">Upgrade to Premium to remove all ads</p>
      </div>
    </div>
  );
};

export default Ads;
