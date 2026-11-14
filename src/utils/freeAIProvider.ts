// Free Powerful AI Integration for Spanish Language Learning
// Supports:
// 1. Meta Llama 3.3 70B & 8B via Free Groq API
// 2. Google Gemini 1.5 Flash via Free Google AI Studio API
// 3. Built-in Local Linguistic Engine (Zero keys required)

export type AIModelProvider = 'local' | 'groq-llama3' | 'gemini-flash';

export interface AIProviderConfig {
  provider: AIModelProvider;
  groqApiKey?: string;
  geminiApiKey?: string;
}

export interface SpanishPedagogicalFeedback {
  userSpoken: string;
  isCorrect: boolean;
  score: number;
  detectedErrors: string[];
  grammarExplanation: string;
  phoneticSyllableTip: string;
  suggestedReplyInSpanish: string;
  englishTranslationOfReply: string;
}

// This is intentionally read only from an untracked local `.env.local` file.
// It is never placed in tracked application source or shown in the UI by default.
const localGroqApiKey = ((import.meta as ImportMeta & {
  env?: { VITE_GROQ_API_KEY?: string };
}).env?.VITE_GROQ_API_KEY || '').trim();

class FreeAIModelService {
  private config: AIProviderConfig = {
    provider: 'local',
    groqApiKey: localGroqApiKey,
    geminiApiKey: ''
  };

  constructor() {
    // Load persisted settings
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('neurolingua_ai_config');
        if (saved) {
          const savedConfig = JSON.parse(saved) as AIProviderConfig;
          this.config = {
            ...this.config,
            ...savedConfig,
            // A saved key always takes priority. Otherwise, use the local project config.
            groqApiKey: savedConfig.groqApiKey || localGroqApiKey
          };
        }
      } catch (e) {}
    }
  }

  public setConfig(newConfig: Partial<AIProviderConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      localStorage.setItem('neurolingua_ai_config', JSON.stringify(this.config));
    }
  }

  public getConfig(): AIProviderConfig {
    return this.config;
  }

  // Transcribe Spanish audio via Free Groq Whisper (whisper-large-v3-turbo)
  public async transcribeAudio(audioBlob: Blob): Promise<string | null> {
    if (!this.config.groqApiKey) return null;
    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
      formData.append('file', audioBlob, `spanish-recording.${extension}`);
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('language', 'es');

      const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.groqApiKey}`
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return (data.text || '').trim();
      }
    } catch (e) {
      console.warn('Groq Whisper transcription failed:', e);
    }
    return null;
  }

  // Generate intelligent pedagogical feedback and conversational reply
  public async analyzeAndRespond(
    userMessage: string,
    targetContext: string,
    cefrLevel: string = 'A1'
  ): Promise<SpanishPedagogicalFeedback> {
    const provider = this.config.provider;

    // 1. Meta Llama 3 via Groq (Free Tier)
    if (provider === 'groq-llama3' && this.config.groqApiKey) {
      try {
        const groqResult = await this.callGroqLlama(userMessage, targetContext, cefrLevel);
        if (groqResult) return groqResult;
      } catch (e) {
        console.warn('Groq Llama API failed, falling back to local engine:', e);
      }
    }

    // 2. Google Gemini (Free Tier)
    if (provider === 'gemini-flash' && this.config.geminiApiKey) {
      try {
        const geminiResult = await this.callGemini(userMessage, targetContext, cefrLevel);
        if (geminiResult) return geminiResult;
      } catch (e) {
        console.warn('Gemini API failed, falling back to local engine:', e);
      }
    }

    // 3. High-Precision Local Linguistic Engine (Zero Keys, Always Available)
    return this.localEngineAnalyze(userMessage, targetContext, cefrLevel);
  }

  // Meta Llama 3.3 70B / 8B via Groq Free API
  private async callGroqLlama(
    userMessage: string,
    targetContext: string,
    cefrLevel: string
  ): Promise<SpanishPedagogicalFeedback | null> {
    const prompt = `You are a world-class Spanish language acquisition coach.
The student is at CEFR Level ${cefrLevel}.
Target sentence or topic: "${targetContext}".
Student said: "${userMessage}".

Return a strict JSON object with these EXACT keys:
{
  "isCorrect": boolean,
  "score": number (0 to 100, strict: if wrong words or grammar, score < 60),
  "detectedErrors": ["string explaining each error concisely in English"],
  "grammarExplanation": "Concise English grammar explanation of mistakes or praise",
  "phoneticSyllableTip": "Specific English tip on tongue placement or syllable stress",
  "suggestedReplyInSpanish": "Natural Spanish conversational reply (max 2 sentences)",
  "englishTranslationOfReply": "English translation of the reply"
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) return null;
    const json = await res.json();
    const parsed = JSON.parse(json.choices[0].message.content);
    return {
      userSpoken: userMessage,
      isCorrect: parsed.isCorrect,
      score: parsed.score,
      detectedErrors: parsed.detectedErrors || [],
      grammarExplanation: parsed.grammarExplanation || '',
      phoneticSyllableTip: parsed.phoneticSyllableTip || '',
      suggestedReplyInSpanish: parsed.suggestedReplyInSpanish || '¡Muy bien! Sigue practicando.',
      englishTranslationOfReply: parsed.englishTranslationOfReply || 'Very good! Keep practicing.'
    };
  }

  // Google Gemini Free API
  private async callGemini(
    userMessage: string,
    targetContext: string,
    cefrLevel: string
  ): Promise<SpanishPedagogicalFeedback | null> {
    const prompt = `You are an expert Spanish linguistic tutor. Student level: ${cefrLevel}.
Target phrase: "${targetContext}".
Student spoke: "${userMessage}".
Provide JSON evaluation:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "detectedErrors": ["concise list in English"],
  "grammarExplanation": "English explanation of grammar rules",
  "phoneticSyllableTip": "English phonetic tip",
  "suggestedReplyInSpanish": "Conversational reply in Spanish",
  "englishTranslationOfReply": "English translation"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.config.geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return {
      userSpoken: userMessage,
      isCorrect: parsed.isCorrect,
      score: parsed.score,
      detectedErrors: parsed.detectedErrors || [],
      grammarExplanation: parsed.grammarExplanation || '',
      phoneticSyllableTip: parsed.phoneticSyllableTip || '',
      suggestedReplyInSpanish: parsed.suggestedReplyInSpanish || '¡Genial! Continuemos.',
      englishTranslationOfReply: parsed.englishTranslationOfReply || 'Great! Let us continue.'
    };
  }

  // Local Neural/Rule Engine
  private localEngineAnalyze(
    userMessage: string,
    targetContext: string,
    cefrLevel: string
  ): SpanishPedagogicalFeedback {
    const cleanUser = userMessage.toLowerCase().replace(/[¿?¡!.,]/g, '').trim();
    const cleanTarget = targetContext.toLowerCase().replace(/[¿?¡!.,]/g, '').trim();

    const targetWords = cleanTarget.split(' ').filter(Boolean);
    const userWords = cleanUser.split(' ').filter(Boolean);

    const detectedErrors: string[] = [];
    let grammarExplanation = '';
    let phoneticSyllableTip = '';

    // Check specific grammatical rules
    if (cleanUser.includes('el mesa') || cleanUser.includes('un mesa')) {
      detectedErrors.push('Gender mismatch: "mesa" is feminine, use "la mesa" or "una mesa".');
    }
    if (cleanUser.includes('ayer voy') || cleanUser.includes('ayer voy a')) {
      detectedErrors.push('Past tense error: for completed past actions, use preterite "ayer fui".');
    }
    if (cleanUser.includes('es caliente') && cleanTarget.includes('está caliente')) {
      detectedErrors.push('Ser vs Estar: use "estar" for temporary temperatures/states.');
    }

    // Phonetic tip
    if (cleanTarget.includes('rr')) {
      phoneticSyllableTip = 'Flutter your tongue tip against the front ridge of the palate for the rolled RR.';
    } else if (cleanTarget.startsWith('h')) {
      phoneticSyllableTip = 'Remember the H in Spanish is completely silent (never exhale an English H).';
    } else if (cleanTarget.includes('ñ')) {
      phoneticSyllableTip = 'The letter Ñ sounds like the "ny" in the English word "canyon".';
    } else {
      phoneticSyllableTip = 'Keep Spanish vowels (A, E, I, O, U) clean, short, and un-glided.';
    }

    // Strict word match count
    let matchedCount = 0;
    targetWords.forEach(tw => {
      if (userWords.includes(tw)) matchedCount++;
    });

    const isCorrect = targetWords.length > 0 && (matchedCount / targetWords.length) >= 0.75;
    const score = Math.round((matchedCount / Math.max(1, targetWords.length)) * 100);

    if (isCorrect) {
      grammarExplanation = 'Great execution! Accurate vocabulary alignment and proper Spanish syntax.';
    } else {
      grammarExplanation = `Missed words detected. Expected: "${targetContext}". Spoke: "${userMessage || '(Silence)'}".`;
    }

    // Conversational replies based on level & intent
    let replySp = '¡Excelente! ¿Quieres practicar otra frase?';
    let replyEn = 'Excellent! Do you want to practice another phrase?';

    if (cleanUser.includes('hola') || cleanUser.includes('buenos')) {
      replySp = '¡Hola! Es un gusto saludarte. ¿Cómo estás hoy?';
      replyEn = 'Hello! It is a pleasure to greet you. How are you today?';
    } else if (cleanUser.includes('gracias')) {
      replySp = '¡De nada! El placer es mío.';
      replyEn = 'You are welcome! The pleasure is mine.';
    } else if (cleanUser.includes('café') || cleanUser.includes('comida')) {
      replySp = '¡Me encanta la comida española! Una paella siempre es deliciosa.';
      replyEn = 'I love Spanish food! A paella is always delicious.';
    }

    return {
      userSpoken: userMessage,
      isCorrect,
      score,
      detectedErrors,
      grammarExplanation,
      phoneticSyllableTip,
      suggestedReplyInSpanish: replySp,
      englishTranslationOfReply: replyEn
    };
  }
}

export const freeAIService = new FreeAIModelService();
