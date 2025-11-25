import React, { useState } from 'react';
import { Download, Eraser, Camera, ArrowRight, Sparkles, Home } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { ComparisonSlider } from './ComparisonSlider';
import { NailDesignState, DEFAULT_DESIGN, PresetDesign, NailShape, NailLength, NailFinish } from './types';
import { generateNailArt } from './geminiService';

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop";

const PRESETS: PresetDesign[] = [
  {
    id: '1',
    name: 'Classic French',
    description: 'Timeless pink and white french tips',
    thumbnail: '',
    config: {
      color: '#fce4ec',
      finish: NailFinish.Glossy,
      patternPrompt: 'Classic white french tips, very neat and clean'
    }
  },
  {
    id: '2',
    name: 'Midnight Galaxy',
    description: 'Deep blue with stars',
    thumbnail: '',
    config: {
      color: '#1a237e',
      finish: NailFinish.Glitter,
      patternPrompt: 'Galaxy theme, deep blue and purple nebula, tiny white stars, cosmic dust'
    }
  },
  {
    id: '3',
    name: 'Ruby Red Stiletto',
    description: 'Fierce red look',
    thumbnail: '',
    config: {
      shape: NailShape.Stiletto,
      length: NailLength.Long,
      color: '#d50000',
      finish: NailFinish.Glossy,
      patternPrompt: 'Deep blood red solid color, vampire chic'
    }
  },
  {
    id: '4',
    name: 'Marble Elegance',
    description: 'White marble with gold veins',
    thumbnail: '',
    config: {
      color: '#ffffff',
      finish: NailFinish.Matte,
      patternPrompt: 'White carrara marble texture with delicate gold veins'
    }
  }
];

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [design, setDesign] = useState<NailDesignState>(DEFAULT_DESIGN);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImage(null); // Reset generated on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateNailArt(originalImage, design);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate nail art. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `purelycomfy-nails-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const loadSample = () => {
    fetch(SAMPLE_IMAGE)
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOriginalImage(reader.result as string);
          setGeneratedImage(null);
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    // Responsive Layout: Column on mobile/iframe, Row on large screens
    <div className="flex flex-col lg:flex-row h-screen bg-[#0f172a] text-slate-100 overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Left Sidebar - Controls */}
      {/* Order 2 on mobile so controls appear BELOW the image */}
      <aside className="order-2 lg:order-1 w-full lg:w-[400px] h-[50vh] lg:h-full flex-shrink-0 border-t lg:border-t-0 lg:border-r border-slate-800 bg-[#111827] flex flex-col z-20 shadow-2xl">
        <div className="p-4 lg:p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="font-serif text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-indigo-200 truncate">
            Nail Art Generator
          </h1>
        </div>
        
        <div className="flex-1 overflow-hidden">
           <ControlPanel 
             design={design} 
             setDesign={setDesign} 
             onGenerate={handleGenerate}
             isGenerating={isGenerating}
             presets={PRESETS}
             onApplyPreset={(p) => setDesign(prev => ({ ...prev, ...p.config }))}
           />
        </div>
      </aside>

      {/* Main Content Area */}
      {/* Order 1 on mobile so Image appears FIRST */}
      <main className="order-1 lg:order-2 flex-1 relative flex flex-col h-[50vh] lg:h-full">
        
        {/* Top Bar */}
        <header className="h-14 lg:h-16 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0">
           <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-slate-400 overflow-x-auto no-scrollbar">
             {/* Back to Home Integration */}
             <a 
               href="https://purelycomfy.com" 
               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-2 lg:mr-4 border-r border-slate-700 pr-2 lg:pr-4 group shrink-0"
               target="_parent" // Opens in the parent window if iframe
             >
               <Home size={16} className="group-hover:text-indigo-400 transition-colors"/>
               <span className="hidden sm:inline font-medium">Home</span>
             </a>

             <span className={`flex items-center gap-2 shrink-0 ${originalImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">1</span>
               <span className="hidden sm:inline">Upload</span>
             </span>
             <ArrowRight size={14} className="hidden sm:block" />
             <span className={`flex items-center gap-2 shrink-0 ${originalImage && !generatedImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">2</span>
               <span className="hidden sm:inline">Design</span>
             </span>
             <ArrowRight size={14} className="hidden sm:block" />
             <span className={`flex items-center gap-2 shrink-0 ${generatedImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">3</span>
               <span className="hidden sm:inline">Result</span>
             </span>
           </div>

           <div className="flex gap-2 lg:gap-3 shrink-0">
              <button 
                onClick={() => { setOriginalImage(null); setGeneratedImage(null); }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear All"
              >
                <Eraser size={18} />
              </button>
              {generatedImage && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs lg:text-sm font-medium border border-slate-700 transition-all"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
           </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] opacity-90"></div>

          {/* Main Visualization Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            
            {!originalImage ? (
              // Empty State / Upload
              <div className="w-full max-w-sm lg:max-w-md mx-auto">
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 lg:p-10 text-center bg-slate-900/50 transition-all group">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                    <Camera size={28} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-medium text-white mb-2">Upload photo</h3>
                  <p className="text-slate-400 mb-6 text-sm">Clear hand photo on neutral background.</p>
                  
                  <div className="space-y-3">
                    <label className="block w-full">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="block w-full py-2.5 lg:py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-lg shadow-indigo-600/20 text-sm lg:text-base">
                        Select Photo
                      </span>
                    </label>
                    <button onClick={loadSample} className="block w-full py-2.5 lg:py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors text-sm lg:text-base">
                      Try Sample Photo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Image Viewer
              <div className="relative w-full h-full flex flex-col">
                {error && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-sm font-medium animate-bounce w-max max-w-full text-center">
                    {error}
                  </div>
                )}

                <div className="flex-1 relative rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/40 backdrop-blur-sm">
                  {isGenerating && (
                     <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                       <div className="relative">
                         <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                           <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                         </div>
                       </div>
                       <p className="mt-4 text-indigo-200 font-medium animate-pulse text-sm lg:text-base">Designing...</p>
                     </div>
                  )}
                  
                  {generatedImage ? (
                    <ComparisonSlider beforeImage={originalImage} afterImage={generatedImage} />
                  ) : (
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-full object-contain" 
                    />
                  )}
                </div>
                
                {/* Helper text */}
                <div className="mt-2 lg:mt-4 text-center text-slate-500 text-[10px] lg:text-xs">
                   {generatedImage ? "Drag slider to compare" : "Configure design & Generate"}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
