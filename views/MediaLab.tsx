
import React, { useState, useRef } from 'react';
import { generateImage, generateVideo, downloadAsset, processImage } from '../geminiService';
import { useApp } from '../App';
import { View } from '../types';
import { 
  Sparkles, 
  Image as ImageIcon, 
  UserCircle, 
  Video, 
  Wand2, 
  Cpu,
  Loader2,
  Download,
  ArrowLeft,
  Upload,
  X,
  Plus
} from 'lucide-react';

const MediaLab: React.FC = () => {
  const { addHistory } = useApp();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{preview: string, data: string, type: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: 't2i', name: 'Text to Image', icon: ImageIcon, color: 'text-blue-400', desc: 'Generate 4K visuals from text or image' },
    { id: 'bg-remove', name: 'Background Remover', icon: Wand2, color: 'text-purple-400', desc: 'One-click subject isolation' },
    { id: 'enhance', name: 'Photo Enhancer', icon: Sparkles, color: 'text-yellow-400', desc: 'Upscale & fix blurry photos' },
    { id: 'avatar', name: 'Avatar Maker', icon: UserCircle, color: 'text-pink-400', desc: 'Transform photos into 3D characters' },
    { id: 'logo', name: 'Logo Generator', icon: Cpu, color: 'text-green-400', desc: 'Professional brand identity' },
    { id: 'video', name: 'AI Video Maker', icon: Video, color: 'text-red-400', desc: 'Short clips from text or starting image' },
  ];

  const isImageTool = activeTool === 'bg-remove' || activeTool === 'enhance' || activeTool === 'avatar' || activeTool === 't2i' || activeTool === 'video';
  const showPromptWithImage = activeTool === 'avatar' || activeTool === 'enhance' || activeTool === 't2i' || activeTool === 'video';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const resultStr = ev.target?.result as string;
        setUploadedImage({
          preview: resultStr,
          data: resultStr.split(',')[1],
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const isMandatoryImage = activeTool === 'bg-remove' || activeTool === 'enhance' || activeTool === 'avatar';
    
    if (!prompt.trim() && !uploadedImage) {
      alert("Please provide a prompt or upload an image.");
      return;
    }

    if (isMandatoryImage && !uploadedImage) {
      alert("This tool requires an uploaded image to function.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const tool = tools.find(t => t.id === activeTool);

    try {
      let data: string | null = null;
      
      if (uploadedImage) {
        if (activeTool === 'bg-remove') {
          data = await processImage("Remove the background from this image. Return only the isolated subject with a transparent-style background.", uploadedImage.data, uploadedImage.type);
        } else if (activeTool === 'enhance') {
          data = await processImage(`Enhance this image. Improve clarity, details, and lighting. ${prompt ? `Follow these instructions: ${prompt}` : ''}`, uploadedImage.data, uploadedImage.type);
        } else if (activeTool === 'avatar') {
          data = await processImage(`Transform the person in this image into a stylized 3D avatar. Use a high-quality 3D render style (Pixar-like). Maintain recognizable facial features. ${prompt ? `Theme: ${prompt}` : ''}`, uploadedImage.data, uploadedImage.type);
        } else if (activeTool === 't2i') {
          data = await processImage(`Generate a new image based on this reference image. ${prompt ? `Instructions: ${prompt}` : 'Maintain the style and subject but enhance it.'}`, uploadedImage.data, uploadedImage.type);
        } else if (activeTool === 'video') {
          data = await generateVideo(prompt || "Animate this image", uploadedImage.data, uploadedImage.type);
        }
      } 
      else {
        if (activeTool === 't2i' || activeTool === 'avatar' || activeTool === 'logo') {
          data = await generateImage(prompt);
        } else if (activeTool === 'video') {
          data = await generateVideo(prompt);
        }
      }
      
      setResult(data);

      if (data) {
        addHistory({
          id: Date.now().toString(),
          title: tool?.name || 'Media Generation',
          view: View.MediaLab,
          timestamp: Date.now(),
          preview: uploadedImage ? `Processed image with ${tool?.name}` : (prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt),
          messages: [
            { id: '1', role: 'user', content: prompt, timestamp: Date.now(), type: 'text' },
            { id: '2', role: 'model', content: 'Generated media asset.', timestamp: Date.now(), type: activeTool === 'video' ? 'file' : 'image', mediaUrl: data || undefined }
          ]
        });
      }
    } catch (err) {
      console.error(err);
      alert("Neural engine error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setIsDownloading(true);
    const extension = activeTool === 'video' ? 'mp4' : 'png';
    const filename = `ALLINONE_${activeTool}_${Date.now()}.${extension}`;
    await downloadAsset(result, filename);
    setIsDownloading(false);
  };

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool);
    return (
      <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <button onClick={() => {setActiveTool(null); setResult(null); setUploadedImage(null); setPrompt('');}} className="text-[#00f2ff] text-sm mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Back to Media Lab
        </button>
        
        <div className="flex items-center gap-3 mb-8 stagger-1">
           <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${tool?.color} shadow-lg shadow-white/5`}>
             {tool && <tool.icon size={24} />}
           </div>
           <div>
             <h2 className="text-xl font-black uppercase italic tracking-tighter">{tool?.name}</h2>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tool?.desc}</p>
           </div>
        </div>

        <div className="space-y-6">
          {isImageTool && (
            <div className="space-y-4 stagger-2">
              <div 
                onClick={() => !uploadedImage && fileInputRef.current?.click()}
                className={`relative h-48 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden ${
                  uploadedImage ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-[#00f2ff]/30 bg-white/5'
                }`}
              >
                {uploadedImage ? (
                  <>
                    <img src={uploadedImage.preview} alt="Upload Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
                    <img src={uploadedImage.preview} alt="Upload Preview" className="relative z-10 h-32 w-auto rounded-2xl shadow-2xl border border-white/10" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                      className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white hover:text-red-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-white/5 rounded-2xl text-gray-500 group-hover:text-[#00f2ff] transition-colors">
                      <Upload size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Drop Source Photo</span>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>
          )}

          {(!isImageTool || showPromptWithImage) && (
            <div className="glass p-5 rounded-[32px] border border-white/10 stagger-3">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white resize-none h-24 placeholder:text-zinc-800 font-black uppercase tracking-widest"
                placeholder={isImageTool 
                  ? `(Optional) Neural Directives...`
                  : `Inject visual prompt here...`
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          )}

          <button 
            disabled={isLoading || (!prompt.trim() && !uploadedImage)}
            onClick={handleGenerate}
            className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-3xl shadow-[0_0_40px_rgba(0,242,255,0.2)] hover:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-3 stagger-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span className="uppercase tracking-[0.2em] text-xs">{isLoading ? 'Synthesizing...' : 'Initialize Forge'}</span>
          </button>

          {result && (
            <div className="mt-8 space-y-4 animate-in zoom-in duration-500">
               <div className="relative group overflow-hidden rounded-[40px] border border-white/10 shadow-2xl aspect-square bg-zinc-900">
                  {activeTool === 'video' ? (
                    <video src={result} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  ) : (
                    <img src={result} alt="Generated" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                    <button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-white text-black p-5 rounded-full hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center"
                    >
                      {isDownloading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                    </button>
                  </div>
               </div>
               <div className="flex justify-center">
                 <button 
                  onClick={() => setResult(null)}
                  className="text-gray-600 text-[9px] hover:text-white uppercase font-black tracking-[0.3em] transition-colors"
                 >
                   Discard Core Asset
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="stagger-1">
        <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">Media <span className="neon-blue">Lab</span></h2>
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Visual Core Synthesis</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          const staggerClass = `stagger-${idx + 2}`;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`group flex items-center gap-5 p-6 glass border border-white/5 rounded-[32px] hover:border-[#00f2ff]/30 transition-all text-left relative overflow-hidden active:scale-95 ${staggerClass}`}
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 blur-xl group-hover:bg-[#00f2ff]/5 transition-colors" />
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${tool.color}`}>
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-sm text-gray-100 uppercase italic tracking-tight">{tool.name}</h3>
                <p className="text-[9px] text-gray-600 mt-1 font-black uppercase tracking-widest leading-relaxed">{tool.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#00f2ff]/10 group-hover:border-[#00f2ff]/30 transition-all">
                <Plus size={16} className="text-zinc-800 group-hover:text-[#00f2ff]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MediaLab;
