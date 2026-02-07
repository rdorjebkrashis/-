
import React from 'react';
import { motion } from 'framer-motion';
import { VideoScript } from '../services/videoService';

interface VideoTheaterProps {
  videoUrl: string;
  script: VideoScript;
  onClose: () => void;
  title: string;
  subtitle: string;
}

export const VideoTheater: React.FC<VideoTheaterProps> = ({ videoUrl, script, onClose, title, subtitle }) => {
  // Extracting a focused record text from the script to display in the main glass bubble
  const focusedRecord = script.dialogue.map(d => d.text).join(' ');

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000 overflow-hidden font-sans">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          src={videoUrl} 
          autoPlay 
          loop 
          muted
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Top Header Section */}
      <div className="absolute top-16 inset-x-20 z-20 flex justify-between items-start">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            <h2 className="text-5xl font-black tracking-[0.5em] text-white uppercase drop-shadow-2xl">
              {title}
            </h2>
          </motion.div>
          <div className="flex items-center gap-2 pl-8">
             <span className="text-amber-500 font-black text-[10px] tracking-[0.3em]">JUDGE | JANE</span>
             <span className="text-white/20 text-[10px] tracking-[0.2em] px-2">•</span>
             <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">{subtitle}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group backdrop-blur-xl shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-500">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main Narrative Record Bubble */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 w-full max-w-4xl p-1.5 rounded-[3.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="bg-black/40 rounded-[3.2rem] p-12 md:p-16 border border-white/5">
          <p className="text-lg md:text-xl font-light leading-[2.2] text-white/80 tracking-wide text-justify italic serif-font">
            {focusedRecord.length > 300 ? focusedRecord.substring(0, 300) + '...' : focusedRecord}
          </p>
        </div>
      </motion.div>

      {/* Bottom Status Indicator */}
      <div className="absolute bottom-24 z-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="inline-flex items-center gap-5 px-10 py-4 rounded-full bg-black/80 border border-white/10 backdrop-blur-3xl shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B] animate-pulse" />
          <span className="text-[11px] text-white/70 font-black tracking-[0.4em] uppercase">
            法界拓撲同步中：{script.mood === 'enlightened' ? '本初清淨 / DHARMATA' : '幻象拆解 / MAYA_DISSOLUTION'}
          </span>
        </motion.div>
      </div>

      {/* Corner Metadata Footer */}
      <div className="absolute bottom-12 inset-x-20 z-20 flex justify-between items-center opacity-20 pointer-events-none select-none">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black tracking-[0.8em] text-white uppercase">B A R D O  C O U R T</span>
          <div className="w-12 h-px bg-white/40" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-black tracking-[0.6em] text-white uppercase">V E O  3 . 1</span>
          <span className="text-[7px] font-mono text-white/50">NEURAL_LENS_STABILIZED</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black tracking-[0.8em] text-white uppercase">F I X E D  L A N D S C A P E</span>
          <div className="w-12 h-px bg-white/40" />
        </div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};
