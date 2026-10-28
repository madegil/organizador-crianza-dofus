import React, { useEffect, useMemo, useState, useId } from 'react';
import { IconMedallon } from './DofusIcons';
import { EstadoVacio } from './EstadoVacio';
import { Clock, Check, Zap, Hourglass, Gauge, Flame } from 'lucide-react';
import {
  FUEL_VARIANTS,
  MAX_MOUNT_XP,
  MAX_ENCLOS_GAUGE,
  calculateLevelFromXp,
  calculateXpForLevel,
} from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';
import { calculateFuelBreakdown, type TrainingStrategy } from '../utils/calculator';
import { db, normalizeStoredMounts } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';
import { XpGauge } from './XpGauge';

type CalculationTarget = 'nextLevel' | 'gauge200k' | 'level200' | 'custom';

const TIER_NAMES: Record<FuelTier, string> = { 1: 'Extracto', 2: 'Filtro', 3: 'Poción', 4: 'Elixir' };

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
  const [includeBase, setIncludeBase] = useState<boolean>(true);

  const [loadError, setLoadError] = useState(false);
  const [showMaxLevel, setShowMaxLevel] = useState<boolean>(() => {
    try { return localStorage.getItem('dofus_calc_show_max') === 'true'; } catch { return false; }
  });
  const visibleMounts = useMemo(() => (showMaxLevel ? mounts : mounts.filter((m) => m.currentLevel < 200)), [mounts, showMaxLevel]);
  const maxLevelCount = useMemo(() => mounts.filter((m) => m.currentLevel >= 200).length, [mounts]);
  useEffect(() => {
    try { localStorage.setItem('dofus_calc_show_max', String(showMaxLevel)); } catch {}
  }, [showMaxLevel]);

  // Cargar monturas de Dexie
  const loadMounts = async () => {
    setLoadError(false);
    try {
      await normalizeStoredMounts();
      const all = await db.mounts.toArray();
      setMounts(all);
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
    return mounts.find((m) => m.id === selectedMountId) || null;
  }, [mounts, selectedMountId]);

  useEffect(() => {
    if (visibleMounts.length === 0) {
      if (selectedMountId !== null) setSelectedMountId(null);
      return;
    }
    const isCurrentHidden = selectedMount && !visibleMounts.some((m) => m.id === selectedMount.id);
    if (!selectedMount || isCurrentHidden) {
      const first = visibleMounts[0];
      setSelectedMountId(first.id);
      setIsSage(first.capacity === 'sabia');
    }
  }, [visibleMounts, selectedMount]);

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
    if (!selectedMount) return 0;
    switch (targetMode) {
      case 'nextLevel':
        return mountLevel >= 200 ? 0 : xpForNextLevel;
      case 'gauge200k':
        return MAX_ENCLOS_GAUGE;
      case 'level200':
        return xpForLevel200;
      case 'custom': {
        const val = customXp === '' ? 1000 : Number(customXp);
        return Math.min(200000, Math.max(1000, val));
      }
      default:
        return xpForNextLevel;
    }
  }, [selectedMount, targetMode, mountLevel, xpForNextLevel, xpForLevel200, customXp]);

  // Cálculo principal de carburante y tiempo diferenciando vaciado vs subida de montura
  const breakdown = useMemo(() => {
    return calculateFuelBreakdown(xpNeeded, selectedVariant, isSage, strategy, includeBase);
  }, [xpNeeded, selectedVariant, isSage, strategy, includeBase]);

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

  if (mounts.length === 0) {
    return (
      <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto my-8">
        <EstadoVacio titulo="Aún no hay monturas que calcular">
          Regístralas en{' '}
          <a href="/coleccion" className="text-blue-600 hover:text-blue-800 font-bold underline">
            Colección
          </a>{' '}
          o en{' '}
          <a href="/establo" className="text-blue-600 hover:text-blue-800 font-bold underline">
            Establo
          </a>
          .
        </EstadoVacio>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      {/* 1. SECCIÓN SUPERIOR: ESTABLO DONDE EL USUARIO ESCOGE LA MONTURA */}
      <div className="bg-slate-50 text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <IconMedallon name="calculadora" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Tus monturas</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Elige una montura para ver cuánto tiempo y carburante le faltan.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-mono">
            {mounts.length} {mounts.length === 1 ? 'ejemplar' : 'ejemplares'}
          </span>
        </div>

        {maxLevelCount > 0 && (
          <div className="flex items-center justify-end">
            <button type="button" role="switch" aria-checked={showMaxLevel} onClick={() => setShowMaxLevel((prev) => !prev)} className="h-11 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-2">
              Mostrar monturas nivel 200 ({maxLevelCount})
            </button>
          </div>
        )}

        {visibleMounts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-3">
            <p className="text-sm sm:text-base font-semibold text-slate-700">Todas tus monturas están en nivel 200. No necesitan más carburante.</p>
            <button type="button" onClick={() => setShowMaxLevel(true)} className="h-11 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition cursor-pointer">
              Mostrar monturas nivel 200
            </button>
          </div>
        ) : (
          <div role="group" aria-label="Monturas" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
            {visibleMounts.map((m) => {
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
                    <p className={`text-[11px] truncate font-medium ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>{m.breed}</p>
                    {m.capacity === 'sabia' && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                        <span aria-hidden="true">✨ </span>Sabia
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
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

                {isSelected && (
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center shadow-md">
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
      {selectedMount && (
        <div className="bg-slate-50 text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 relative">
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
          <div role="group" aria-label="Objetivo de XP" className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              aria-pressed={targetMode === 'nextLevel'}
              onClick={() => setTargetMode('nextLevel')}
              className={`min-h-[40px] sm:min-h-0 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold leading-tight transition cursor-pointer ${
                targetMode === 'nextLevel'
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Siguiente nivel ({nextLevel})
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'level200'}
              onClick={() => setTargetMode('level200')}
              className={`min-h-[40px] sm:min-h-0 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold leading-tight transition cursor-pointer ${
                targetMode === 'level200'
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Nivel 200
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'gauge200k'}
              onClick={() => setTargetMode('gauge200k')}
              title="Llenar el medidor completo (200.000 XP)"
              className={`min-h-[40px] sm:min-h-0 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold leading-tight transition cursor-pointer ${
                targetMode === 'gauge200k'
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Medidor completo
            </button>
            <button
              type="button"
              aria-pressed={targetMode === 'custom'}
              onClick={() => setTargetMode('custom')}
              title="Elegir manualmente cuánta XP cargar en el medidor"
              className={`min-h-[40px] sm:min-h-0 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold leading-tight transition cursor-pointer ${
                targetMode === 'custom'
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Medidor manual
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: MEDIDOR A LA IZQUIERDA, INFORMACIÓN A LA DERECHA */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* MEDIDOR DE 0-200.000 XP */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
            <XpGauge
              currentXp={gaugeDisplayXp}
              maxGauge={MAX_ENCLOS_GAUGE}
              tiers={[
                { name: 'Extracto', range: '0 – 80.000', upTo: 80000, color: strategy === 'tier1' ? 'bg-purple-700' : 'bg-purple-400', active: strategy === 'tier1' },
                { name: 'Filtro', range: '80.001 – 140.000', upTo: 140000, color: strategy === 'tier2' ? 'bg-blue-700' : 'bg-blue-400', active: strategy === 'tier2' },
                { name: 'Poción', range: '140.001 – 180.000', upTo: 180000, color: strategy === 'tier3' ? 'bg-amber-700' : 'bg-amber-400', active: strategy === 'tier3' },
                { name: 'Elixir', range: '180.001 – 200.000', upTo: 200000, color: strategy === 'tier4' ? 'bg-rose-700' : 'bg-rose-400', active: strategy === 'tier4' },
              ]}
            />
            <div className="text-center pt-1">
              <span className="text-[11px] font-mono text-slate-800 font-extrabold block">
                {gaugeDisplayXp.toLocaleString()} / 200.000 XP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Medidor de experiencia
              </span>
            </div>
          </div>

          {/* PANEL DE CÁLCULO ESTRATÉGICO Y CARBURANTES */}
          <div className="flex-1 w-full space-y-4">
            {targetMode === 'nextLevel' && mountLevel >= 200 ? (
              <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  Esta montura ya está en nivel 200
                </p>
              </div>
            ) : (
              <>
                {/* Input personalizado si está en modo Manual */}
                {targetMode === 'custom' && (
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <label id={manualLabelId} className="block text-xs font-bold text-slate-700">
                      Experiencia que quieres cargar (de 1.000 a 200.000):
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
                        className="flex-1 accent-blue-800"
                      />
                      <input
                        type="number"
                        aria-labelledby={manualLabelId}
                        min={1000}
                        max={200000}
                        value={customXp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomXp(val === '' ? '' : Number(val));
                        }}
                        onBlur={() => {
                          const val = customXp === '' ? 1000 : Number(customXp);
                          setCustomXp(Math.min(200000, Math.max(1000, val)));
                        }}
                        className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>
                )}

                {/* A. Casilla ¿Tiene la capacidad Sabia? • XP x2 */}
                <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition select-none shadow-sm">
                  <input
                    type="checkbox"
                    checked={isSage}
                    onChange={(e) => setIsSage(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      ¿Tiene la capacidad Sabia?
                    </span>
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Gana el doble: mitad de tiempo y de carburante
                    </span>
                  </div>
                </label>

                {/* B. SELECTOR DE ESTRATEGIA: MANTENER NIVEL FIJO VS VACIADO CONTINUO (CASCADA) */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-3">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                      Cómo recargas el medidor
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Elige una forma; los cálculos cambian con ella
                    </span>
                  </div>

                  <div role="group" aria-label="Forma de recarga" className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                    {/* Opción 1: Vaciado Continuo Natural (Cascada 200k -> 0) */}
                    <button
                      type="button"
                      aria-pressed={strategy === 'cascade'}
                      onClick={() => setStrategy('cascade')}
                      className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                        strategy === 'cascade'
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/30 text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Hourglass className={`w-4 h-4 mt-0.5 flex-shrink-0 ${strategy === 'cascade' ? 'text-blue-800' : 'text-slate-400'}`} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-900">Llenarlo y dejar que se vacíe</span>
                          <span className="text-[11px] px-1.5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold">Una carga</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-tight font-medium">
                          Lo llenas hasta 200.000 y se vacía solo, pasando de Elixir a Extracto. Tarda 35 h 39 min.
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
                          <span className="text-xs font-extrabold text-slate-900">Mantenerlo en un carburante</span>
                        </div>
                        <span className="text-[11px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Ritmo fijo
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
                              type="button"
                              aria-pressed={isTierActive}
                              onClick={() => setStrategy(stratKey)}
                              className={`px-1.5 py-1 rounded-xl text-[11px] font-extrabold text-center transition flex flex-col items-center cursor-pointer ${
                                isTierActive
                                  ? 'bg-blue-800 text-white shadow-sm'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span>{TIER_NAMES[t]}</span>
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
                        <span className="font-extrabold text-amber-900 flex items-center gap-1.5  text-[11px]">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Tiempo para subir
                        </span>
                        <span className="font-mono text-amber-800 font-bold text-[11px]">
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
                          Velocidad: {isSage ? 'de 2 a 8 XP/s (Sabia, x2)' : 'de 1 a 4 XP/s según el tramo'}
                        </span>
                      ) : (
                        <span>
                          Velocidad con {TIER_NAMES[Number(strategy.slice(-1)) as FuelTier]}:{' '}
                          <strong className="text-amber-900 font-mono">{breakdown.effectiveRatePerSec.toFixed(1)} XP/s</strong>{' '}
                          {isSage ? '(Sabia, x2)' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tarjeta 2: Tiempo de vaciado físico del carburante (Autonomía del medidor de experiencia) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-blue-50/50 to-blue-100/30 border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-blue-900/80 mb-1">
                        <span className="font-extrabold text-blue-800 flex items-center gap-1.5  text-[11px]">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          Duración del carburante
                        </span>
                        <span className="hidden sm:inline font-mono text-blue-800 font-bold text-[11px]">
                          Antes de recargar
                        </span>
                      </div>

                      <p className="text-xl sm:text-2xl font-black text-blue-800 font-mono tracking-tight mt-1">
                        {strategy === 'cascade' && xpNeeded >= MAX_ENCLOS_GAUGE
                          ? '35 h 39 min'
                          : breakdown.formattedFuelDrainTime}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-900 font-medium mt-2">
                      {strategy === 'cascade' ? (
                        <span>
                          Un medidor lleno tarda en vaciarse: <strong className="text-blue-900 font-mono">35 h 39 min</strong>
                        </span>
                      ) : (
                        <span>
                          Lo que dura el tramo elegido antes de tener que recargarlo.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* D. COMPARATIVA POR NIVELES DE CARBURANTE Y SUS LIMITANTES */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Carburante necesario por tipo
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Toca un carburante para mantener el medidor en su tramo y elige el tamaño que usas.
                      </p>
                    </div>

                    <div role="group" aria-label="Tamaño del carburante" className="grid grid-cols-6 sm:flex sm:items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto self-start sm:self-auto">
                      {/* Móvil: 3 arriba (2/6 cada uno) y 2 abajo (3/6 cada uno) */}
                      {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v, i) => (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={selectedVariant === v}
                          onClick={() => setSelectedVariant(v)}
                          className={`${i < 3 ? 'col-span-2' : 'col-span-3'} min-h-[40px] sm:min-h-0 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            selectedVariant === v
                              ? 'bg-blue-800 text-white'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                          }`}
                        >
                          {FUEL_VARIANTS[v].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tarjetas de los 4 Niveles de Carburante con estética Establo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {breakdown.tiers.map((t) => {
                      const stratKey: TrainingStrategy = t.tier === 4 ? 'tier4' : t.tier === 3 ? 'tier3' : t.tier === 2 ? 'tier2' : 'tier1';
                      const isThisTierSelected = strategy === stratKey;
                      const hasUsage = t.itemsNeeded > 0;

                      return (
                        <div
                          key={t.tier}
                          onClick={() => setStrategy(stratKey)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 relative ${
                            isThisTierSelected
                              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/30 text-slate-900 shadow-sm'
                              : hasUsage
                              ? 'bg-white border-slate-200 shadow-sm text-slate-800 hover:border-slate-300'
                              : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  t.tier === 1
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : t.tier === 2
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : t.tier === 3
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {t.tierName}
                              </span>
                              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                                {t.rangeLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">Carga del tramo: <strong className="text-slate-700 font-mono">{t.maxTierCapacity.toLocaleString()}</strong></p>

                            {/* Velocidad y Consumo */}
                            <div className="flex items-center justify-between text-xs mt-1.5">
                              <span className="text-slate-500 font-medium">
                                Gasta <strong className="text-slate-700 font-mono">{t.consumptionRatePer10s}</strong> cada 10 s
                              </span>
                              <span className="font-mono font-bold text-blue-800">
                                +{t.effectiveXpPerSec} XP/s {isSage ? '✨' : ''}
                              </span>
                            </div>

                            {/* Tiempo si se mantiene fijo */}
                            <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Tiempo si lo mantienes:</span>
                              <span className="font-mono font-bold text-amber-800">
                                {t.formattedTimeIfMaintained}
                              </span>
                            </div>

                            {/* Ítems para la estrategia activa */}
                            <div className="mt-2 flex items-baseline justify-between">
                              <p className="text-sm font-black text-slate-900 font-mono">
                                {t.itemsNeeded} {t.itemsNeeded === 1 ? 'unidad' : 'unidades'}
                              </p>
                              <span className="text-[11px] text-slate-500 truncate max-w-[160px] font-medium" title={t.itemName}>
                                {t.itemName}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                            <span>El tramo dura: <strong className="text-slate-700">{t.drainDurationText}</strong></span>
                            {isThisTierSelected && (
                              <span className="text-blue-800 font-extrabold flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" /> Activo
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {strategy !== 'cascade' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">Sumar el carburante para llenar los tramos de abajo</span>
                        <button type="button" role="switch" aria-checked={includeBase} onClick={() => setIncludeBase((prev) => !prev)} className={`h-11 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${includeBase ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                          {includeBase ? 'Sumado ✓' : 'Sin sumar'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                            <span className="text-xs font-bold text-slate-900">Llenado inicial (una vez)</span>
                            <span className="text-[11px] font-mono font-bold text-purple-700">{breakdown.baseUnitsTotal || 0} {(breakdown.baseUnitsTotal || 0) === 1 ? 'unidad' : 'unidades'}</span>
                          </div>
                          {(breakdown.baseUnitsTotal || 0) > 0 ? (
                            <div className="space-y-0.5 text-[11px] text-slate-700 font-medium">
                              {breakdown.tiers.filter((t) => (t.baseItems || 0) > 0).map((t) => (
                                <div key={t.tier} className="flex justify-between">
                                  <span>{t.tierName} ({t.rangeLabel}):</span>
                                  <strong className="font-mono">{t.baseItems} u.</strong>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic">No hace falta llenar tramos de abajo.</p>
                          )}
                          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">Llena los tramos de abajo una sola vez: mientras recargues el de arriba, no se gastan.</p>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                            <span className="text-xs font-bold text-slate-900">Recargas</span>
                            <span className="text-[11px] font-mono font-bold text-blue-700">{breakdown.maintenanceUnits || 0} {(breakdown.maintenanceUnits || 0) === 1 ? 'unidad' : 'unidades'}</span>
                          </div>
                          <div className="space-y-0.5 text-[11px] text-slate-700 font-medium">
                            <div className="flex justify-between">
                              <span>Recargas necesarias:</span>
                              <strong className="font-mono">{breakdown.refills || 0} {(breakdown.refills || 0) === 1 ? 'recarga' : 'recargas'}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Carburante:</span>
                              <strong className="font-mono">{breakdown.tiers.find(t => t.itemsNeeded > 0)?.tierName || 'Ninguno'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resumen total de unidades de la estrategia activa */}
                  <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-slate-700 font-bold">
                      Total de carburante ({strategy === 'cascade' ? 'una carga completa' : `manteniendo ${TIER_NAMES[Number(strategy.slice(-1)) as FuelTier]}`}):
                    </span>
                    <span className="font-mono font-black text-blue-800 text-sm sm:text-base">
                      {breakdown.totalItemsNeeded} {breakdown.totalItemsNeeded === 1 ? 'unidad' : 'unidades'} ({FUEL_VARIANTS[selectedVariant].name})
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
