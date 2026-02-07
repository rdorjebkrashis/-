
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnobValues, HeterogeneousMemory } from '../types';
import { COURSE_DATA } from '../constants/courseData';
import { SKIN_REGISTRY } from '../constants/skins';
import { getHexPosition, getMetatronsCubePath, getResonancePath } from '../utils/sacredGeometry';
import { ConnectionBeams } from './mandala/ConnectionBeams';
import { EnergyPedestal } from './mandala/EnergyPedestal';
import { CrystalNode } from './mandala/CrystalNode';

interface MandalaTreeProps {
  currentDay: number;
  completedDays: number[];
  knobValues: KnobValues;
  memory: HeterogeneousMemory;
  onKnobChange: (v: KnobValues) => void;
  onSelectDay: (day: number) => void;
  onApplyScript: (s: string) => void;
}

export const MandalaTree: React.FC<MandalaTreeProps> = ({
  currentDay,
  completedDays,
  knobValues,
  memory,
  onKnobChange,
  onSelectDay,
  onApplyScript
}) => {
  const [focusedNode, setFocusedNode] = useState<number | null>(null);
  const [astrolabeRotation, setAstrolabeRotation] = useState(0);
  const currentSkin = SKIN_REGISTRY[currentDay];
  const center = { x: 200, y: 450 };
  const orbitRadius = 160;

  const handleSelect = (day: number) => {
    if (focusedNode === day) {
      setFocusedNode(null);
    } else {
      const targetIndex = day === 7 ? 6 : day - 1;
      if (day !== 7) {
        const targetRotation = -(targetIndex * 60);
        setAstrolabeRotation(targetRotation);
      }
      setFocusedNode(day);
      onSelectDay(day);
    }
  };

  const handleDrag = (_: any, info: any) => {
    if (focusedNode !== null) return;
    const delta = info.delta.x * (0.8 + knobValues.speed);
    setAstrolabeRotation(prev => prev + delta);
  };

  // [ENTROPY_BREATHING]: Visual properties driven by physical knobs
  const breathingScale = 1 + Math.sin(Date.now() * 0.001 * (knobValues.speed + 0.1)) * (0.005 + (1 - knobValues.entropy) * 0.005);
  const glowIntensity = 1 - knobValues.entropy;
  const isHighEntropy = knobValues.entropy > 0.7;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950/85 rounded-[3.5rem] border border-white/10 group shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]">
      {/* Background resonance pattern with Red Fog logic */}
      <motion.div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        animate={{ 
          scale: [1, 1.1, 1], 
          opacity: isHighEntropy ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ 
          backgroundImage: `radial-gradient(${isHighEntropy ? '#ef4444' : currentSkin.color} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px',
          filter: isHighEntropy ? 'url(#turbulence)' : 'none'
        }} 
      />

      <AnimatePresence>
        {focusedNode !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-black/95 backdrop-blur-3xl cursor-zoom-out" 
            onClick={() => setFocusedNode(null)} 
          />
        )}
      </AnimatePresence>

      <motion.svg 
        drag="x"
        onDrag={handleDrag}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        viewBox="0 0 400 1100" 
        className="w-full h-full transition-transform duration-1000 ease-out cursor-grab active:cursor-grabbing" 
        style={{ scale: breathingScale }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3 + knobValues.blur * 5} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* [RED_FOG_FILTER]: Turbulence applied during high entropy */}
          <filter id="turbulence">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={isHighEntropy ? 20 : 0} />
          </filter>
        </defs>

        {/* 1. Enhanced Metatron Logic Foundation */}
        <motion.g
          animate={{ rotate: astrolabeRotation * (0.1 + knobValues.speed * 0.2) }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          {/* Pulsing Inter照 (Mutual Reflection) Lines */}
          <motion.path 
            d={getMetatronsCubePath(center, 215)}
            fill="none"
            stroke={currentSkin.color}
            strokeWidth="0.8"
            opacity={0.15 * glowIntensity + 0.05}
          />
          
          <motion.path 
            d={getMetatronsCubePath(center, 215)}
            fill="none"
            stroke={currentSkin.color}
            strokeWidth="1.5"
            opacity={0.25 * glowIntensity}
            strokeDasharray="4 20"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 15 / (knobValues.speed + 0.1), repeat: Infinity, ease: "linear" }}
            style={{ filter: 'url(#glow)' }}
          />

          {/* Resonance Halos */}
          <path 
            d={getResonancePath(center, 215, 4)}
            fill="none"
            stroke={currentSkin.color}
            strokeWidth="0.2"
            opacity="0.05"
          />
        </motion.g>

        {/* 2. Connection Beams (Energy Flow) */}
        <motion.g 
          animate={{ rotate: astrolabeRotation }}
          transition={{ type: "spring", damping: 25 + knobValues.entropy * 10, stiffness: 60 - knobValues.entropy * 20 }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <AnimatePresence>
            {focusedNode === null && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConnectionBeams 
                  radius={orbitRadius} 
                  color={currentSkin.color} 
                  completedDays={completedDays} 
                />
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>

        {/* 3. Crystal Nodes (The 6+1 Sages) */}
        <motion.g
          animate={{ rotate: astrolabeRotation }}
          transition={{ type: "spring", damping: 25, stiffness: 60 }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          {COURSE_DATA.map((day, i) => {
            const pos = getHexPosition(i, orbitRadius, center);
            const isFocused = focusedNode === day.day;
            const isHidden = focusedNode !== null && !isFocused;

            return (
              <motion.g 
                key={day.day}
                animate={{ 
                  opacity: isHidden ? 0.05 : 1, 
                  filter: isHidden ? 'grayscale(1) blur(8px)' : 'grayscale(0) blur(0px)',
                  rotate: -astrolabeRotation
                }}
                transition={{ type: "spring", damping: 30 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <CrystalNode 
                  data={day}
                  x={pos.x}
                  y={pos.y}
                  isActive={currentDay === day.day}
                  isFocused={isFocused}
                  isCompleted={completedDays.includes(day.day)}
                  memories={memory.immediate.filter(m => m.course_day === day.day)}
                  onSelect={() => handleSelect(day.day)}
                  onApplyScript={onApplyScript}
                  onKnobChange={onKnobChange}
                />
              </motion.g>
            );
          })}
        </motion.g>

        {/* 4. Energy Pedestal */}
        <EnergyPedestal 
          values={knobValues} 
          color={currentSkin.color} 
          onChange={onKnobChange} 
        />
      </motion.svg>
      
      {/* HUD Info */}
      <div className="absolute top-10 left-10 pointer-events-none select-none z-20">
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            animate={{ 
              scale: isHighEntropy ? [1, 1.5, 1] : [1, 1.3, 1], 
              opacity: isHighEntropy ? [0.5, 1, 0.5] : [0.3, 0.8, 0.3] 
            }}
            transition={{ duration: isHighEntropy ? 1 : 3, repeat: Infinity }}
            className="w-3 h-3 rounded-full" 
            style={{ 
              backgroundColor: isHighEntropy ? '#ef4444' : currentSkin.color, 
              boxShadow: `0 0 20px ${isHighEntropy ? '#ef4444' : currentSkin.color}` 
            }}
          />
          <div className="flex flex-col">
            <p className="text-[14px] font-black uppercase tracking-[0.6em] text-white">
              {focusedNode ? `BARDO_SLICE_${focusedNode}` : isHighEntropy ? 'ENTROPY_ALERT' : 'METATRON_STABILIZED'}
            </p>
            <p className="text-[7px] font-mono text-white/30 tracking-[0.2em]">PROTOCOL_V171.0.2_HEPTAD</p>
          </div>
        </div>
      </div>
    </div>
  );
};
