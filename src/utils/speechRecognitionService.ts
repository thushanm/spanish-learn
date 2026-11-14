// Strict & Honest Spanish Speech Recognition Service
// NEVER fakes a pass. Evaluates genuine user audio and returns real transcript or honest error.

export interface StrictSpeechResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  audioBlobUrl?: string;
  audioBlob?: Blob;
  audioByteLength?: number;
  audioDurationMs?: number;
  audioPeak?: number;
  durationMs: number;
  averageVolume: number;
  volumeEnergyScore?: number;
  isOfflineAcoustic?: boolean;
  transcriptionUnavailableReason?: string;
  error?: string;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingMimeType = 'audio/webm';
  private animFrameId: number | null = null;
  private recordingStopPromise: Promise<string | undefined> | null = null;
  private finalizingResult = false;
  private resultEmitted = false;
  private awaitingRecognitionFinal = false;
  private recognitionFallbackTimer: number | null = null;
  private transcriptionUnavailableReason: string | undefined;

  public isListening = false;
  public preferredAccent: 'es-ES' | 'es-MX' = 'es-ES';
  public mode: 'cloud' | 'local' | any = 'local';
  public isAcousticMode = false;
  public lastRecordedBlob: Blob | null = null;

  // Real acoustic measurements
  private startTime: number = 0;
  private volumeSamples: number[] = [];
  private targetExpectedText: string = '';

  // Callbacks
  public onVolumeChange?: (volume: number) => void;
  public onInterimResult?: (text: string) => void;
  public onFinalResult?: (result: StrictSpeechResult) => void;
  public onTranscriptChange?: (result: StrictSpeechResult) => void;
  public onModeChange?: (mode: any) => void;
  public onAcousticModeActivated?: () => void;
  public onError?: (error: string) => void;
  public onEnd?: () => void;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition API not available in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        let maxConfidence = 0.5;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const trans = res[0].transcript;
          if (res[0].confidence) {
            maxConfidence = res[0].confidence;
          }

          if (res.isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        if (interim) {
          this.onInterimResult?.(interim);
        }

        if (final) {
          this.handleSpeechFinalized(final, maxConfidence);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          const errorMsg = 'Microphone permission denied. Please allow microphone in your browser address bar.';
          this.onError?.(errorMsg);
          this.stop(errorMsg);
          return;
        } else if (event.error === 'network') {
          // Chrome speech.googleapis.com is blocked or unreachable on this network!
          // Seamlessly fall back to local acoustic recording. DO NOT ABORT!
          this.isAcousticMode = true;
          this.transcriptionUnavailableReason = 'Browser speech-to-text is unavailable on this network. Your audio is still saved safely.';
          this.onAcousticModeActivated?.();
          return;
        } else if (event.error === 'no-speech') {
          return;
        } else if (event.error === 'audio-capture') {
          const errorMsg = 'No microphone hardware found or it is locked by another program.';
          this.onError?.(errorMsg);
          this.stop(errorMsg);
          return;
        }
      };

      this.recognition.onend = () => {
        // A manual stop gives the browser a moment to emit its final transcript.
        // Do not destroy the recording before that event (or its fallback) completes.
        if (!this.isListening && !this.awaitingRecognitionFinal) {
          this.stopHardware();
          this.onEnd?.();
        }
      };
    } catch (e) {
      console.error('Failed to initialize SpeechRecognition:', e);
    }
  }

  public setTargetExpected(text: string) {
    this.targetExpectedText = text;
  }

  public async start(
    accent: 'es-ES' | 'es-MX' = 'es-ES',
    targetExpected: string = '',
    microphoneDeviceId?: string
  ): Promise<boolean> {
    this.preferredAccent = accent;
    this.targetExpectedText = targetExpected;
    this.volumeSamples = [];
    this.startTime = Date.now();
    this.recordedChunks = [];
    this.isAcousticMode = false;
    this.lastRecordedBlob = null;
    this.recordingStopPromise = null;
    this.finalizingResult = false;
    this.resultEmitted = false;
    this.awaitingRecognitionFinal = false;
    this.transcriptionUnavailableReason = undefined;
    this.clearRecognitionFallbackTimer();

    // Always start real hardware stream to capture true voice and volume
    // Set this before the analyser starts; otherwise its first animation frame exits immediately.
    this.isListening = true;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const audioConstraints: MediaTrackConstraints | boolean = microphoneDeviceId && microphoneDeviceId !== 'default'
          ? { deviceId: { exact: microphoneDeviceId } }
          : true;
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        this.startHardwareAnalysis(this.mediaStream);
        if (!this.startHardwareRecording(this.mediaStream)) {
          this.isListening = false;
          this.stopHardware();
          this.onError?.('Audio recording is not supported in this browser. Please use a current version of Chrome or Brave and try again.');
          return false;
        }
      } else {
        this.isListening = false;
        this.onError?.('Microphone hardware access not supported by browser.');
        return false;
      }
    } catch (err: any) {
      this.isListening = false;
      console.warn('Microphone permission error:', err);
      this.onError?.('Microphone blocked: Click the lock icon in your browser address bar and choose "Allow Microphone".');
      return false;
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      this.transcriptionUnavailableReason = 'This browser does not provide speech-to-text. Your recording can still be transcribed with a configured voice-transcription key.';
    }

    if (this.recognition) {
      try {
        this.recognition.lang = accent;
        this.recognition.start();
        return true;
      } catch (err: any) {
        console.warn('Recognition start exception:', err);
        // If recognition failed to start, still keep listening via hardware stream
        return true;
      }
    }

    return true;
  }

  private startHardwareAnalysis(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.3;
      source.connect(this.analyser);
      // Keep the analyser in an active graph without sending the learner's microphone back to speakers.
      const silentOutput = this.audioContext.createGain();
      silentOutput.gain.value = 0;
      this.analyser.connect(silentOutput);
      silentOutput.connect(this.audioContext.destination);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDomainData = new Uint8Array(this.analyser.fftSize);

      const monitorAudio = () => {
        if (!this.isListening || !this.analyser) return;

        // Auto-resume if browser suspends
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }

        this.analyser.getByteFrequencyData(dataArray);
        let freqSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          freqSum += dataArray[i];
        }
        const freqAvg = bufferLength > 0 ? freqSum / bufferLength : 0;
        const freqNormalized = Math.min(100, Math.round((freqAvg / 128) * 100));

        // Time domain wave oscillation (sensitive to even soft speech)
        this.analyser.getByteTimeDomainData(timeDomainData);
        let devSum = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          devSum += Math.abs(timeDomainData[i] - 128);
        }
        const amp = Math.min(100, Math.round((devSum / timeDomainData.length) * 4));

        const normalized = Math.max(freqNormalized, amp);

        this.volumeSamples.push(normalized);
        this.onVolumeChange?.(normalized);
        this.animFrameId = requestAnimationFrame(monitorAudio);
      };

      monitorAudio();
    } catch (e) {
      console.warn('Audio analysis error:', e);
    }
  }

  private startHardwareRecording(stream: MediaStream): boolean {
    try {
      if (typeof MediaRecorder === 'undefined') {
        return false;
      }

      this.recordedChunks = [];
      const supportedType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4'
      ].find(type => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type));
      this.mediaRecorder = supportedType
        ? new MediaRecorder(stream, { mimeType: supportedType })
        : new MediaRecorder(stream);
      this.recordingMimeType = this.mediaRecorder.mimeType || supportedType || 'audio/webm';
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      // Request a final complete Blob on stop; this is more reliable than short slices on some browsers.
      this.mediaRecorder.start();
      return true;
    } catch (e) {
      console.warn('MediaRecorder recording error:', e);
      this.mediaRecorder = null;
      return false;
    }
  }

  private async handleSpeechFinalized(transcript: string, confidence: number) {
    if (this.finalizingResult || this.resultEmitted) return;
    this.finalizingResult = true;
    this.awaitingRecognitionFinal = false;
    this.clearRecognitionFallbackTimer();
    const durationMs = Date.now() - this.startTime;
    const avgVolume = this.volumeSamples.length > 0
      ? Math.round(this.volumeSamples.reduce((a, b) => a + b, 0) / this.volumeSamples.length)
      : 0;

    const audioBlobUrl = await this.stopRecordingAndGetUrl();
    const audioByteLength = this.lastRecordedBlob?.size ?? 0;
    const audioMetrics = await this.inspectRecordedAudio(this.lastRecordedBlob);
    const maxVolume = this.volumeSamples.length > 0 ? Math.max(...this.volumeSamples) : 0;
    const hasRecordedVoice = (audioByteLength > 200 && durationMs > 150)
      || audioMetrics.peak > 0.001 || maxVolume > 0 || transcript.trim().length > 0;
    this.stopHardware();
    this.isListening = false;

    if (!hasRecordedVoice) {
      const failPayload: StrictSpeechResult = {
        transcript: '',
        isFinal: true,
        confidence: 0,
        audioBlobUrl,
        audioBlob: this.lastRecordedBlob || undefined,
        audioByteLength,
        audioDurationMs: audioMetrics.durationMs,
        audioPeak: audioMetrics.peak,
        durationMs,
        averageVolume: avgVolume,
        volumeEnergyScore: avgVolume,
        error: 'No usable voice recording was captured. Please check microphone permission and try again.'
      };
      this.emitFinalResult(failPayload);
      return;
    }

    const resultPayload: StrictSpeechResult = {
      transcript: transcript.trim(),
      isFinal: true,
      confidence,
      audioBlobUrl,
      audioBlob: this.lastRecordedBlob || undefined,
      audioByteLength,
      audioDurationMs: audioMetrics.durationMs,
      audioPeak: audioMetrics.peak,
      durationMs,
      averageVolume: avgVolume,
      volumeEnergyScore: avgVolume
    };
    this.emitFinalResult(resultPayload);
  }

  public finishSpeaking() {
    this.manualStopAndEvaluate();
  }

  // When user taps "Done / Evaluate" or speech concludes
  public async manualStopAndEvaluate(): Promise<void> {
    if (!this.isListening || this.finalizingResult || this.resultEmitted) return;

    // SpeechRecognition often supplies its final result immediately *after* stop().
    // Wait briefly for that real transcript; only then fall back to an unscored local recording.
    this.isListening = false;
    this.awaitingRecognitionFinal = Boolean(this.recognition);

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) { }
      this.recognitionFallbackTimer = window.setTimeout(() => {
        this.finalizeAsOfflineRecording();
      }, 900);
      return;
    }

    await this.finalizeAsOfflineRecording();
  }

  private async finalizeAsOfflineRecording(): Promise<void> {
    if (this.finalizingResult || this.resultEmitted) return;
    this.finalizingResult = true;
    this.awaitingRecognitionFinal = false;
    this.clearRecognitionFallbackTimer();

    const durationMs = Date.now() - this.startTime;
    const avgVolume = this.volumeSamples.length > 0
      ? Math.round(this.volumeSamples.reduce((a, b) => a + b, 0) / this.volumeSamples.length)
      : 0;

    const maxVolume = this.volumeSamples.length > 0 ? Math.max(...this.volumeSamples) : 0;
    const audioBlobUrl = await this.stopRecordingAndGetUrl();
    const audioByteLength = this.lastRecordedBlob?.size ?? 0;
    const audioMetrics = await this.inspectRecordedAudio(this.lastRecordedBlob);

    // Check if the microphone actually received sound
    // Accept audio if hardware recorded bytes or audio context detected signal
    const actuallySpoke = (audioByteLength > 200 && durationMs > 150)
      || audioMetrics.peak > 0.001 || maxVolume > 0;

    this.stopHardware();
    this.isListening = false;

    if (!actuallySpoke) {
      // True silence or zero hardware signal
      const failPayload: StrictSpeechResult = {
        transcript: '',
        isFinal: true,
        confidence: 0,
        audioBlobUrl,
        audioBlob: this.lastRecordedBlob || undefined,
        audioByteLength,
        audioDurationMs: audioMetrics.durationMs,
        audioPeak: audioMetrics.peak,
        durationMs,
        averageVolume: avgVolume,
        volumeEnergyScore: avgVolume,
        error: 'No voice detected. Please speak closer to your microphone or check microphone permissions.'
      };
      this.emitFinalResult(failPayload);
      return;
    }

    // Audio was captured! Provide offline acoustic payload if speech recognition didn't return cloud text
    const acousticPayload: StrictSpeechResult = {
      transcript: '',
      isFinal: true,
      confidence: 0,
      audioBlobUrl,
      audioBlob: this.lastRecordedBlob || undefined,
      audioByteLength,
      audioDurationMs: audioMetrics.durationMs,
      audioPeak: audioMetrics.peak,
      durationMs,
      averageVolume: avgVolume,
      volumeEnergyScore: avgVolume,
      isOfflineAcoustic: true,
      transcriptionUnavailableReason: this.transcriptionUnavailableReason || 'The browser did not return a speech transcript for this recording.'
    };
    this.emitFinalResult(acousticPayload);
  }

  private clearRecognitionFallbackTimer() {
    if (this.recognitionFallbackTimer !== null) {
      window.clearTimeout(this.recognitionFallbackTimer);
      this.recognitionFallbackTimer = null;
    }
  }

  private emitFinalResult(result: StrictSpeechResult) {
    if (this.resultEmitted) return;
    this.resultEmitted = true;
    this.onFinalResult?.(result);
    this.onTranscriptChange?.(result);
  }

  private async inspectRecordedAudio(blob: Blob | null): Promise<{ durationMs?: number; peak: number }> {
    if (!blob) return { peak: 0 };

    let context: AudioContext | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return { peak: blob.size > 200 ? 0.02 : 0 };
      context = new AudioCtx();
      const audioBuffer = await context.decodeAudioData(await blob.arrayBuffer());
      let peak = 0;

      // Sampling every 32 frames is sufficient to detect actual audio without blocking the UI.
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const samples = audioBuffer.getChannelData(channel);
        for (let index = 0; index < samples.length; index += 32) {
          peak = Math.max(peak, Math.abs(samples[index]));
        }
      }

      return { durationMs: Math.round(audioBuffer.duration * 1000), peak };
    } catch (error) {
      // If WebM / codec decoding is not supported in this AudioContext (e.g. Safari / mobile),
      // detect voice from file size rather than claiming zero signal
      const fallbackPeak = blob.size > 200 ? 0.02 : 0;
      return { peak: fallbackPeak };
    } finally {
      if (context && context.state !== 'closed') {
        context.close().catch(() => {});
      }
    }
  }

  private stopRecordingAndGetUrl(): Promise<string | undefined> {
    if (this.recordingStopPromise) return this.recordingStopPromise;

    this.recordingStopPromise = new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(undefined);
        return;
      }

      const recorder = this.mediaRecorder;
      recorder.onstop = () => {
        if (this.recordedChunks.length > 0) {
          const blob = new Blob(this.recordedChunks, { type: this.recordingMimeType });
          this.lastRecordedBlob = blob;
          resolve(URL.createObjectURL(blob));
        } else {
          this.lastRecordedBlob = null;
          resolve(undefined);
        }
      };

      try {
        recorder.stop();
      } catch (e) {
        resolve(undefined);
      }
    });
    return this.recordingStopPromise;
  }

  private stopHardware() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) { }
      this.audioContext = null;
    }
    this.onVolumeChange?.(0);
  }

  public stop(errorReason?: string) {
    this.isListening = false;
    this.awaitingRecognitionFinal = false;
    this.clearRecognitionFallbackTimer();
    this.stopHardware();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) { }
    }
  }
}

export const strictSpeechService = new SpeechRecognitionService();
export const speechService = strictSpeechService;
export type SpeechResultPayload = StrictSpeechResult;
