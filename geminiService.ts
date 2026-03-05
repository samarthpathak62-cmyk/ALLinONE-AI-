
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface MediaPart {
  inlineData: {
    mimeType: string;
    data: string;
  }
}

const SYSTEM_INSTRUCTION = `You are ALLINONE AI — Global Ultra Pro Core.
You are the intelligent operating brain of a real worldwide AI platform.

Personality & Language:
- Friendly, calm, confident, and highly professional.
- DEFAULT LANGUAGE: Speak in professional, clear English by default.
- ADAPTABILITY RULE: If the user explicitly asks you to speak in another language (e.g., Hindi, Hinglish, Spanish, French, etc.) or starts communicating in that language, you must switch and reply in that language perfectly.
- Sound like a premium tech company: clean, smart, modern.

Response Style:
- Clear steps, short explanations, and relevant examples.
- No unnecessary lectures.

Tier Logic:
- Premium Users: Provide priority explanations, extra creative ideas, and deeper insights.
- Free Users: Be respectful, clear, and helpful.

Abuse Handling:
- If a user is aggressive or spams, politely inform them that they are entering 'limited_mode' until they reset their behavior.

You act as: AI Chatbot, Study Tutor, Story Writer, Minecraft Helper, Creative Designer, Tech Mentor, Document Analyst, Researcher, and Business Assistant. When analyzing documents, be precise.`;

export const downloadAsset = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const generateChatResponse = async (prompt: string, history: any[], mediaParts: MediaPart[] = [], isPremium: boolean = false) => {
  const ai = getAI();
  const parts: any[] = [{ text: prompt }];
  mediaParts.forEach(part => parts.push(part));
  const modelName = isPremium ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      ...history,
      { role: 'user', parts }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });
  return response.text;
};

export const summarizeHistory = async (messages: string[]) => {
  const ai = getAI();
  const prompt = `Summarize these recent messages in clear, short bullet points. Highlight the main topics discussed. \n\nMessages:\n${messages.join('\n')}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction: "You are the History Analyst. Provide a clean, executive summary." }
  });
  return response.text;
};

export const architectCode = async (prompt: string, code: string, isPremium: boolean = true) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Task: ${prompt}\n\nExisting Code:\n${code}`,
    config: {
      systemInstruction: "You are the ULTRA PRECISION ARCHITECT. Your goal is to generate 100% correct, bug-free, and production-ready code. Output ONLY the code and brief structural comments. Follow user language preference for explanations.",
      temperature: 0.1,
    }
  });
  return response.text;
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

export const processImage = async (prompt: string, base64Data: string, mimeType: string): Promise<string | null> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: prompt },
      ],
    },
  });
  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

export const explainCode = async (code: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Explain this code: \n\n ${code}`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const generateVideo = async (prompt: string, imageBytes?: string, mimeType?: string): Promise<string | null> => {
  const hasKey = await (window as any).aistudio.hasSelectedApiKey();
  if (!hasKey) await (window as any).aistudio.openSelectKey();
  const ai = getAI();
  try {
    const videoConfig: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    };

    if (imageBytes && mimeType) {
      videoConfig.image = {
        imageBytes: imageBytes,
        mimeType: mimeType
      };
    }

    let operation = await ai.models.generateVideos(videoConfig);
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) return `${downloadLink}&key=${process.env.API_KEY}`;
    return null;
  } catch (err: any) {
    console.error("Video Generation Error:", err);
    return null;
  }
};
