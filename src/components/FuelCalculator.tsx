import React, { useEffect, useMemo, useState, useId } from 'react';
import {
  Calculator,
  Clock,
  Gauge,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Hourglass,
  Fuel,
} from 'lucide-react';
import type { UserMount, SpecialCapacity } from '../types/mount';
import { db } from '../db/mountsDb';
import {
  FUEL_VARIANTS,
  TIER_DURATIONS,
  TIER_ITEM_RATES,
  calculateLevelFromXp,
  calculateXpForLevel,
  calculateTrainingTimeSeconds,
  formatDuration,
  MAX_MOUNT_XP,
  type FuelVariant,
  type FuelTier,
  type CalculationTarget,
  type TrainingStrategy,
} from '../data/fuelData';

export const FuelCalculator: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [selectedMount, setSelectedMount] = useState<UserMount | null>(null);

  // Estados de cálculo
  const [selectedVariant, setSelectedVariant] = useState<FuelVariant>('gigantesco');
  const [targetMode, setTargetMode] = useState<CalculationTarget>('nextLevel');
  const [customXp, setCustomXp] = useState<number | ''>(80000);
  const manualLabelId = useId();
  const [strategy, setStrategy] = useState<TrainingStrategy>('cascade');

  const [loadError, setLoadError] = useState(false);

  // Cargar monturas del establo
  useEffect(() => {
    const fetchMounts = async () => {
      try {
        setLoadError(false);
        const data = await db.mounts.toArray();
        setMounts(data);
        if (data.length > 0) {
          setSelectedMount(data[0]);
        }
      } catch (err) {
        console.error('Error al cargar monturas para la calculadora:', err);
        setLoadError(true);
      }
    };
    fetchMounts();
  }, []);

  // Valores calculados de la montura seleccionada
  const currentLvl = useMemo(() => {
    if (!selectedMount) return 1;
    if (selectedMount.currentXp >= MAX_MOUNT_XP) return 200;
    if (selectedMount.currentXp > 0) {
      return calculateLevelFromXp(selectedMount.currentXp);
    }
    return selectedMount.currentLevel || 1;
  }, [selectedMount]);

  const nextLevel = Math.min(200, currentLvl + 1);

  // XP restante para el objetivo seleccionado
  const xpNeeded = useMemo(() => {
    if (!selectedMount) return 0;
    const currentXp = selectedMount.currentXp || 0;

    switch (targetMode) {
      case 'nextLevel': {
        if (currentLvl >= 200) return 0;
        const targetXp = calculateXpForLevel(nextLevel);
        return Math.max(0, targetXp - currentXp);
      }
      case 'level200': {
        return Math.max(0, MAX_MOUNT_XP - currentXp);
      }
      case 'gauge200k': {
        return 200000;
      }
      case 'custom': {
        return typeof customXp === 'number' ? Math.max(0, customXp) : 0;
      }
      default:
        return 0;
    }
  }, [selectedMount, targetMode, currentLvl, nextLevel, customXp]);

  const isWise = selectedMount?.capacity === 'sabia';

  // Cálculos de tiempo según estrategia seleccionada
  const trainingSeconds = useMemo(() => {
    return calculateTrainingTimeSeconds(xpNeeded, strategy, isWise);
  }, [xpNeeded, strategy, isWise]);

  const durationFormatted = useMemo(() => {
    return formatDuration(trainingSeconds);
  }, [trainingSeconds]);

  // Fecha y hora estimada de finalización
  const completionDateText = useMemo(() => {
    if (trainingSeconds <= 0) return 'Inmediato (0 XP necesaria)';
    const date = new Date(Date.now() + trainingSeconds * 1000);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [trainingSeconds]);

  // Desglose de carburante por tramo (4, 3, 2, 1) según la variante elegida
  const variantInfo = FUEL_VARIANTS[selectedVariant];

  const tierBreakdowns = useMemo(() => {
    const tiers: FuelTier[] = [4, 3, 2, 1];
    return tiers.map((t) => {
      const durationSeconds = TIER_DURATIONS[t];
      const ratePerMinute = TIER_ITEM_RATES[t];
      const itemsNeeded = (durationSeconds / 60) * ratePerMinute;

      const tierNames: Record<FuelTier, string> = {
        4: 'Máxima Eficiencia',
        3: 'Alta Eficiencia',
        2: 'Media Eficiencia',
        1: 'Baja Eficiencia',
      };

      const rangeLabels: Record<FuelTier, string> = {
        4: '200k - 150k XP',
        3: '150k - 100k XP',
        2: '100k - 50k XP',
        1: '50k - 0 XP',
      };

      return {
        tier: t,
        tierName: tierNames[t],
        rangeLabel: rangeLabels[t],
        rateText: `${ratePerMinute} item/min (${t} XP/seg)`,
        itemsNeeded,
        itemName: variantInfo.itemName,
        drainDurationText: formatDuration(durationSeconds),
      };
    });
  }, [selectedVariant, variantInfo]);

  // Selección manual de montura desde la lista
  const handleSelectMount = (m: UserMount) => {
    setSelectedMount(m);
  };

  // Medidor actual: si estamos en modo manual usamos customXp, si es gauge200k 200k, si no min(xpNeeded, 200000)
  const gaugeDisplayXp =
    targetMode === 'gauge200k'
      ? 200000
      : targetMode === 'custom'
      ? typeof customXp === 'number'
        ? customXp
        : 0
      : Math.min(200000, xpNeeded);

  if (loadError) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-3 max-w-lg mx-auto my-12 text-rose-900 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto text-rose-600">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold">Error de almacenamiento local</h2>
        <p className="text-xs text-rose-700 leading-relaxed">
          No se pudo acceder a las monturas guardadas para la calculadora. Verifica que el almacenamiento local esté habilitado.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* TARJETA 1: SELECTOR DE MONTURA EN ESTABLO (ENMARCADO UNIFICADO) */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Calculadora de Carburante &amp; Tiempo de Pesebre
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Selecciona una montura para proyectar su tiempo de entrenamiento y gasto de combustible.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            {mounts.length} {mounts.length === 1 ? 'montura registrada' : 'monturas registradas'}
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
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={m.imageUrl || 'https://api.dofusdu.de/dofus2/img/mount/1.png'}
                    alt={m.breed}
                    className="w-8 h-8 object-contain rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
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
                    <span className="text-emerald-700 font-bold">¡Nvl 200!</span>
                  ) : (
                    <span className="text-slate-500 font-mono">
                      {m.currentXp.toLocaleString()} XP
                    </span>
                  )}
                </div>

                {m.capacity === 'sabia' && (
                  <span className="absolute top-1.5 right-1.5 text-[11px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                    ✨ Sabia
                  </span>
                )}
              </button>
            );
          })}

          {mounts.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <p className="text-xs font-bold">No hay monturas registradas en el Establo.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Añade monturas desde la pestaña "Establo" o importa tu inventario para calcularlas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* TARJETA 2: CONFIGURACIÓN DEL OBJETIVO Y RESULTADOS EN TIEMPO REAL */}
      {selectedMount && (
        <div className="bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xl space-y-6">
          {/* Header de la montura activa */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={selectedMount.imageUrl || 'https://api.dofusdu.de/dofus2/img/mount/1.png'}
                alt={selectedMount.breed}
                className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 leading-tight">
                    {selectedMount.nickname}
                  </h2>
                  <span className="text-xs font-bold text-slate-500">({selectedMount.breed})</span>
                  {isWise && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                      +20% XP (Sabia)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                  <span>Nivel actual: <strong className="text-slate-800">{currentLvl}</strong></span>
                  <span>XP actual: <strong className="text-slate-800 font-mono">{selectedMount.currentXp.toLocaleString()}</strong></span>
                </div>
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
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
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
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
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
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
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
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          {/* Barra Visual del Medidor de Carburante (0 a 200k) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-blue-600" />
                Medidor del Pesebre (Carburante XP)
              </span>
              <span className="text-[11px] font-mono text-slate-800 font-extrabold block">
                {gaugeDisplayXp.toLocaleString()} / 200.000 XP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Capacidad del medidor
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-[#1e3a8a] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, (gaugeDisplayXp / 200000) * 100))}%` }}
              ></div>
            </div>

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
                    className="flex-1 accent-[#1e3a8a]"
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
          </div>

          {/* ESTRATEGIA DE ENTRENAMIENTO Y TIEMPO RESULTANTE */}
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
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
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/30 text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
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
                        <span className="text-[11px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
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
                              type="button"
                              aria-pressed={isTierActive}
                              onClick={() => setStrategy(stratKey)}
                              className={`px-1.5 py-1 rounded-xl text-[11px] font-extrabold text-center transition flex flex-col items-center cursor-pointer ${
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

                {/* TARJETA DE TIEMPO CALCULADO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-gradient-to-br from-amber-50/70 to-orange-50/70 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Tiempo de Subida de Nivel
                        </span>
                        <span className="font-mono text-amber-800 font-bold text-[11px]">
                          {xpNeeded.toLocaleString()} XP
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-amber-950 mt-2 font-mono tracking-tight">
                        {durationFormatted}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center gap-1.5 text-xs text-amber-900 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>Termina: <strong className="text-amber-950 font-bold">{completionDateText}</strong></span>
                    </div>
                  </div>

                  {/* Resumen del Vaciado de Carburante */}
                  <div className="p-4 bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-2xl border border-blue-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                        <span className="flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          Vaciado del Carburante
                        </span>
                        <span className="font-mono text-blue-800 font-bold text-[11px]">
                          Autonomía Pesebre
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-mono tracking-tight">
                        {strategy === 'cascade'
                          ? '35h 39m 10s'
                          : strategy === 'tier4'
                          ? '3h 28m 20s'
                          : strategy === 'tier3'
                          ? '4h 37m 47s'
                          : strategy === 'tier2'
                          ? '6h 56m 40s'
                          : '13h 53m 20s'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-blue-200/60 text-xs text-slate-600 font-medium leading-relaxed">
                      {strategy === 'cascade' ? (
                        <span>Autonomía total llenando a 200k XP (125 peces grandes).</span>
                      ) : (
                        <span>Tiempo que tarda en consumirse el tramo de 50.000 XP seleccionado.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: GASTO DE CARBURANTE POR TRAMO */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-[#1e3a8a]" />
                      Gasto de Carburante por Tramo de Pesebre
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Elige el tipo de combustible para ver la cantidad de unidades necesarias por tramo de 50.000 XP.
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

                {/* Grid con las 4 tarjetas de nivel de carburante */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {tierBreakdowns.map((t) => {
                    const isThisTierSelected =
                      strategy === `tier${t.tier}` || (strategy === 'cascade' && true);

                    return (
                      <div
                        key={t.tier}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          isThisTierSelected
                            ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/20'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-extrabold ${
                                t.tier === 4
                                  ? 'text-purple-900'
                                  : t.tier === 3
                                  ? 'text-blue-900'
                                  : t.tier === 2
                                  ? 'text-emerald-900'
                                  : 'text-slate-900'
                              }`}
                            >
                              Nivel {t.tier} - {t.tierName}
                            </span>
                            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              {t.rangeLabel}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Consumo:</span>
                            <span className="font-mono font-bold text-slate-800">
                              {t.rateText}
                            </span>
                          </div>

                          <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                                🐟
                              </div>
                              <span className="text-xs font-semibold text-slate-700">
                                Total Tramo:
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-900 font-mono">
                                {t.itemsNeeded} {t.itemsNeeded === 1 ? 'unidad' : 'unidades'}
                              </p>
                              <span className="text-[11px] text-slate-500 truncate max-w-[160px] font-medium" title={t.itemName}>
                                {t.itemName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                          <span>Vaciado del tramo: <strong className="text-slate-700">{t.drainDurationText}</strong></span>
                          {isThisTierSelected && (
                            <span className="text-[#1e3a8a] font-extrabold flex items-center gap-1">
                              Activo
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
      )}
    </div>
  );
};
