
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, KnobValues, CrystalShape } from '../types';

interface VajraCoreProps {
  state: AppState;
  activeSnapshot: any | null;
  knobValues?: KnobValues;
  currentDay?: number;
  isCollapsing?: boolean;
}

export const VajraCore: React.FC<VajraCoreProps> = ({ state, knobValues, activeSnapshot, currentDay = 1, isCollapsing = false }) => {
  const isProcessing = state === AppState.PROCESSING;
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const speedValue = knobValues?.speed || 0.5;
      const baseIncrement = isProcessing ? 0.08 : 0.03;
      setPulse(p => (p + (baseIncrement * (0.5 + speedValue * 2))) % (Math.PI * 2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isProcessing, knobValues]);

  const scale = 1 + Math.sin(pulse) * (isProcessing ? 0.15 : 0.04);
  const isRainbowFracture = currentDay === 7 || (knobValues && knobValues.entropy < 0.05 && knobValues.speed > 0.9);
  
  const shape: CrystalShape = activeSnapshot?.growth_shape || 
    (currentDay <= 2 ? 'Tetrahedron' : currentDay <= 4 ? 'Cube' : currentDay <= 6 ? 'Octahedron' : 'Sphere');

  return (
    <motion.div 
      className="relative w-80 h-80 flex items-center justify-center"
      animate={isCollapsing ? { 
        x: [0, -10, 10, -5, 5, 0],
        skewX: [0, 20, -20, 10, -10, 0],
        filter: ['blur(0px)', 'blur(20px)', 'blur(2px)', 'blur(10px)', 'blur(0px)']
      } : {}}
      transition={{ duration: 0.5, repeat: isCollapsing ? Infinity : 0 }}
    >
      {/* Divine Glow Layer */}
      <div 
        className="absolute inset-0 rounded-full blur-[160px] opacity-25 transition-all duration-[3000ms]"
        style={{ 
          backgroundColor: isRainbowFracture ? '#D8B4FE' : 'var(--mind-color)', 
          transform: `scale(${scale * 2.8})`
        }}
      />

      {/* Crystalline SVG Matrix */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(var(--mind-rgb),0.3)]">
          <AnimatePresence mode="wait">
            <motion.g 
              key={shape}
              initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
              animate={{ 
                scale: isCollapsing ? 2.5 : 1, 
                opacity: isCollapsing ? 0.2 : 1, 
                rotate: isCollapsing ? 360 : 0 
              }}
              exit={{ scale: 1.8, opacity: 0, rotate: 90 }}
              transition={{ duration: isCollapsing ? 0.2 : 1.8, ease: [0.16, 1, 0.3, 1] }}
              transform="translate(100, 100)"
            >
              {/* Radial Geometry Guiding Lines */}
              <circle r="90" fill="none" stroke="white" strokeWidth="0.1" opacity="0.05" />
              <path d="M -100 0 L 100 0 M 0 -100 L 0 100" stroke="white" strokeWidth="0.1" opacity="0.05" />

              <motion.g 
                animate={{ rotate: pulse * (isCollapsing ? 500 : 50) }} 
                style={{ scale: scale * 0.95 }}
              >
                {shape === 'Tetrahedron' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="2">
                    <path d="M0,-65 L56,32 L-56,32 Z" strokeLinejoin="round" />
                    <path d="M0,-65 L0,32" opacity="0.6" strokeDasharray="2 4" />
                    <path d="M-56,32 L0,-10 L56,32" opacity="0.4" />
                  </g>
                )}
                {shape === 'Cube' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="2">
                    <rect x="-42" y="-42" width="84" height="84" />
                    <rect x="-28" y="-28" width="84" height="84" opacity="0.3" strokeDasharray="4 2" />
                    <line x1="-42" y1="-42" x2="-28" y2="-28" />
                    <line x1="42" y1="-42" x2="56" y2="-28" />
                    <line x1="-42" y1="42" x2="-28" y2="56" />
                    <line x1="42" y1="42" x2="56" y2="56" />
                  </g>
                )}
                {shape === 'Octahedron' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="2">
                    <path d="M0,-75 L55,0 L0,75 L-55,0 Z" />
                    <path d="M-55,0 L0,-18 L55,0 L0,18 Z" opacity="0.6" />
                    <line x1="0" y1="-75" x2="0" y2="75" strokeWidth="0.5" opacity="0.4" />
                  </g>
                )}
                {shape === 'Sphere' && (
                  <g>
                    <motion.circle 
                      r="68" 
                      stroke="white" 
                      fill="none" 
                      strokeWidth="1.5"
                      animate={{ strokeWidth: [1, 4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <circle r="48" stroke="white" fill="none" strokeWidth="0.8" opacity="0.5" />
                    <circle r="28" stroke="white" fill="none" strokeWidth="0.8" opacity="0.3" />
                    <motion.g animate={{ rotate: -pulse * 100 }}>
                      <path d="M -75 0 L 75 0 M 0 -75 V 75" stroke="white" strokeWidth="0.2" opacity="0.2" />
                    </motion.g>
                  </g>
                )}
              </motion.g>
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Central Singularity Node */}
      <motion.div 
        className={`relative w-48 h-48 transition-all duration-[2000ms] flex items-center justify-center rounded-[4rem] border border-white/10`}
        animate={isCollapsing ? { scale: [1, 0.5, 2, 0] } : {}}
        style={{ 
          transform: `scale(${scale})`,
          background: isRainbowFracture
            ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(var(--mind-rgb), 0.15) 0%, rgba(0,0,0,0.5) 100%)',
          boxShadow: isRainbowFracture 
            ? `0 0 120px rgba(255, 255, 255, 0.4), inset 0 0 30px rgba(255,255,255,0.2)` 
            : `0 0 100px rgba(var(--mind-rgb), 0.15), inset 0 0 20px rgba(var(--mind-rgb), 0.05)`
        }}
      >
        <div className={`w-16 h-16 rounded-full border border-white/20 flex items-center justify-center ${isRainbowFracture ? 'animate-pulse' : ''}`}>
             <motion.div 
               className="w-5 h-5 rounded-full transition-all duration-1000" 
               style={{ 
                 backgroundColor: 'var(--mind-color)',
                 boxShadow: isRainbowFracture ? '0 0 30px 10px white' : '0 0 15px rgba(var(--mind-rgb), 0.5)'
               }}
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
        </div>
      </motion.div>

      <div className="absolute -bottom-20 flex flex-col items-center gap-3">
        <span className="text-[12px] font-black uppercase tracking-[1em] text-white/40 drop-shadow-md" style={{ color: 'var(--mind-color)' }}>
           {shape} PHASE
        </span>
        <div className="flex gap-2">
          {[1,2,3,4,5,6,7].map(i => (
            <motion.div 
              key={i} 
              initial={false}
              animate={{ 
                scale: i === currentDay ? 1.5 : 1,
                opacity: i <= currentDay ? 1 : 0.2,
                backgroundColor: i <= currentDay ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.2)'
              }}
              className={`w-1.5 h-1.5 rounded-full ${i === currentDay ? 'shadow-[0_0_12px_#fff]' : ''}`} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
