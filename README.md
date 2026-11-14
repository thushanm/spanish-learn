# JTM Spanish Learn 🇪🇸🧠
### Cognitive Spanish Neuro-Immersion Web Application (A1 – B2)

**JTM Spanish Learn** is a modern, high-dopamine spoken Spanish acquisition platform built around cognitive science principles (Spaced Repetition, Phonemic Auditory Mirroring, and Strict Acoustic Evaluation). Designed to take learners from **Absolute Beginner (A1)** to **Conversational Fluency (B2)** with English instruction.

---

## ✨ Core Workspaces

### 1. 🧠 Synapse Map
- Complete 12-unit CEFR roadmap spanning foundational greetings to advanced native idioms and conversational cinema modules (*La Casa de Papel / Money Heist*, *Coco*, *El Laberinto del Fauno*, *Élite*).
- 5,000 High-Frequency Core Reflex Anchors with creative mnemonics and cultural contexts.
- Auto-advancing learning flow with integrated Spaced Repetition Reinforcement Queue.

### 2. 🧩 Syntax Architecture Builder
- Hands-on tactile grammar reconstruction puzzles.
- Interactive token assembling for sentence order, gender concordances, and reflexive patterns.

### 3. 📖 Lexicon & Memory Anchors
- Searchable database of 5,000+ words and core phrases.
- Creative English mnemonic hooks and native audio playback (1.0x & 0.75x slow syllables).

### 4. 📊 Cognitive Performance Analysis
- Real-time tracking of **Words Mastered**, **Mistakes Queue**, and **Average Retention Index**.
- Daily Spaced Repetition Accuracy progression chart.
- **Mistake Review Clinic** with one-click phonetic audio playback and mastery clearance.
- Progress Reset mechanism.

---

## 🎙️ Strict Zero-Cheating Acoustic Speech Recognition

- **Dual-Engine Voice Studio**:
  - Direct hardware waveform analysis via Web Audio API (`AudioContext` & time-domain energy).
  - Web Speech API integration with resilient offline acoustic fallback.
  - Optional Whisper AI transcription powered by Free Groq / Meta Llama 3 models.
  - Side-by-side recording playback: Compare your microphone recording directly against native speaker reference audio.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Local Development
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/spanish-fluent-voice.git
cd spanish-fluent-voice

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Automatic GitHub Pages Deployment

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To activate automatic hosting on GitHub Pages:
1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Every push to the `main` branch will automatically build and publish the live web app!

---

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Animation**: Canvas Confetti, Tailwind Animations
- **Audio & Speech**: Web Audio API, Web Speech API, MediaRecorder
