
import React, { useMemo } from 'react';
import { KnobValues, HeterogeneousMemory } from '../types';
import { Zap, ChevronRight, AlertCircle, Eye } from 'lucide-react';
import { MandalaTree } from './MandalaTree';

interface CourseModuleProps {
  currentDay: number;
  completedDays: number[];
  inputText: string;
  knobValues: KnobValues;
  memory: HeterogeneousMemory;
  onKnobChange: (v: KnobValues) => void;
  onReset: () => void;
  onSelectDay: (day: number) => void;
  onApplyScript: (s: string) => void;
  onGenerateVideo: (text: string) => void;
}

export const CourseModule: React.FC<CourseModuleProps> = ({ 
  currentDay, 
  completedDays, 
  inputText, 
  knobValues,
  memory,
  onKnobChange,
  onReset,
  onSelectDay, 
  onApplyScript, 
  onGenerateVideo 
}) => {

  // [BARDO_COURT_STATE_MACHINE]: Dynamic button styles based on entropy
  const videoButtonState = useMemo(() => {
    const { entropy } = knobValues;
    
    if (entropy > 0.75) {
      return { 
        text: `緊急：啟動迷霧法庭`, 
        subtitle: "認知過載檢測中 - 尋求紅霧出口",
        icon: <AlertCircle size={16} />,
        color: "text-rose-400",
        border: "border-rose-500/50",
        bg: "from-rose-500/20 to-transparent",
        animation: "animate-pulse"
      };
    } else if (entropy < 0.15) {
      return { 
        text: `晉升：啟動賢者視界`, 
        subtitle: "高維清明已達成 - 進入大圓滿實相",
        icon: <Eye size={16} />,
        color: "text-amber-300",
        border: "border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
        bg: "from-amber-400/20 via-amber-400/5 to-transparent",
        animation: ""
      };
    } else {
      return { 
        text: `Day ${currentDay}: 進入中陰身`, 
        subtitle: "啟動多維視角對質系統",
        icon: <Zap size={16} />,
        color: "text-white/80",
        border: "border-white/10",
        bg: "from-white/5 to-transparent",
        animation: ""
      };
    }
  }, [knobValues.entropy, currentDay]);

  return (
    <div className="w-[450px] border-l border-white/5 bg-slate-950/40 backdrop-blur-3xl flex flex-col h-full relative overflow-hidden">
      <div className="p-6 z-20">
        <button 
          onClick={() => onGenerateVideo(inputText)}
          className={`w-full p-5 bg-gradient-to-br ${videoButtonState.bg} border ${videoButtonState.border} rounded-[2rem] flex items-center justify-between transition-all group active:scale-95 ${videoButtonState.animation}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all ${videoButtonState.color}`}>
              {videoButtonState.icon}
            </div>
            <div className="text-left">
              <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${videoButtonState.color}`}>{videoButtonState.text}</p>
              <p className="text-[8px] text-white/30 uppercase tracking-tighter">{videoButtonState.subtitle}</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div className="flex-1 relative z-10 px-4 pb-4 overflow-hidden">
        <MandalaTree 
          currentDay={currentDay}
          completedDays={completedDays}
          knobValues={knobValues}
          memory={memory}
          onKnobChange={onKnobChange}
          onSelectDay={onSelectDay}
          onApplyScript={onApplyScript}
        />
        <div className="absolute top-8 right-8 flex flex-col gap-3">
           <button 
             onClick={onReset}
             className="p-3 rounded-full bg-white/5 border border-white/10 text-white/20 hover:text-white hover:bg-white/10 transition-all hover:rotate-180 duration-[2000ms]"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
           </button>
        </div>
      </div>

      <div className="p-5 bg-black/20 border-t border-white/5 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
           <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase font-bold">Astrolabe.Mandala.v3.1</p>
        </div>
      </div>
    </div>
  );
};
