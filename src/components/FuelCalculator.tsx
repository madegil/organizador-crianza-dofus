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
} from 'lucide-react';
import {
  FUEL_TIERS,
  FUEL_VARIANTS,
  FUEL_ITEM_NAMES,
  MAX_MOUNT_XP,
  MAX_ENCLOS_GAUGE,
  calculateLevelFromXp,
  calculateXpForLevel,
} from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';
import { calculateFuelBreakdown } from '../utils/calculator';
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

  // Cálculo principal de carburante y tiempo
  const breakdown = useMemo(() => {
    return calculateFuelBreakdown(xpNeeded, selectedVariant, isSage);
  }, [xpNeeded, selectedVariant, isSage]);

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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* 1. SECCIÓN SUPERIOR: ESTABLO DONDE EL USUARIO ESCOGE LA MONTURA */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dofus-border pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white">Establo de Monturas</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Selecciona una montura de tu establo para ver sus cálculos de nivel y carburante.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-mono">
            {mounts.length} {mounts.length === 1 ? 'ejemplar' : 'ejemplares'}
          </span>
        </div>

        {/* Cuadrícula interactiva del Establo */}
        {mounts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-3">
            <p className="text-sm">No tienes monturas registradas en tu establo aún.</p>
            <button
              onClick={loadMounts}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
            >
              Cargar monturas de prueba
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
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
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10 text-white'
                      : 'bg-slate-900/60 border-dofus-border hover:border-slate-600 text-slate-300'
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
                      <p className="font-black text-xs text-white truncate">{m.nickname}</p>
                      <p className="text-[10px] text-slate-400 truncate">{m.breed}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-300">
                      Nivel {lvl}
                    </span>
                    {isMax200 ? (
                      <span className="text-emerald-400 font-bold">200 ✓</span>
                    ) : (
                      <span className="text-amber-400 font-mono">
                        {m.currentXp.toLocaleString()} XP
                      </span>
                    )}
                  </div>

                  {m.capacity === 'sabia' && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      ✨ Sabia
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SECCIÓN INFERIOR: MEDIDOR XP [XP.PNG] (0-200.000) Y PANEL DE INFORMACIÓN */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-6">
        {/* Cabecera del cálculo para la montura activa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dofus-border pb-4">
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
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{selectedMount ? selectedMount.nickname : 'Montura'}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({selectedMount?.breed || 'Sin selección'})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Nivel actual: <strong className="text-amber-300 font-mono">{mountLevel}</strong> • Experiencia actual: <strong className="text-amber-300 font-mono">{currentMountXp.toLocaleString()} XP</strong>
              </p>
            </div>
          </div>

          {/* Selector de Objetivo de Subida */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-dofus-border">
            <button
              onClick={() => setTargetMode('nextLevel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetMode === 'nextLevel'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Siguiente Nivel ({nextLevel})
            </button>
            <button
              onClick={() => setTargetMode('gauge200k')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetMode === 'gauge200k'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Llenar Medidor (200k)
            </button>
            <button
              onClick={() => setTargetMode('level200')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetMode === 'level200'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Meta Nivel 200
            </button>
            <button
              onClick={() => setTargetMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetMode === 'custom'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: MEDIDOR A LA IZQUIERDA, INFORMACIÓN A LA DERECHA */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
          {/* MEDIDOR DE 0-200.000 XP SEGÚN XP.PNG / XP_Medidor.png (Ojo sin texto quemado en el medidor) */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <XpGauge currentXp={gaugeDisplayXp} maxGauge={MAX_ENCLOS_GAUGE} />
            <div className="text-center">
              <span className="text-[11px] font-mono text-amber-300 font-bold block">
                {gaugeDisplayXp.toLocaleString()} / 200.000 XP
              </span>
              <span className="text-[10px] text-slate-400">
                Capacidad del medidor
              </span>
            </div>
          </div>

          {/* INFORMACIÓN AL LADO DEL MEDIDOR */}
          <div className="flex-1 w-full space-y-4">
            {/* Input personalizado si está en modo Manual */}
            {targetMode === 'custom' && (
              <div className="p-3 bg-slate-900/80 rounded-xl border border-dofus-border">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                    className="flex-1 accent-amber-500"
                  />
                  <input
                    type="number"
                    min={1}
                    max={200000}
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="w-28 px-2 py-1 bg-slate-950 border border-dofus-border rounded-lg text-xs text-white font-mono text-right"
                  />
                </div>
              </div>
            )}

            {/* A. Casilla ¿Tiene capacidad « Sabia »? • XP x2 */}
            <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl bg-slate-900/90 border border-dofus-border hover:border-amber-500/50 transition select-none">
              <input
                type="checkbox"
                checked={isSage}
                onChange={(e) => setIsSage(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  ¿Tiene capacidad « Sabia »?
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  XP x2 • Tiempo a la mitad
                </span>
              </div>
            </label>

            {/* B. Tiempo que tarda en subir el nivel */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Tiempo que tarda en subir el nivel
                </span>
                <span className="font-mono text-amber-400/90">
                  {xpNeeded.toLocaleString()} XP a ganar
                </span>
              </div>

              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {breakdown.formattedTotalTime}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                {isSage ? (
                  <span className="text-purple-300 font-medium">
                    ✨ Velocidad duplicada por capacidad « Sabia » (~3.12 XP/s en pesebre).
                  </span>
                ) : (
                  <span>
                    Velocidad estándar de pesebre (~1.56 XP/s sin capacidad Sabia).
                  </span>
                )}
              </p>
            </div>

            {/* C. Cantidad de carburante a usar teniendo en cuenta sus limitantes */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Cantidad de carburante a usar (con limitantes de nivel)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Cada nivel del pesebre solo admite su tipo correspondiente de carburante.
                  </p>
                </div>

                {/* Selector de Variante */}
                <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-dofus-border">
                  {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                        selectedVariant === v
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {FUEL_VARIANTS[v].name} (+{FUEL_VARIANTS[v].durability / 1000}k)
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarjetas de los 4 Niveles de Carburante con sus Limitantes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {breakdown.tiers.map((t) => {
                  const hasUsage = t.itemsNeeded > 0;
                  return (
                    <div
                      key={t.tier}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-2 ${
                        hasUsage
                          ? 'bg-slate-900/90 border-slate-700 shadow-md text-white'
                          : 'bg-slate-900/30 border-slate-800/60 opacity-60 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            t.tier === 1 ? 'bg-purple-500/20 text-purple-300' :
                            t.tier === 2 ? 'bg-blue-500/20 text-blue-300' :
                            t.tier === 3 ? 'bg-amber-500/20 text-amber-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            Nivel {t.tier} - {t.tierName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t.rangeLabel}
                          </span>
                        </div>

                        <p className="text-sm sm:text-base font-black text-amber-300 font-mono mt-1">
                          {t.itemsNeeded} {t.itemsNeeded === 1 ? 'unidad' : 'unidades'}
                        </p>

                        <p className="text-[11px] text-slate-300 font-medium mt-0.5 line-clamp-1" title={t.itemName}>
                          {t.itemName} (+{t.variantValue.toLocaleString()} XP)
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                        <span>XP: {t.xpNeeded.toLocaleString()}</span>
                        <span>Vaciado: {t.drainDurationText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen total de unidades */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-dofus-border flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Total de carburantes requeridos:
                </span>
                <span className="font-mono font-black text-amber-400 text-sm">
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
