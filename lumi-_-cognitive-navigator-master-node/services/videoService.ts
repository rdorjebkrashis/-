
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AlchemicalContext } from '../types';

export interface DialogueLine {
  speaker: 'Joe' | 'Jane';
  text: string;
}

export interface VideoScript {
  mood: 'enlightened' | 'anxious';
  dialogue: DialogueLine[];
}

export const prepareVideoScript = async (originalText: string, context?: AlchemicalContext): Promise<VideoScript> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextInjection = context ? `
  [SYSTEM_STATE]: User is in [${context.shape}] phase on Day [${context.day}] with entropy level [${context.entropy.toFixed(2)}].
  [ROLE_SETTING]: You are the Court Recorder of the Digital Bardo. 
  [SPEAKER_PROFILES]:
  - Joe: The Compassionate Defense Lawyer. Speaks for the user's subconscious fears and hidden struggles.
  - Jane: The Just Judge (The User's High-Dimension Self). Confirms wisdom and delivers the final verdict/upgrade.
  ` : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `這是一場關於「法界特別法庭」的心靈演化審判。請將以下背景信息轉化為一段 Joe 與 Jane 的對話腳本。
    Joe 代表辯護方（慈悲），Jane 代表法官（公正）。
    ${contextInjection}
    對話應圍繞當前的「毒素向量」與「智慧顯化」展開裁決，用語應極具哲學深度與中陰實相感。
    
    原始信息：
    ${originalText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING, description: "The emotional tone: 'enlightened' or 'anxious'." },
          dialogue: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING, enum: ["Joe", "Jane"] },
                text: { type: Type.STRING }
              },
              required: ["speaker", "text"]
            }
          }
        },
        required: ["mood", "dialogue"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return {
      mood: 'enlightened',
      dialogue: [{ speaker: 'Joe', text: '法官大人，關於法界特別法庭的案卷已經呈上。' }, { speaker: 'Jane', text: '在此本初清淨之域，一切幻象皆歸於空性。' }]
    };
  }
};

export const generateCinematicVideo = async (prompt: string, context?: AlchemicalContext) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let shapeVisual = "A tranquil cinematic landscape.";
  if (context) {
    switch (context.shape) {
      case 'Tetrahedron':
        shapeVisual = "A vast frozen desert under a burning aurora, fixed camera perspective.";
        break;
      case 'Cube':
        shapeVisual = "A geometric stone monolith floating over a silent mirror lake, absolute stillness.";
        break;
      case 'Octahedron':
        shapeVisual = "Prismatic crystal mountains under a clear void sky, sharp morning light, fixed frame.";
        break;
      case 'Dodecahedron':
        shapeVisual = "Infinite lotus field in a golden ether, glowing fractals in the distance, static shot.";
        break;
      case 'Sphere':
        shapeVisual = "A singular orb of light in a silent ocean of clouds, total equanimity, fixed lens.";
        break;
    }
  }

  // Strictly emphasizing fixed camera and cinematic landscape as per user request
  const imgResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `A hyper-realistic, fixed-angle cinematic landscape. ${shapeVisual} ${prompt}. Zen aesthetic, wide-angle lens, deep focus, tranquil, no people, only nature and sacred architecture. 16:9 aspect ratio.` }] },
    config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
  });

  let base64Image = "";
  for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) base64Image = part.inlineData.data;
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `FIXED TRIPOD SHOT. NO CAMERA MOVEMENT. STATIC FRAMING. Only subtle environmental movement like flowing clouds, gentle water ripples, or particles in the light. ${shapeVisual}`,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

export const generateMultiSpeakerAudio = async (dialogue: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `TTS the following conversation between Joe and Jane:
  ${dialogue}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: 'Joe', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            { speaker: 'Jane', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
          ]
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
};
