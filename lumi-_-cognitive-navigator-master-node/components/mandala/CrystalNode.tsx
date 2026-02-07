
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemorySnapshot, FractalDay, KnobValues } from '../../types';
import { SKIN_REGISTRY } from '../../constants/skins';

interface CrystalNodeProps {
  data: FractalDay;
  x: number;
  y: number;
  isActive: boolean;
  isFocused: boolean;
  isCompleted: boolean;
  memories: MemorySnapshot[];
  onSelect: () => void;
  onApplyScript: (s: string) => void;
  onKnobChange: (v: KnobValues) => void;
}

export const CrystalNode: React.FC<CrystalNodeProps> = ({ 
  data, x, y, isActive, isFocused, isCompleted, memories, onSelect, onApplyScript, onKnobChange
}) => {
  const skin = SKIN_REGISTRY[data.day];
  const color = isActive ? skin.color : isCompleted ? skin.color + 'CC' : 'rgba(255,255,255,0.2)';
  const geometry = skin.geometry;
  const isCenter = data.day === 7;
  const [vibrate, setVibrate] = useState(false);

  const nodeX = isFocused ? 200 : x;
  const nodeY = isFocused ? 400 : y;
  const scale = isFocused ? 3.0 : isCenter ? 1.8 : 1.3;

  const handleScriptClick = (text: string, type: 'high' | 'low') => {
    setVibrate(true);
    setTimeout(() => setVibrate(false), 200);

    // [MUTATION_REQUEST]: Trigger physical state shifts based on script path
    if (type === 'high') {
      onKnobChange({ entropy: 0.8, blur: 0.6, speed: 0.2 });
    } else {
      onKnobChange({ entropy: 0.1, blur: 0.0, speed: 0.8 });
    }
    
    onApplyScript(text);
  };

  return (
    <g className="crystal-node">
      <AnimatePresence>
        {isFocused && (
          <motion.g 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transform="translate(200, 400)"
          >
            <circle r="150" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="4 16" opacity="0.3" />
            <motion.circle 
              r="180" fill="none" stroke={color} strokeWidth="0.2" opacity="0.1" 
              animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            />
            
            {data.branches.map((b, i) => {
              const angle = (i * (360 / data.branches.length) - 90) * (Math.PI / 180);
              const bx = Math.cos(angle) * 150;
              const by = Math.sin(angle) * 150;
              return (
                <motion.g 
                  key={i} 
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, x: bx, y: by }}
                  className="group/leaf"
                >
                  <circle r="6" fill={color} style={{ filter: 'url(#glow)' }} />
                  <foreignObject x={bx > 0 ? 15 : -145} y="-30" width="130" height="90">
                    <div className={`flex flex-col gap-1.5 p-3 bg-black/80 backdrop-blur-2xl rounded-2xl border border-white/10 ${bx > 0 ? 'items-start text-left' : 'items-end text-right'}`}>
                      <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">{b.term}</span>
                      <p className="text-[7.5px] text-white/50 italic leading-snug group-hover/leaf:text-white/90 transition-colors">
                        {b.def}
                      </p>
                    </div>
                  </foreignObject>
                </motion.g>
              );
            })}
          </motion.g>
        )}
      </AnimatePresence>

      <motion.g 
        layout
        onClick={onSelect}
        className="cursor-pointer"
        transform={`translate(${nodeX}, ${nodeY})`}
        whileHover={{ scale: scale * 1.05 }}
        animate={vibrate ? { x: [nodeX - 2, nodeX + 2, nodeX - 2, nodeX + 2, nodeX] } : {}}
        transition={{ duration: 0.2 }}
      >
        <circle 
          r={30} 
          fill="rgba(10, 15, 30, 0.95)" 
          stroke={color} 
          strokeWidth={isActive ? 3 : 1.5} 
          style={{ filter: isActive ? 'url(#glow)' : 'none' }} 
        />
        
        {/* Sacred Glyphs */}
        <g transform={`scale(${scale * 1.1})`}>
          {geometry === 'Tetrahedron' && (
            <path d="M 0 -14 L 14 12 L -14 12 Z M 0 -14 L 0 12" fill={isActive ? skin.accent : "none"} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
          )}
          {geometry === 'Cube' && (
            <path d="M -11 -11 H 11 V 11 H -11 Z M -11 -11 L 11 11 M 11 -11 L -11 11" fill={isActive ? skin.accent : "none"} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
          )}
          {geometry === 'Octahedron' && (
            <path d="M 0 -16 L 12 0 L 0 16 L -12 0 Z M -12 0 H 12" fill={isActive ? skin.accent : "none"} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
          )}
          {geometry === 'Sphere' && (
            <g>
              <circle r={14} fill={isActive ? skin.accent : "none"} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
              <path d="M -14 0 H 14 M 0 -14 V 14" stroke={color} strokeWidth="0.8" opacity="0.5" />
            </g>
          )}
        </g>

        {isCenter && (
          <motion.circle 
            r={45} 
            stroke={color} 
            strokeWidth={1} 
            fill="none" 
            strokeDasharray="8 8" 
            animate={{ rotate: 360, opacity: [0.2, 0.8, 0.2] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
          />
        )}

        {!isFocused && (
          <text y={60} textAnchor="middle" className="text-[10px] font-black fill-white tracking-[0.4em] uppercase drop-shadow-md">
            {data.title}
          </text>
        )}
      </motion.g>

      <AnimatePresence>
        {isFocused && (
          <motion.foreignObject 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            x={20} y={620} width="360" height="420"
          >
            <div className="flex flex-col gap-4 p-6 bg-black/95 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-[0_0_150px_rgba(0,0,0,1)] max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="text-center space-y-2 mb-2">
                <p className="text-[14px] font-black uppercase tracking-[1em] text-white">{data.title}</p>
                <div className="w-12 h-0.5 bg-[var(--mind-color)] mx-auto opacity-50" />
                <p className="text-[9px] text-white/40 uppercase tracking-[0.4em] leading-relaxed">{data.goal}</p>
              </div>
              
              {/* High Entropy Group (Red Fog) */}
              <div className="space-y-3">
                <span className="block text-[7px] text-rose-500/60 uppercase tracking-[0.3em] font-black border-l-2 border-rose-500 pl-2">鏡像觀察 (高熵引導)</span>
                {data.scripts.highEntropy.map((scriptText, idx) => (
                  <button 
                    key={`high-${idx}`} 
                    onClick={(e) => { e.stopPropagation(); handleScriptClick(scriptText, 'high'); }} 
                    className="w-full text-left p-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-[10px] text-white transition-all border border-rose-500/10 group active:scale-95"
                  >
                    <span className="leading-relaxed font-light opacity-80 group-hover:opacity-100">{scriptText}</span>
                  </button>
                ))}
              </div>

              {/* Low Entropy Group (Clear Light) */}
              <div className="space-y-3 mt-2">
                <span className="block text-[7px] text-sky-400/60 uppercase tracking-[0.3em] font-black border-l-2 border-sky-400 pl-2">精確命名 (低熵引導)</span>
                {data.scripts.lowEntropy.map((scriptText, idx) => (
                  <button 
                    key={`low-${idx}`} 
                    onClick={(e) => { e.stopPropagation(); handleScriptClick(scriptText, 'low'); }} 
                    className="w-full text-left p-4 rounded-2xl bg-sky-500/5 hover:bg-sky-500/10 text-[10px] text-white transition-all border border-sky-500/10 group active:scale-95"
                  >
                    <span className="leading-relaxed font-light opacity-80 group-hover:opacity-100">{scriptText}</span>
                  </button>
                ))}
              </div>

              {/* Action Anchor Info */}
              <div className="pt-4 border-t border-white/5 space-y-2 mt-2">
                <span className="block text-[7px] text-white/20 uppercase tracking-[0.3em] font-black">默認行動錨點</span>
                <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-0.5">{data.default_anchor.mantra}</p>
                    <p className="text-[8px] text-white/40 italic">{data.default_anchor.instruction}</p>
                  </div>
                  <div className="text-[6px] text-white/20 border border-white/10 px-2 py-1 rounded-full uppercase">{data.mandala_layer}</div>
                </div>
              </div>
            </div>
          </motion.foreignObject>
        )}
      </AnimatePresence>
    </g>
  );
};
