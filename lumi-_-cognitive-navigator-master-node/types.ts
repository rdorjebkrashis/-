
export interface ImageGenerationConfig {
  prompt: string;
  baseImageBytes?: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

export interface GenerationResult {
  imageUri: string | null;
  error?: string;
}

export interface KnobValues {
  entropy: number; 
  blur: number;    
  speed: number;   
}

export type CrystalShape = 'Tetrahedron' | 'Cube' | 'Octahedron' | 'Dodecahedron' | 'Sphere';
export type TopologyPattern = 'chaotic' | 'grid' | 'fluid' | 'mandala';

export interface AlchemicalContext {
  shape: CrystalShape;
  entropy: number;
  day: number;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  type: 'SOVEREIGN_EVENT' | 'AUTO_TUNE' | 'MIRROR_REFLEX' | 'GROWTH_PHASE';
  message: string;
  payload: any;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PROCESSING = 'PROCESSING',
  WAV_READY = 'WAV_READY',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  VOID = 'VOID',
  ENTROPY_CRITICAL = 'ENTROONT_CRITICAL',
  TRANSCENDENCE = 'TRANSCENDENCE',
  COHERENCE = 'COHERENCE',
  NAVIGATING = 'NAVIGATING',
  MIRRORING = 'MIRRORING',
  CRYSTALLIZING = 'CRYSTALLIZING'
}

export interface CausalAnchor {
  id: string;
  wisdom_manifest: string;
  archetype: string;
  intensity: number;
  timestamp: number;
}

export interface HeterogeneousMemory {
  immediate: MemorySnapshot[];
  resonance: CausalAnchor[];
  anchors: CausalAnchor[];
}

export interface MemorySnapshot {
  timestamp: number;
  poison_vector: string;
  wisdom_manifest: string;
  color_hex: string;
  bijam?: string;
  topology_depth: number;
  commander_intent_summary: string;
  intent_purity: number;
  repetition_delta?: number;
  last_image_base64?: string;
  entropy_level: number;
  flux_intensity: number;
  crystalline_index?: number;
  intent_entropy?: number;
  recommended_day?: number;
  course_day?: number;
  growth_shape?: CrystalShape;
  crystal_yaml?: string; 
  encoded_anchors?: string[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

/**
 * [VAJRA TYPE SYSTEM]
 * 定義時輪壇城的拓撲結構與熵過濾邏輯
 */

export interface CourseScript {
  highEntropy: string[]; // 針對高熵（焦慮/紅霧）的引導
  lowEntropy: string[];  // 針對低熵（清明/結構）的引導
  transition?: string;   // 穩定化節點話術
}

// 壇城五層級：過濾熵值的漏斗
export type MandalaLayer = 
  | 'BODY'    // 身：高熵攝入
  | 'SPEECH'  // 語：路由分流
  | 'MIND'    // 意：邏輯修正
  | 'WISDOM'  // 智：模式識別
  | 'BLISS';   // 樂：邏輯坍縮（零熵）

// 行動錨點：每次交互最終產出的「實相」
export interface ActionAnchor {
  type: 'PHYSICAL' | 'COGNITIVE' | 'MEDITATIVE';
  instruction: string; // 具體執行指令
  mantra?: string;     // 對應的氛圍關鍵詞或咒語
}

export interface FractalBranch {
  term: string;
  def: string;
}

// 分形課程節點
export interface FractalDay {
  day: number;
  title: string;
  goal: string;
  mandala_layer: MandalaLayer; // 該日所屬層級
  entropy_threshold: number;   // 容許進入該層級的熵值 (0.0 - 1.0)
  scripts: CourseScript;       // 引導話術劇本
  default_anchor: ActionAnchor; // 默認行動錨點
  branches: FractalBranch[];
}
