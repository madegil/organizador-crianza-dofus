import React, { useEffect, useMemo, useState, useId } from 'react';
import {
  Calculator,
  Clock,
  Sparkles,
  Box,
  CheckCircle2,
  Check,
  Zap,
  Layers,
  ArrowRight,
  Hourglass,
  Gauge,
  Flame,
} from 'lucide-react';
import {
  FUEL_TIERS,
  FUEL_VARIANTS,
  FUEL_ITEM_NAMES,
  MAX_MOUNT_XP,
  MAX_ENCLOS_GAUGE,
  TOTAL_CONTINUOUS_DRAIN_SECONDS,
  calculateLevelFromXp,
  calculateXpForLevel,
} from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';
import { calculateFuelBreakdown, type TrainingStrategy, formatDurationSpanish } from '../utils/calculator';
import { db, normalizeStoredMounts } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';
import { XpGauge } from './XpGauge';

type CalculationTarget = 'nextLevel' | 'gauge200k' | 'level200' | 'custom';

export const FuelCalculator: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMountId, setSelectedMountId] = useState<string | null>(null);

  // Opciones de cálculo
  const [isSage, setIsSage] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<FuelVariant>('gigantesco');
  const [targetMode, setTargetMode] = useState<CalculationTarget>('nextLevel');
  const [customXp, setCustomXp] = useState<number | ''>(80000);
  const manualLabelId = useId();
  const [strategy, setStrategy] = useState<TrainingStrategy>('cascade');

  const [loadError, setLoadError] = useState(false);

  // Cargar monturas de Dexie
  const loadMounts = async () => {
    setLoadError(false);
    try {
      await normalizeStoredMounts();
      const all = await db.mounts.toArray();
      setMounts(all);
      if (all.length > 0 && !selectedMountId) {
        setSelectedMountId(all[0].id);
        setIsSage(all[0].capacity === 'sabia');
      }
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMounts();
  }, []);

  // Montura actualmente seleccionada
  const selectedMount = useMemo(() => {
    return mounts.find((m) => m.id === selectedMountId) || mounts[0] || null;
  }, [mounts, selectedMountId]);

  // Al cambiar de montura, sincronizar estado de « Sabia » si corresponde
  const handleSelectMount = (mount: UserMount) => {
    setSelectedMountId(mount.id);
    setIsSage(mount.capacity === 'sabia');
  };

  // Calcular la XP objetivo según el modo
  const mountLevel = selectedMount
    ? selectedMount.currentXp >= MAX_MOUNT_XP
      ? 200
      : selectedMount.currentXp > 0
      ? calculateLevelFromXp(selectedMount.currentXp)
      : selectedMount.currentLevel || 1
    : 1;

  const currentMountXp = selectedMount ? selectedMount.currentXp : 0;
  const nextLevel = Math.min(200, mountLevel + 1);
  const nextLevelThreshold = calculateXpForLevel(nextLevel);
  const xpForNextLevel = Math.max(0, nextLevelThreshold - currentMountXp);
  const xpForLevel200 = Math.max(0, MAX_MOUNT_XP - currentMountXp);

  const parsedCustomXp = typeof customXp === 'number' ? customXp : 1000;

  const xpNeeded = useMemo(() => {
    if (!selectedMount) return 80000;
    switch (targetMode) {
      case 'nextLevel':
        return xpForNextLevel > 0 ? xpForNextLevel : 1000;
      case 'gauge200k':
        return MAX_ENCLOS_GAUGE;
      case 'level200':
        return xpForLevel200;
      case 'custom':
        return Math.min(MAX_MOUNT_XP, Math.max(1, parsedCustomXp));
      default:
        return xpForNextLevel;
    }
  }, [selectedMount, targetMode, xpForNextLevel, xpForLevel200, parsedCustomXp]);

  // Cálculo principal de carburante y tiempo considerando estrategia
  const breakdown = useMemo(() => {
    return calculateFuelBreakdown(xpNeeded, selectedVariant, isSage, strategy);
  }, [xpNeeded, selectedVariant, isSage, strategy]);

  // XP que se muestra en el medidor físico (tope 200.000)
  const gaugeDisplayXp = useMemo(() => {
    return Math.min(MAX_ENCLOS_GAUGE, xpNeeded);
  }, [xpNeeded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto my-12 text-rose-900">
        <p className="text-sm font-semibold">
          No se pudo acceder al almacenamiento local (¿modo privado o almacenamiento bloqueado?)
        </p>
        <button
          onClick={() => {
            setLoading(true);
            loadMounts();
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* 1. SECCIÓN SUPERIOR: ESTABLO DONDE EL USUARIO ESCOGE LA MONTURA */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 md:p-6 shadow-xl space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Calculadora de XP &amp; Carburantes
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Selecciona una montura de tu establo para simular consumo de carburante y tiempo en pesebre.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold px-3 py-1 bg-white text-slate-700 border border-slate-200 rounded-xl font-mono shadow-xs">
            {mounts.length} {mounts.length === 1 ? 'ejemplar' : 'ejemplares'}
          </span>
        </div>

        {/* Cuadrícula interactiva del Establo con estilo unificado al index */}
        <div role="group" aria-label="Monturas" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {mounts.map((m) => {
            const isSelected = selectedMount?.id === m.id;
            const lvl =
              m.currentXp >= MAX_MOUNT_XP
                ? 200
                : m.currentXp > 0
                ? calculateLevelFromXp(m.currentXp)
                : m.currentLevel || 1;
            const isMax200 = lvl >= 200 || m.currentXp >= MAX_MOUNT_XP;

            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectMount(m)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 shadow-sm hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MountAvatar
                    species={m.species}
                    breed={m.breed}
                    imageUrl={m.imageUrl}
                    size="sm"
                    generation={m.generation}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-slate-900 truncate">{m.nickname}</p>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{m.breed}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Nivel {lvl}
                  </span>
                  {isMax200 ? (
                    <span className="text-emerald-700 font-extrabold">200 ✓</span>
                  ) : (
                    <span className="text-amber-800 font-mono font-bold">
                      {m.currentXp.toLocaleString()} XP
                    </span>
                  )}
                </div>

                {m.capacity === 'sabia' && (
                  <span className="absolute top-1.5 right-1.5 text-[11px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                    ✨ Sabia
                  </span>
                )}

                {isSelected && (
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECCIÓN INFERIOR: MEDIDOR XP (0-200.000) Y PANEL DE INFORMACIÓN */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 sm:space-y-6">
        {/* Cabecera del cálculo para la montura activa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            {selectedMount && (
              <MountAvatar
                species={selectedMount.species}
                breed={selectedMount.breed}
                imageUrl={selectedMount.imageUrl}
                size="md"
                generation={selectedMount.generation}
              />
            )}
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{selectedMount ? selectedMount.nickname : 'Montura'}</span>
                <span className="text-xs font-semibold text-slate-500">
                  ({selectedMount?.breed || 'Sin selección'})
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Nivel actual: <strong className="text-amber-800 font-mono font-bold">{mountLevel}</strong> • Experiencia actual: <strong className="text-amber-800 font-mono font-bold">{currentMountXp.toLocaleString()} XP</strong>
              </p>
            </div>
          </div>

          {/* Selector de Objetivo de Subida (Estilo botones de index) */}
          <div role="group" aria-label="Objetivo de XP" className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              aria-pressed={targetMode === 'nextLevel'}
              onClick={() => setTargetMode('nextLevel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'nextLevel'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Siguiente Nivel ({nextLevel})
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'gauge200k'}
              onClick={() => setTargetMode('gauge200k')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'gauge200k'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Llenar Medidor (200k)
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'level200'}
              onClick={() => setTargetMode('level200')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'level200'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Meta Nivel 200
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'custom'}
              onClick={() => setTargetMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'custom'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: MEDIDOR A LA IZQUIERDA, INFORMACIÓN A LA DERECHA */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6">
          {/* MEDIDOR DE 0-200.000 XP */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <XpGauge currentXp={gaugeDisplayXp} maxGauge={MAX_ENCLOS_GAUGE} />
            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-800 font-extrabold block">
                {gaugeDisplayXp.toLocaleString()} / 200.000 XP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Capacidad del medidor
              </span>
            </div>
          </div>

          {/* INFORMACIÓN Y CONFIGURACIÓN */}
          <div className="flex-1 w-full space-y-4">
            {/* Input personalizado si está en modo Manual */}
            {targetMode === 'custom' && (
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <label id={manualLabelId} className="block text-xs font-bold text-slate-700">
                  XP a calcular en el medidor (1.000 a 200.000 XP):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    aria-labelledby={manualLabelId}
                    min={1000}
                    max={200000}
                    step={1000}
                    value={customXp === '' ? 1000 : customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    aria-labelledby={manualLabelId}
                    min={1000}
                    max={200000}
                    value={customXp}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setCustomXp('');
                      } else {
                        const num = Number(val);
                        setCustomXp(Math.min(200000, Math.max(1000, num)));
                      }
                    }}
                    className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* A. Casilla ¿Tiene capacidad « Sabia »? • XP x2 */}
            <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition select-none shadow-sm">
              <input
                type="checkbox"
                checked={isSage}
                onChange={(e) => setIsSage(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  ¿Tiene capacidad « Sabia »?
                </span>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  XP x2 • Carburante a la mitad
                </span>
              </div>
            </label>

            {/* B. Selector de Estrategia de Pesebre */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Estrategia de Entrenamiento en Pesebre
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  ¿Cómo mantienes el pesebre?
                </span>
              </div>

              <div role="group" aria-label="Estrategia" className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Opción 1: Vaciado Continuo Natural (Cascada 200k -> 0) */}
                <button
                  type="button"
                  aria-pressed={strategy === 'cascade'}
                  onClick={() => setStrategy('cascade')}
                  className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                    strategy === 'cascade'
                      ? 'bg-blue-50/80 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <Hourglass className={`w-4 h-4 mt-0.5 flex-shrink-0 ${strategy === 'cascade' ? 'text-[#1e3a8a]' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">Vaciado Natural Continuo</span>
                      <span className="text-[11px] px-1.5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold">Cascada</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight font-medium">
                      Llenas el pesebre y dejas que se vacíe solo (Nivel 4 → 3 → 2 → 1). Total: 35h 39m.
                    </p>
                  </div>
                </button>

                {/* Opción 2: Mantener Nivel Fijo (Siempre el mismo tramo) */}
                <div
                  className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2 ${
                    strategy !== 'cascade'
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`w-4 h-4 ${strategy !== 'cascade' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-extrabold text-slate-900">Mantener Nivel Fijo</span>
                      </div>
                      <span className="text-[11px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Ritmo Constante
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">
                      Recargas constantemente para que nunca baje del nivel seleccionado:
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {([4, 3, 2, 1] as FuelTier[]).map((t) => {
                      const stratKey = `tier${t}` as TrainingStrategy;
                      const isTierActive = strategy === stratKey;
                      const info = FUEL_TIERS[t];
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={isTierActive}
                          onClick={() => setStrategy(stratKey)}
                          className={`px-1.5 py-1 rounded-xl text-[11px] font-extrabold text-center transition flex flex-col items-center cursor-pointer ${
                            isTierActive
                              ? 'bg-[#1e3a8a] text-white shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span className="truncate">Nvl {t}</span>
                          <span className="text-[9px] opacity-80 font-mono">
                            {isSage ? `${(info.gainPer10s! / 10) * 2} XP/s` : `${info.gainPer10s! / 10} XP/s`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* C. Paneles de Resultados Clave: Tiempo de Montura vs Tiempo de Pesebre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Tarjeta 1: Tiempo que tarda la montura en ganar la XP */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-0.5">
                  <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Tiempo de Subida de Nivel
                  </span>
                  <span className="font-mono text-amber-800 font-bold text-[11px]">
                    {xpNeeded.toLocaleString()} XP
                  </span>
                </div>

                <p className="text-xl sm:text-2xl font-black text-amber-900 font-mono tracking-tight">
                  {breakdown.formattedMountTrainingTime}
                </p>

                <p className="text-[11px] text-slate-600 font-medium">
                  {isSage ? (
                    <span className="text-purple-700 font-bold">
                      ✨ Capacidad Sabia activa: recibiendo el doble de experiencia por segundo ({breakdown.effectiveRatePerSec.toFixed(2)} XP/s).
                    </span>
                  ) : (
                    <span>
                      Velocidad media efectiva: <strong className="text-slate-800">{breakdown.effectiveRatePerSec.toFixed(2)} XP/s</strong>.
                    </span>
                  )}
                </p>
              </div>

              {/* Tarjeta 2: Tiempo de vaciado del carburante / autonomía */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-0.5">
                  <span className="font-extrabold text-[#1e3a8a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Gauge className="w-4 h-4 text-blue-600" />
                    Vaciado del Carburante
                  </span>
                  <span className="font-mono text-blue-800 font-bold text-[11px]">
                    Autonomía Pesebre
                  </span>
                </div>

                <p className="text-xl sm:text-2xl font-black text-[#1e3a8a] font-mono tracking-tight">
                  {breakdown.formattedFuelDrainTime}
                </p>

                <p className="text-[11px] text-slate-600 font-medium">
                  {strategy === 'cascade' ? (
                    <span>
                      Vaciado completo del depósito desde 200.000 XP hasta 0: <strong className="text-slate-800">{breakdown.formattedFullCascadeDrainTime}</strong>.
                    </span>
                  ) : (
                    <span>
                      Autonomía máxima del tramo {strategy.toUpperCase()}: <strong className="text-slate-800">{breakdown.formattedFuelDrainTime}</strong>.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* D. Panel de Consumo de Carburantes */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-500" />
                    Carburante Recomendado para el Objetivo
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Total necesario: <strong className="text-slate-800 font-bold font-mono">{breakdown.totalDurabilityNeeded.toLocaleString()} durabilidad</strong> ({breakdown.totalItemsNeeded} {breakdown.totalItemsNeeded === 1 ? 'unidad' : 'unidades'})
                  </p>
                </div>

                <div role="group" aria-label="Variante de combustible" className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={selectedVariant === v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedVariant === v
                          ? 'bg-[#1e3a8a] text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      {FUEL_VARIANTS[v].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tramos 4, 3, 2 y 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {breakdown.tiers.map((t) => {
                  const isThisTierSelected = strategy === `tier${t.tier}`;
                  return (
                    <div
                      key={t.tier}
                      className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                        isThisTierSelected
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                          : t.itemsNeeded > 0
                          ? 'bg-slate-50/80 border-slate-200/90'
                          : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-extrabold ${
                              t.tier === 4
                                ? 'text-rose-700'
                                : t.tier === 3
                                ? 'text-amber-700'
                                : t.tier === 2
                                ? 'text-blue-700'
                                : 'text-purple-700'
                            }`}
                          >
                            Nivel {t.tier} - {t.tierName}
                          </span>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                            {t.rangeLabel}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-1">
                          <span>Velocidad:</span>
                          <span className="font-mono font-bold text-slate-800">
                            +{t.effectiveXpPerSec} XP/s
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>Durabilidad:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {t.durabilityNeeded.toLocaleString()} pts
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-900 font-mono">
                            {t.itemsNeeded} {t.itemsNeeded === 1 ? 'unidad' : 'unidades'}
                          </p>
                          <span className="text-[11px] text-slate-500 truncate max-w-[160px] font-medium" title={t.itemName}>
                            {t.itemName}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                        <span>Vaciado del tramo: <strong className="text-slate-700">{t.drainDurationText}</strong></span>
                        {isThisTierSelected && (
                          <span className="text-[#1e3a8a] font-extrabold flex items-center gap-1">
                            Fijo ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
