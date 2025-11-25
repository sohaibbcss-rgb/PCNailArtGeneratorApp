import React from 'react';
import { NailDesignState, NailShape, NailLength, NailFinish, PresetDesign } from '../types';
import { Wand2, Sparkles, Palette, Ruler, Shapes, Type } from 'lucide-react';

interface ControlPanelProps {
  design: NailDesignState;
  setDesign: React.Dispatch<React.SetStateAction<NailDesignState>>;
  onGenerate: () => void;
  isGenerating: boolean;
  presets: PresetDesign[];
  onApplyPreset: (preset: PresetDesign) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  design,
  setDesign,
  onGenerate,
  isGenerating,
  presets,
  onApplyPreset
}) => {

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesign(prev => ({ ...prev, color: e.target.value }));
  };

  const handleInputChange = (field: keyof NailDesignState, value: string) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white mb-1">Design Studio</h2>
        <p className="text-slate-400 text-sm">Customize your perfect manicure.</p>
      </div>

      {/* Shape & Length */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-300 font-medium mb-2">
          <Shapes size={18} />
          <h3>Structure</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Shape</label>
            <select 
              value={design.shape}
              onChange={(e) => handleInputChange('shape', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              {Object.values(NailShape).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Length</label>
            <select 
              value={design.length}
              onChange={(e) => handleInputChange('length', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              {Object.values(NailLength).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Style & Color */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-pink-300 font-medium mb-2">
          <Palette size={18} />
          <h3>Style & Color</h3>
        </div>

        <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Finish</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(NailFinish).map((finish) => (
                <button
                  key={finish}
                  onClick={() => handleInputChange('finish', finish)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    design.finish === finish 
                      ? 'bg-pink-500/20 border-pink-500 text-pink-200' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
           <input 
              type="color" 
              value={design.color}
              onChange={handleColorChange}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">Base Color</span>
              <span className="text-xs text-slate-400 font-mono">{design.color}</span>
            </div>
        </div>
      </div>

      {/* AI Generative Prompt */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-medium mb-2">
          <Sparkles size={18} />
          <h3>AI Custom Design</h3>
        </div>
        
        <div className="relative">
          <textarea
            value={design.patternPrompt}
            onChange={(e) => handleInputChange('patternPrompt', e.target.value)}
            placeholder="Describe a design (e.g., 'Cherry blossom floral pattern with gold flakes' or 'Black and white geometric french tips')"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px] resize-none placeholder:text-slate-600"
          />
          <div className="absolute bottom-2 right-2">
            <Sparkles size={14} className="text-amber-500/50" />
          </div>
        </div>

        <div className="space-y-2">
           <label className="block text-xs text-slate-400 uppercase tracking-wider">Trending Presets</label>
           <div className="grid grid-cols-2 gap-2">
             {presets.map(p => (
               <button
                key={p.id}
                onClick={() => onApplyPreset(p)}
                className="text-left p-2 rounded hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors flex items-center gap-2"
               >
                 <span className="w-2 h-8 rounded-full bg-gradient-to-b from-white/20 to-white/5" style={{background: `linear-gradient(to bottom, ${p.config.color}, transparent)`}}></span>
                 <span className="text-xs text-slate-300 truncate">{p.name}</span>
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-6 sticky bottom-0 bg-[#0f172a] pb-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
            isGenerating 
              ? 'bg-slate-700 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Nail Art</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};