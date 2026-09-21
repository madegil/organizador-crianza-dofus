import React, { useEffect, useMemo, useState } from 'react';
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
import { db, initSeedDataIfEmpty } from '../db/mountsDb';
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
  const [customXp, setCustomXp] = useState<number>(80000);
  const [strategy, setStrategy] = useState<TrainingStrategy>('cascade');

  // Cargar monturas de Dexie
  const loadMounts = async () => {
    await initSeedDataIfEmpty();
    const all = await db.mounts.toArray();
    setMounts(all);
    if (all.length > 0 && !selectedMountId) {
      setSelectedMountId(all[0].id);
      setIsSage(all[0].capacity === 'sabia');
    }
    setLoading(false);
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
        return Math.min(MAX_MOUNT_XP, Math.max(1, customXp));
      default:
        return xpForNextLevel;
    }
  }, [selectedMount, targetMode, xpForNextLevel, xpForLevel200, customXp]);

  // Cálculo principal de carburante y tiempo diferenciando vaciado vs subida de montura
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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      {/* 1. SECCIÓN SUPERIOR: ESTABLO DONDE EL USUARIO ESCOGE LA MONTURA */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Establo de Monturas</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Selecciona una montura de tu establo para ver sus cálculos de nivel y carburante.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-mono">
            {mounts.length} {mounts.length === 1 ? 'ejemplar' : 'ejemplares'}
          </span>
        </div>

        {/* Cuadrícula interactiva del Establo con estilo unificado al index */}
        {mounts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-medium">No tienes monturas registradas en tu establo aún.</p>
            <button
              onClick={loadMounts}
              className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold rounded-xl text-xs transition shadow-sm"
            >
              Cargar monturas de prueba
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
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
                  onClick={() => handleSelectMount(m)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 shadow-sm hover:shadow-md cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/30 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
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
                      <p className="text-[10px] text-slate-500 truncate font-medium">{m.breed}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      Nivel {lvl}
                    </span>
                    {isMax200 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        200 ✓
                      </span>
                    ) : (
                      <span className="text-slate-700 font-mono font-bold">
                        {m.currentXp.toLocaleString()} XP
                      </span>
                    )}
                  </div>

                  {m.capacity === 'sabia' && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                      ✨ Sabia
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SECCIÓN INFERIOR: MEDIDOR XP Y PANEL DE INFORMACIÓN UNIFICADO */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 relative">
        {/* Cabecera del cálculo para la montura activa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
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
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{selectedMount ? selectedMount.nickname : 'Montura'}</span>
                <span className="text-xs font-medium text-slate-500">
                  ({selectedMount?.breed || 'Sin selección'})
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Nivel actual: <strong className="text-slate-900 font-mono">{mountLevel}</strong> • Experiencia actual: <strong className="text-slate-900 font-mono">{currentMountXp.toLocaleString()} XP</strong>
              </p>
            </div>
          </div>

          {/* Selector de Objetivo de Subida (Estilo botones de index) */}
          <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setTargetMode('nextLevel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'nextLevel'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Siguiente Nivel ({nextLevel})
            </button>
            <button
              onClick={() => setTargetMode('gauge200k')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'gauge200k'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Llenar Medidor (200k)
            </button>
            <button
              onClick={() => setTargetMode('level200')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'level200'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Meta Nivel 200
            </button>
            <button
              onClick={() => setTargetMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetMode === 'custom'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: MEDIDOR A LA IZQUIERDA, INFORMACIÓN A LA DERECHA */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* MEDIDOR DE 0-200.000 XP */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
            <XpGauge currentXp={gaugeDisplayXp} maxGauge={MAX_ENCLOS_GAUGE} />
            <div className="text-center pt-1">
              <span className="text-[11px] font-mono text-slate-800 font-extrabold block">
                {gaugeDisplayXp.toLocaleString()} / 200.000 XP
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Capacidad del medidor
              </span>
            </div>
          </div>

          {/* PANEL DE CÁLCULO ESTRATÉGICO Y CARBURANTES */}
          <div className="flex-1 w-full space-y-4">
            {/* Input personalizado si está en modo Manual */}
            {targetMode === 'custom' && (
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  XP a calcular en el medidor (1 a 200.000 XP):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1000}
                    max={200000}
                    step={1000}
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="flex-1 accent-[#1e3a8a]"
                  />
                  <input
                    type="number"
                    min={1}
                    max={200000}
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            )}

            {/* A. Casilla ¿Tiene capacidad « Sabia »? • XP x2 */}
            <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition select-none shadow-sm">
              <input
                type="checkbox"
                checked={isSage}
                onChange={(e) => setIsSage(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  ¿Tiene capacidad « Sabia »?
                </span>
                <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  XP x2 • Requiere mitad de tiempo y carburante
                </span>
              </div>
            </label>

            {/* B. SELECTOR DE ESTRATEGIA: MANTENER NIVEL FIJO VS VACIADO CONTINUO (CASCADA) */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Estrategia de Entrenamiento en Pesebre
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  ¿Cómo mantienes el pesebre?
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Opción 1: Vaciado Continuo Natural (Cascada 200k -> 0) */}
                <button
                  onClick={() => setStrategy('cascade')}
                  className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                    strategy === 'cascade'
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/30 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Hourglass className={`w-4 h-4 mt-0.5 flex-shrink-0 ${strategy === 'cascade' ? 'text-[#1e3a8a]' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">Vaciado Natural Continuo</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 font-mono font-bold">Cascada</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">
                      Llenas el pesebre y dejas que se vacíe solo (Nivel 4 → 3 → 2 → 1). Total: 35h 39m.
                    </p>
                  </div>
                </button>

                {/* Opción 2: Mantener Nivel Fijo (Optimización activa) */}
                <div
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    strategy !== 'cascade'
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/30 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Flame className={`w-4 h-4 ${strategy !== 'cascade' ? 'text-amber-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-extrabold text-slate-900">Mantener Nivel Fijo</span>
                    </div>
                    <span className="text-[9px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Ritmo Constante
                    </span>
                  </div>

                  {/* Sub-selector de Nivel 4, 3, 2, 1 */}
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {([4, 3, 2, 1] as FuelTier[]).map((t) => {
                      const stratKey: TrainingStrategy = t === 4 ? 'tier4' : t === 3 ? 'tier3' : t === 2 ? 'tier2' : 'tier1';
                      const isTierActive = strategy === stratKey;

                      return (
                        <button
                          key={t}
                          onClick={() => setStrategy(stratKey)}
                          className={`px-1.5 py-1 rounded-xl text-[10px] font-extrabold text-center transition flex flex-col items-center cursor-pointer ${
                            isTierActive
                              ? 'bg-[#1e3a8a] text-white shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>Nvl {t}</span>
                          <span className="text-[8px] opacity-75 font-mono">
                            {t === 4 ? '4 XP/s' : t === 3 ? '3 XP/s' : t === 2 ? '2 XP/s' : '1 XP/s'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* C. PANEL DUAL: TIEMPO PARA SUBIR LA MONTURA VS TIEMPO DE VACIADO DEL CARBURANTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tarjeta 1: Tiempo que tarda en subir el nivel la montura */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 via-amber-50/50 to-orange-50/30 border border-amber-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-900/80 mb-1">
                    <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Tiempo de Subida de Nivel
                    </span>
                    <span className="font-mono text-amber-800 font-bold text-[10px]">
                      {xpNeeded.toLocaleString()} XP
                    </span>
                  </div>

                  <p className="text-xl sm:text-2xl font-black text-amber-800 font-mono tracking-tight mt-1">
                    {breakdown.formattedMountTrainingTime}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 font-medium mt-2">
                  {strategy === 'cascade' ? (
                    <span>
                      Velocidad en cascada: {isSage ? '✨ 2x por Sabia (~2.0 - 8.0 XP/s)' : '1.0 - 4.0 XP/s promedio'}
                    </span>
                  ) : (
                    <span>
                      Velocidad fija ({strategy.toUpperCase()}):{' '}
                      <strong className="text-amber-900 font-mono">{breakdown.effectiveRatePerSec.toFixed(1)} XP/s</strong>{' '}
                      {isSage ? '✨ (Sabia x2)' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Tarjeta 2: Tiempo de vaciado físico del carburante (Autonomía del Pesebre) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-blue-50/50 to-indigo-50/30 border border-blue-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-blue-900/80 mb-1">
                    <span className="font-extrabold text-[#1e3a8a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      Vaciado del Carburante
                    </span>
                    <span className="font-mono text-blue-800 font-bold text-[10px]">
                      Autonomía Pesebre
                    </span>
                  </div>

                  <p className="text-xl sm:text-2xl font-black text-[#1e3a8a] font-mono tracking-tight mt-1">
                    {strategy === 'cascade' && xpNeeded >= MAX_ENCLOS_GAUGE
                      ? '35 h 39 min'
                      : breakdown.formattedFuelDrainTime}
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-900 font-medium mt-2">
                  {strategy === 'cascade' ? (
                    <span>
                      Vaciado continuo total del medidor (200k a 0): <strong className="text-[#1e3a8a] font-mono">35 h 39 min</strong>
                    </span>
                  ) : (
                    <span>
                      Duración del tramo de pesebre antes de recargar.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* D. COMPARATIVA POR NIVELES DE CARBURANTE Y SUS LIMITANTES */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Desglose por Nivel de Carburante y Velocidades
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Haz clic en un nivel para fijar su ritmo o visualiza su consumo independiente.
                  </p>
                </div>

                {/* Selector de Variante */}
                <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
                  {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                        selectedVariant === v
                          ? 'bg-[#1e3a8a] text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      {FUEL_VARIANTS[v].name} (+{FUEL_VARIANTS[v].durability / 1000}k)
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarjetas de los 4 Niveles de Carburante con estética unificada al index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {breakdown.tiers.map((t) => {
                  const stratKey: TrainingStrategy = t.tier === 4 ? 'tier4' : t.tier === 3 ? 'tier3' : t.tier === 2 ? 'tier2' : 'tier1';
                  const isThisTierSelected = strategy === stratKey;

                  return (
                    <div
                      key={t.tier}
                      onClick={() => setStrategy(stratKey)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 relative shadow-sm hover:shadow-md ${
                        isThisTierSelected
                          ? 'bg-blue-50/70 border-2 border-[#1e3a8a] ring-2 ring-blue-500/20 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-lg border ${
                              t.tier === 1
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : t.tier === 2
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : t.tier === 3
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                          >
                            Nivel {t.tier} - {t.tierName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold border border-slate-200">
                            {t.rangeLabel}
                          </span>
                        </div>

                        {/* Velocidad y Consumo */}
                        <div className="flex items-center justify-between text-xs mt-1.5">
                          <span className="text-slate-500 font-medium">
                            Baja: <strong className="text-slate-800 font-mono">{t.consumptionRatePer10s} / 10s</strong> ({t.baseXpPerSec} pts/s)
                          </span>
                          <span className="font-mono font-black text-[#1e3a8a]">
                            +{t.effectiveXpPerSec} XP/s {isSage ? '✨' : ''}
                          </span>
                        </div>

                        {/* Tiempo si se mantiene fijo */}
                        <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Tiempo si mantienes Nvl {t.tier}:</span>
                          <span className="font-mono font-bold text-amber-800">
                            {t.formattedTimeIfMaintained}
                          </span>
                        </div>

                        {/* Ítems para la estrategia activa */}
                        <div className="mt-2 flex items-baseline justify-between">
                          <p className="text-sm font-black text-slate-900 font-mono">
                            {t.itemsNeeded} {t.itemsNeeded === 1 ? 'unidad' : 'unidades'}
                          </p>
                          <span className="text-[10px] text-slate-500 truncate max-w-[160px] font-medium" title={t.itemName}>
                            {t.itemName}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
                        <span>Vaciado del tramo: <strong className="text-slate-700">{t.drainDurationText}</strong></span>
                        {isThisTierSelected && (
                          <span className="text-[#1e3a8a] font-extrabold flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Activo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen total de unidades de la estrategia activa */}
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="text-slate-700 font-bold">
                  Total de carburantes requeridos ({strategy === 'cascade' ? 'Modo Cascada' : `Manteniendo Nivel ${strategy.slice(-1)}`}):
                </span>
                <span className="font-mono font-black text-[#1e3a8a] text-sm sm:text-base">
                  {breakdown.totalItemsNeeded} {breakdown.totalItemsNeeded === 1 ? 'unidad' : 'unidades'} ({FUEL_VARIANTS[selectedVariant].name})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
