import { SpeechScoreResult } from '../types';

type SpanishAccent = 'es-ES' | 'es-MX';

let cachedVoices: SpeechSynthesisVoice[] = [];

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return window.speechSynthesis;
}

function refreshVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();
  if (!synth) return [];
  const available = synth.getVoices();
  if (available.length) cachedVoices = available;
  return cachedVoices;
}

/** All locally available voices that are actually marked as Spanish. */
export function getSpanishVoices(): SpeechSynthesisVoice[] {
  return refreshVoices().filter(voice => voice.lang.toLowerCase().startsWith('es'));
}

/**
 * Browsers often expose a basic system voice before their high-quality online/Natural
 * Spanish voice. Rank the Spanish voices deliberately instead of accepting the first one.
 */
export function getBestSpanishVoice(preferredAccent: SpanishAccent = 'es-ES'): SpeechSynthesisVoice | null {
  const wanted = preferredAccent.toLowerCase();
  const voices = getSpanishVoices();
  if (!voices.length) return null;

  const scoreVoice = (voice: SpeechSynthesisVoice) => {
    const language = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    let score = 0;

    if (language === wanted) score += 1_000;
    else if (preferredAccent === 'es-MX' && (language === 'es-us' || language === 'es-419')) score += 920;
    else if (language.startsWith('es')) score += 760;

    // Chromium and Windows names their clearest voices with one of these labels.
    if (/natural|neural|online|enhanced|premium/.test(name)) score += 180;
    if (/google/.test(name)) score += 120;
    if (/microsoft|apple/.test(name)) score += 55;
    if (!voice.localService) score += 35;
    if (voice.default) score += 5;

    return score;
  };

  return voices.reduce((best, voice) => scoreVoice(voice) > scoreVoice(best) ? voice : best);
}

export function getSpanishVoiceStatus(preferredAccent: SpanishAccent = 'es-ES'): {
  available: boolean;
  label: string;
} {
  const voice = getBestSpanishVoice(preferredAccent);
  if (!voice) {
    return {
      available: false,
      label: 'No Spanish system voice found — browser fallback may sound unclear.'
    };
  }
  return {
    available: true,
    label: `${voice.name} · ${voice.lang}`
  };
}

// Voice lists are commonly empty at first load in Chrome/Edge, then arrive a moment later.
// Keeping this cache fresh prevents the app from falling back to an English default voice.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  refreshVoices();
}

function cleanTextForSpeech(text: string): string {
  return text
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakSpanish(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    preferredAccent?: SpanishAccent;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): SpeechSynthesisUtterance | null {
  const synth = getSynth();
  if (!synth) return null;

  const accent = options?.preferredAccent || 'es-ES';
  const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
  utterance.lang = accent;
  // Very fast synthesis blurs vowels; keep the normal Listen action clear and deliberate.
  utterance.rate = Math.min(1.08, Math.max(0.68, options?.rate ?? 0.92));
  utterance.pitch = options?.pitch ?? 1.0;
  utterance.volume = 1;

  let hasSpoken = false;
  const speak = () => {
    if (hasSpoken) return;
    hasSpoken = true;
    const preferredVoice = getBestSpanishVoice(accent);
    if (preferredVoice) utterance.voice = preferredVoice;
    synth.cancel();
    synth.speak(utterance);
  };

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = event => options.onError?.(event);

  if (getSpanishVoices().length) {
    speak();
  } else {
    // Give Chrome/Edge a short chance to supply its Spanish/Natural voices before speaking.
    // A click still always produces audio if the device has no Spanish voice installed.
    const delayedSpeak = () => {
      refreshVoices();
      speak();
    };
    const voiceTimer = window.setTimeout(delayedSpeak, 180);
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      window.clearTimeout(voiceTimer);
      delayedSpeak();
    }, { once: true });
  }

  return utterance;
}

export function stopSpeaking() {
  getSynth()?.cancel();
}

export function normalizeSpanish(str: string): string {
  return str
    .toLowerCase()
    .replace(/[Â¿?Â¡!.,;:()"\-_]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }

  return d[m][n];
}

export function evaluateSpanishPronunciation(
  expectedText: string,
  userTranscript: string
): SpeechScoreResult {
  const normExpected = normalizeSpanish(expectedText);
  const normUser = normalizeSpanish(userTranscript);

  if (!normUser || normUser.trim().length === 0) {
    return {
      rawTranscript: '',
      score: 0,
      feedback: 'retry',
      feedbackText: 'No Spanish words recognized. Please speak aloud into your microphone.',
      wordMatches: normExpected.split(' ').map(expected => ({ expected, match: false }))
    };
  }

  const expectedWords = normExpected.split(' ').filter(Boolean);
  const userWords = normUser.split(' ').filter(Boolean);
  let strictMatchCount = 0;
  const wordMatches = expectedWords.map(expected => {
    const exactMatch = userWords.includes(expected);
    const closeMatch = userWords.some(actual => {
      const distance = levenshteinDistance(actual, expected);
      return expected.length > 4 ? distance <= 1 : distance === 0;
    });
    const match = exactMatch || closeMatch;
    if (match) strictMatchCount++;
    return { expected, match };
  });

  const score = Math.round((strictMatchCount / Math.max(1, expectedWords.length)) * 100);
  let feedback: SpeechScoreResult['feedback'];
  let feedbackText: string;

  if (score >= 90) {
    feedback = 'perfect';
    feedbackText = '¡Excelente! All words pronounced clearly and accurately.';
  } else if (score >= 75) {
    feedback = 'great';
    feedbackText = 'Very good! A couple minor syllable slips, but clearly understood.';
  } else if (score >= 50) {
    feedback = 'retry';
    feedbackText = `Incomplete: only ${strictMatchCount} of ${expectedWords.length} words detected correctly. Try again.`;
  } else {
    feedback = 'retry';
    feedbackText = `Incorrect. Spoke: "${userTranscript}". Expected: "${expectedText}". Practice the syllables below.`;
  }

  return { rawTranscript: userTranscript, score, feedback, feedbackText, wordMatches };
}
