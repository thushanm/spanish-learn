import React from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { DIALOGUE_SCENARIOS } from '../data/dialogues';
import {
  Smile,
  Clock,
  Utensils,
  Compass,
  Sun,
  BookOpen,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  Mic,
  Award,
  Volume2
} from 'lucide-react';
import { playClickSound, playLevelCompleteFanfare } from '../utils/soundEffects';
import { speakSpanish } from '../utils/speech';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smile: <Smile className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Utensils: <Utensils className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Sun: <Sun className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />
};

export const RoadmapView: React.FC = () => {
  const { stats, setSelectedUnitId, setActiveTab } = useApp();

  const handleStartUnit = (unitId: string) => {
    playClickSound(stats.soundEnabled);
    setSelectedUnitId(unitId);
    setActiveTab('practice');
  };

  const handleStartDialogue = (dialogueId: string) => {
    playClickSound(stats.soundEnabled);
    setActiveTab('dialogue');
  };

  const previewAudio = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakSpanish(text, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900/60 via-slate-900 to-amber-950/40 border border-rose-500/30 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <span>🇪🇸 Academia de Pronunciación Española</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Habla Español con Fluidez y Confianza Natural
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Entrena tu pronunciación con reconocimiento de voz en tiempo real, diálogos interactivos y guías fonéticas desde nivel <strong className="text-amber-400">Principiante (A1)</strong> hasta <strong className="text-emerald-400">Intermedio Fluido (B2)</strong>.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Frases practicadas</span>
              <p className="text-xl font-black text-rose-400">{stats.wordsPracticedCount}</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Precisión media</span>
              <p className="text-xl font-black text-emerald-400">{stats.averageAccuracy}%</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Unidades logradas</span>
              <p className="text-xl font-black text-amber-400">{stats.completedUnits.length} / {SPANISH_UNITS.length}</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Nivel actual</span>
              <p className="text-xl font-black text-indigo-400">A1 - B2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Levels Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Mapa de Aprendizaje por Niveles</h2>
            <p className="text-sm text-slate-400">Elige una unidad para comenzar la práctica hablada con micrófono</p>
          </div>
          <button
            onClick={() => {
              playLevelCompleteFanfare(stats.soundEnabled);
              handleStartUnit(SPANISH_UNITS[0].id);
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all hover:scale-105"
          >
            <Mic className="w-4 h-4" />
            <span>Práctica Inmediata</span>
          </button>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SPANISH_UNITS.map((unit, index) => {
            const isCompleted = stats.completedUnits.includes(unit.id);
            const levelBadgeColor =
              unit.level === 'A1'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : unit.level === 'A2'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : unit.level === 'B1'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

            return (
              <div
                key={unit.id}
                onClick={() => handleStartUnit(unit.id)}
                className={`relative group p-6 rounded-3xl bg-slate-900/90 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10'
                }`}
              >
                {/* Background Subtle Gradient Glow */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${unit.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                      >
                        {ICON_MAP[unit.iconName] || <Smile className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${levelBadgeColor}`}>
                            {unit.level}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Unidad {index + 1}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                          {unit.title}
                        </h3>
                      </div>
                    </div>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-semibold">{unit.subtitle}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>

                  {/* Sample Phrases Mini Preview */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Muestra de frases:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {unit.items.slice(0, 2).map((item) => (
                        <button
                          key={item.id}
                          onClick={(e) => previewAudio(item.spanish, e)}
                          title="Haz clic para escuchar pronunciación de muestra"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[11px] text-slate-200 border border-slate-700/50 group/item transition-colors"
                        >
                          <Volume2 className="w-3 h-3 text-rose-400 group-hover/item:scale-110" />
                          <span>{item.spanish}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{unit.items.length} Frases & Audios</span>
                  <div className="flex items-center gap-1 text-rose-400 group-hover:translate-x-1 transition-transform">
                    <span>Entrenar Voz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Dialogue Scenarios Preview Section */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🎭 Conversaciones de la Vida Real</span>
            </div>
            <h2 className="text-2xl font-black text-white">Escenarios de Diálogo Spoken</h2>
            <p className="text-sm text-slate-400">
              Habla directamente con personajes IA en cafeterías, hoteles y calles de España y Latinoamérica
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dialogue')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIALOGUE_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => handleStartDialogue(scenario.id)}
              className="p-5 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-3">{scenario.partnerAvatar}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {scenario.level}
              </span>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                {scenario.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {scenario.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{scenario.partnerName}</span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  Hablar →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
