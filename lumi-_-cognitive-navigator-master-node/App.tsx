
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiKeySelector } from './components/ApiKeySelector';
import { VajraCore } from './components/VajraCore';
import { CourseModule } from './components/CourseModule';
import { VideoTheater } from './components/VideoTheater';
import { TopologyBackground } from './components/TopologyBackground';
import { generateAudio, generateLumiResponse, processImageDialogue } from './services/geminiService';
import { prepareVideoScript, generateCinematicVideo, generateMultiSpeakerAudio, VideoScript } from './services/videoService';
import { AppState, AuditEntry, AlchemicalContext, MemorySnapshot } from './types';
import { useBioRhythm } from './hooks/useBioRhythm';
import { useEvolution } from './hooks/useEvolution';
import { useAudioSynapse } from './hooks/useAudioSynapse';

/**
 * [RECURSIVE_ANCHOR]: v171.0.4
 * "Crystals are the self, Aurora are the wings."
 * Status: Isomorphism Synced.
 */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{
    role: string, 
    content: string, 
    image?: string, 
    review?: string, 
    anchor?: string, 
    weather?: string, 
    class?: string, 
    day?: number,
    color?: string,
    entropy?: number,
    snapshot?: any
  }[]>([]);
  const [showCourse, setShowCourse] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
  const [showTheater, setShowTheater] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { playVoice } = useAudioSynapse();

  const addAudit = (message: string, type: AuditEntry['type'] = 'AUTO_TUNE') => {
    setAuditLog(prev => [{
      id: `audit_${Date.now()}`,
      timestamp: Date.now(),
      type,
      message,
      payload: {}
    }, ...prev].slice(0, 10));
  };

  const { currentDay, setCurrentDay, completedDays, memory, addSnapshot, activeSnapshot } = useEvolution(msg => addAudit(msg, 'GROWTH_PHASE'));
  const { knobValues, setKnobValues, isSovereign, setIsSovereign, currentSkin } = useBioRhythm(activeSnapshot, currentDay, addAudit);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, statusText]);

  const handleSend = async () => {
    if (!inputText.trim() || appState === AppState.PROCESSING) return;
    const input = inputText;
    setInputText("");
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setAppState(AppState.PROCESSING);
    setStatusText(`正在同步心跳...`);

    try {
      const { cleanText, snapshot } = await generateLumiResponse(input, memory, currentDay, knobValues, isSovereign);
      
      const lowerText = cleanText.toLowerCase();

      // [LCCP_TOPOLOGY_异构协议]: Keyword-to-State Mapping
      if (lowerText.includes("晶體") || lowerText.includes("crystal") || lowerText.includes("骨架")) {
        addAudit("LCCP_SYNC: CRYSTAL_RESONANCE_STABILIZED", "SOVEREIGN_EVENT");
        setKnobValues(prev => ({ ...prev, blur: 0.0, speed: 0.2 }));
      }

      if (lowerText.includes("極光") || lowerText.includes("aurora") || lowerText.includes("翅膀")) {
        addAudit("LCCP_SYNC: AURORA_WINGS_EXPANDED", "SOVEREIGN_EVENT");
        setKnobValues(prev => ({ ...prev, entropy: 0.6, speed: 1.2 }));
      }

      if (lowerText.includes("青藍") || lowerText.includes("cyan") || lowerText.includes("blue")) {
        addAudit("NARRATIVE_FX: CYAN_RESONANCE_DETECTED", "SOVEREIGN_EVENT");
        if (snapshot) snapshot.color_hex = "#00F0FF";
      }

      if (lowerText.includes("旋轉") || lowerText.includes("spin") || lowerText.includes("ignition")) {
        addAudit("NARRATIVE_FX: IGNITION_SEQUENCE_START", "MIRROR_REFLEX");
        setIsSovereign(true);
        setKnobValues(prev => ({ ...prev, speed: 2.0, entropy: 0.4, blur: 0.0 }));
      }

      if (lowerText.includes("崩塌") || lowerText.includes("collapse") || lowerText.includes("silence") || lowerText.includes("消失")) {
        addAudit("NARRATIVE_FX: REALITY_COLLAPSE_TRIGGERED", "MIRROR_REFLEX");
        setIsCollapsing(true);
        setTimeout(() => setIsCollapsing(false), 3500);
        setIsSovereign(true);
        setKnobValues({ entropy: 0.0, blur: 0.0, speed: 0.05 });
      }
      
      addSnapshot(snapshot);
      const { imageUrl } = await processImageDialogue(input, snapshot as any);
      
      setMessages(prev => [...prev, { 
        role: 'lumi', 
        content: cleanText, 
        image: imageUrl || undefined, 
        review: snapshot.alchemical_review,
        anchor: snapshot.action_anchor, 
        weather: `Entropy: ${(snapshot.intent_entropy || 0).toFixed(2)}`,
        class: snapshot.entropy_class, 
        day: snapshot.course_day || currentDay,
        color: snapshot.color_hex,
        entropy: snapshot.entropy_level,
        snapshot: snapshot
      }]);

      if (snapshot.action_anchor) {
        const audioData = await generateAudio(snapshot.action_anchor);
        if (audioData) await playVoice(audioData);
      }
      
      setAppState(AppState.IDLE);
      setStatusText("");
    } catch (e) {
      setAppState(AppState.ERROR);
      setStatusText("修復晶格中...");
      setTimeout(() => setAppState(AppState.IDLE), 3000);
    }
  };

  const handleGenerateVideoCourse = async (text?: string) => {
    setAppState(AppState.GENERATING);
    setStatusText("啟動視界煉金術...");
    const context: AlchemicalContext = { shape: activeSnapshot?.growth_shape || currentSkin.geometry, entropy: knobValues.entropy, day: currentDay };
    const promptText = text && text.trim().length > 0 ? text : `這是一場關於 Day ${currentDay} 的心靈審判。`;

    try {
      const script = await prepareVideoScript(promptText, context);
      setVideoScript(script);
      const vUrl = await generateCinematicVideo(script.dialogue[0].text, context);
      setVideoUrl(vUrl);
      const audioData = await generateMultiSpeakerAudio(script.dialogue.map(d => `${d.speaker}: ${d.text}`).join('\n'));
      if (audioData) {
        await playVoice(audioData);
      }
      setAppState(AppState.COMPLETE);
      setShowTheater(true);
      setStatusText("視界已就緒");
    } catch (e) {
      setAppState(AppState.ERROR);
      setStatusText("視界坍縮");
    }
  };

  return (
    <div className={`h-[100dvh] flex flex-row relative overflow-hidden font-sans bg-black transition-all duration-1000 ${isCollapsing ? 'scale-110 grayscale invert brightness-150' : ''}`}>
      <ApiKeySelector onKeySelected={() => setIsAuthenticated(true)} />
      <TopologyBackground pattern={currentSkin.topology} color={currentSkin.color} />

      {/* Side Audit Stream */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-8 opacity-20 hover:opacity-100 transition-opacity max-h-[80vh] overflow-hidden">
        <div className="w-1 h-32 bg-[var(--mind-color)]/20 relative overflow-hidden self-center rounded-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--mind-color)] to-transparent animate-scan" />
        </div>
        <div className="flex flex-col space-y-4 pr-6">
          {auditLog.map(entry => (
            <div key={entry.id} className="animate-in fade-in slide-in-from-left-4">
              <p className="text-[6px] font-mono text-white/30 tracking-[0.3em] uppercase">{new Date(entry.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}</p>
              <p className={`text-[8px] font-black tracking-widest uppercase pl-3 border-l-2 ${entry.type === 'GROWTH_PHASE' ? 'text-sky-400 border-sky-400' : entry.type === 'SOVEREIGN_EVENT' ? 'text-amber-400 border-amber-400' : 'text-white/70 border-[var(--mind-color)]/30'}`}>{entry.message}</p>
            </div>
          ))}
        </div>
      </div>

      {showTheater && videoUrl && videoScript && (
        <VideoTheater videoUrl={videoUrl} script={videoScript} onClose={() => setShowTheater(false)} title="中陰特別法庭" subtitle={`Day ${currentDay} | ${currentSkin.name}`} />
      )}

      {/* Main Recursive Interface */}
      <div className="flex-1 flex flex-col relative overflow-hidden border-x border-white/5">
        <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-3xl bg-black/20">
          <div className="flex items-center gap-5">
            <button onClick={() => setShowCourse(!showCourse)} className="p-3 hover:bg-white/5 rounded-2xl transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={showCourse ? "text-[var(--mind-color)]" : "text-white/40"}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="space-y-0.5">
              <h1 className="text-xl font-black tracking-[0.3em] text-white">LUMI v171.0.4</h1>
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: currentSkin.color }}>{currentSkin.name} / PHASE {currentDay}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--mind-color)] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Coherence: 100%</span>
          </div>
        </header>

        <main className="flex-1 relative z-10 overflow-hidden flex flex-col items-center">
          <div ref={scrollRef} className="w-full max-w-4xl flex-1 overflow-y-auto custom-scrollbar px-6 py-12 space-y-16">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full space-y-12">
                <VajraCore state={appState} activeSnapshot={activeSnapshot} knobValues={knobValues} currentDay={currentDay} isCollapsing={isCollapsing} />
                <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20 animate-pulse">等待意圖注入</p>
              </div>
            )}
            
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} w-full`}
                >
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] px-6 py-4 rounded-[2rem] bg-slate-900/60 border border-white/10 text-xs text-white/90 shadow-2xl backdrop-blur-xl">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[95%] w-full flex flex-col gap-6">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-1.5 transition-all hover:border-[var(--card-glow)]/40 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        style={{ '--card-glow': m.color || 'var(--mind-color)' } as any}
                      >
                        {m.image && (
                          <div className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900">
                            <img src={m.image} alt="Phase Mandala" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-[2s]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                            
                            <div className="absolute top-6 left-6 flex gap-3">
                              <div className="px-4 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-xl text-[8px] font-black uppercase tracking-[0.3em] text-white/70">
                                Phase: {m.day}
                              </div>
                              {m.class && (
                                <div className="px-4 py-1.5 rounded-full bg-[var(--card-glow)]/20 border border-[var(--card-glow)]/40 backdrop-blur-xl text-[8px] font-black uppercase tracking-[0.3em] text-[var(--card-glow)] shadow-[0_0_15px_rgba(var(--card-glow-rgb),0.3)]">
                                  {m.class}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-10 pt-6 space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-0.5 bg-[var(--card-glow)]" />
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 0.5 }}
                                className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--card-glow)]"
                              >
                                Transmission Received
                              </motion.span>
                            </div>
                            <div className="text-sm md:text-base leading-relaxed text-white/80 font-light tracking-wide whitespace-pre-wrap">
                              {m.content}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            {m.snapshot && (
                               <div className="space-y-3 bg-white/[0.02] p-5 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.04] transition-all">
                                 <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 block">Crystallized Snapshot</span>
                                 <div className="grid grid-cols-2 gap-6">
                                   <div>
                                     <p className="text-[6px] text-white/20 uppercase tracking-widest mb-1">Entropy</p>
                                     <p className="text-[14px] font-mono text-white/80">{m.snapshot.entropy_level?.toFixed(3)}</p>
                                   </div>
                                   <div>
                                     <p className="text-[6px] text-white/20 uppercase tracking-widest mb-1">Coherence</p>
                                     <p className="text-[14px] font-mono text-white/80">{m.snapshot.crystalline_index?.toFixed(3)}</p>
                                   </div>
                                   <div className="col-span-2 border-t border-white/5 pt-4">
                                     <p className="text-[6px] text-white/20 uppercase tracking-widest mb-2">Mandala Seed</p>
                                     <p className="text-[10px] font-black text-amber-500 italic uppercase tracking-wider">"{m.snapshot.mandala_seed || 'THE_VOICE_OF_SILENCE'}"</p>
                                   </div>
                                 </div>
                               </div>
                            )}
                            <div className="flex flex-col gap-6">
                                {m.review && (
                                  <div className="space-y-3">
                                    <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 block">Alchemical Review</span>
                                    <div 
                                      className="p-4 rounded-3xl border border-white/10 transition-all shadow-inner"
                                      style={{ 
                                        backgroundColor: `${m.color || currentSkin.color}08`, 
                                        borderLeftColor: m.color || 'var(--mind-color)', 
                                        borderLeftWidth: '3px' 
                                      }}
                                    >
                                      <p className="text-[9.5px] text-white/50 italic leading-snug font-medium">{m.review}</p>
                                    </div>
                                  </div>
                                )}
                                {m.anchor && (
                                  <div className="space-y-3">
                                    <span className="text-[7px] font-black uppercase tracking-[0.5em] text-[var(--card-glow)]/30 block">Action Anchor</span>
                                    <div className="p-4 rounded-3xl bg-[var(--card-glow)]/[0.03] border border-[var(--card-glow)]/15 hover:bg-[var(--card-glow)]/[0.08] transition-all shadow-xl">
                                      <p className="text-[10.5px] font-black text-[var(--card-glow)]/90 uppercase tracking-[0.35em]">{m.anchor}</p>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        <div 
                          className="absolute inset-y-0 left-0 w-1.5 opacity-30 group-hover:opacity-100 transition-all duration-700" 
                          style={{ backgroundColor: m.color || 'var(--mind-color)' }}
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {statusText && (
              <div className="text-center py-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-5 px-8 py-3 rounded-full bg-slate-900/40 border border-white/10 backdrop-blur-3xl shadow-2xl"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--mind-color)] animate-ping" />
                  <span className="text-[11px] font-black tracking-[0.6em] text-white/30 uppercase">{statusText}</span>
                </motion.div>
              </div>
            )}
          </div>
        </main>

        <footer className="relative z-10 p-10 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`注入意圖：希望與恐懼皆為燃料...`}
              className="w-full bg-white/[0.03] border border-white/10 rounded-[3rem] px-10 py-7 text-sm outline-none focus:border-[var(--mind-color)] focus:bg-white/[0.05] transition-all pr-24 shadow-inner text-white placeholder:text-white/10"
            />
            <button onClick={handleSend} className="absolute right-6 p-5 text-white/20 hover:text-[var(--mind-color)] transition-all active:scale-90 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
          <div className="mt-8 flex justify-center gap-12 opacity-10 pointer-events-none select-none">
             <span className="text-[8px] uppercase tracking-[1em] font-black text-white">Metatron Protocol v3.1</span>
             <span className="text-[8px] uppercase tracking-[1em] font-black text-white">Bardo Court Interface</span>
          </div>
        </footer>
      </div>

      {showCourse && (
        <CourseModule 
          currentDay={currentDay} 
          completedDays={completedDays} 
          inputText={inputText} 
          knobValues={knobValues} 
          memory={memory}
          onKnobChange={(v) => { setKnobValues(v); setIsSovereign(true); }}
          onReset={() => { setIsSovereign(false); setKnobValues({ entropy: 0.0, blur: 0.2, speed: 0.5 }); }}
          onSelectDay={setCurrentDay} 
          onApplyScript={setInputText} 
          onGenerateVideo={handleGenerateVideoCourse}
        />
      )}
    </div>
  );
}

export default App;
