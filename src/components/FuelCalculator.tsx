import React, { useEffect, useState } from 'react';
import { Calculator, Zap, Clock, Sparkles, Box, Info, CheckCircle2 } from 'lucide-react';
import { FUEL_TIERS, FUEL_VARIANTS, MAX_MOUNT_XP } from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';
import { calculateEnclosBatch, calculateFuelForXp } from '../utils/calculator';
import { db } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';

export const FuelCalculator: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [selectedMountIds, setSelectedMountIds] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<FuelTier>(2);
  const [selectedVariant, setSelectedVariant] = useState<FuelVariant>('gigantesco');

  // Modo Manual
  const [manualXpNeeded, setManualXpNeeded] = useState<number>(MAX_MOUNT_XP);
  const [manualIsSage, setManualIsSage] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const all = await db.mounts.toArray();
      setMounts(all);

      const params = new URLSearchParams(window.location.search);
      const batchParam = params.get('batch');
      if (batchParam) {
        const ids = batchParam.split(',').filter(Boolean);
        setSelectedMountIds(ids.slice(0, 10));
      }
    };
    load();
  }, []);

  const selectedMounts = mounts.filter((m) => selectedMountIds.includes(m.id));
  const batchResult = calculateEnclosBatch(selectedMounts, selectedTier, selectedVariant);
  const manualResult = calculateFuelForXp(manualXpNeeded, selectedTier, selectedVariant, manualIsSage);

  const toggleSelectMount = (id: string) => {
    if (selectedMountIds.includes(id)) {
      setSelectedMountIds(selectedMountIds.filter((i) => i !== id));
    } else {
      if (selectedMountIds.length >= 10) {
        alert('El cercado permite un máximo de 10 monturas simultáneas.');
        return;
      }
      setSelectedMountIds([...selectedMountIds, id]);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-slate-900 to-dofus-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-dofus-border shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-black text-white">Calculadora de XP & Carburantes</h1>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Cálculo para el medidor de <strong>Pesebre</strong> en Dofus 3.5. Capacidad 100.000 y meta a nivel 200 (867.582 XP).
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Tiers (2x2 en Móvil, 4 en Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {([1, 2, 3, 4] as FuelTier[]).map((tier) => {
          const info = FUEL_TIERS[tier];
          const isSelected = selectedTier === tier;
          return (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-dofus-card border-dofus-border hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded ${
                    tier === 1 ? 'bg-purple-500/20 text-purple-300' :
                    tier === 2 ? 'bg-blue-500/20 text-blue-300' :
                    tier === 3 ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    Nivel {tier}: {info.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">+{info.gainPer10s / 10} XP/s</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-semibold mb-1 truncate">
                  {info.rangeMin.toLocaleString()} - {info.rangeMax.toLocaleString()}
                </p>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Vaciado: <strong>{Math.floor(info.drainDurationSeconds/3600)}h {Math.floor((info.drainDurationSeconds%3600)/60)}m</strong>
              </p>
            </button>
          );
        })}
      </div>

      {/* Selector de Variante de Carburante */}
      <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-5 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white">Variante del Carburante</h3>
          <p className="text-[11px] text-slate-400">Define cuánta durabilidad aporta cada objeto individual.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVariant(v)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedVariant === v
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{FUEL_VARIANTS[v].name}</span>
              <span className="text-[10px] opacity-75 font-normal">({FUEL_VARIANTS[v].durability.toLocaleString()} dur.)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lote de Cercado (Hasta 10 monturas simultáneas) */}
      <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dofus-border pb-3 sm:pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>Optimización de Cercado en Lote (1 a 10 Monturas)</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              El carburante se consume a velocidad fija haya 1 o 10 monturas. ¡Llena tu cercado para máxima eficiencia!
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] sm:text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
            {selectedMounts.length} / 10 Seleccionadas
          </span>
        </div>

        {/* Selector de monturas del inventario */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {mounts.map((m) => {
            const isSelected = selectedMountIds.includes(m.id);
            const remaining = Math.max(0, MAX_MOUNT_XP - m.currentXp);
            return (
              <button
                key={m.id}
                onClick={() => toggleSelectMount(m.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-900/60 border-dofus-border hover:border-slate-600 text-slate-300'
                }`}
              >
                <MountAvatar
                  species={m.species}
                  breed={m.breed}
                  imageUrl={m.imageUrl}
                  size="sm"
                  generation={m.generation}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs truncate">{m.nickname}</p>
                  <p className="text-[10px] text-amber-400 font-mono truncate">{remaining.toLocaleString()} XP</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Resultados del Lote */}
        {selectedMounts.length > 0 && (
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-amber-500/30 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>Resultado para el Lote ({selectedMounts.length} monturas)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-3.5 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] sm:text-xs text-slate-400">Tiempo Total de Cercado</span>
                <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1 font-mono">{batchResult.formattedTotalTime}</p>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] sm:text-xs text-slate-400">Carburantes ({FUEL_VARIANTS[selectedVariant].name})</span>
                <p className="text-xl sm:text-2xl font-black text-sky-400 mt-1">{batchResult.itemsNeeded} unidades</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{batchResult.totalFuelUnitsConsumed.toLocaleString()} durabilidad total</p>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] sm:text-xs text-slate-400">Costo en Polvo de Crianza</span>
                <p className="text-xl sm:text-2xl font-black text-purple-300 mt-1 font-mono">{batchResult.dustCostTotal.toLocaleString()} ⚗️</p>
              </div>
            </div>

            {/* Desglose individual */}
            <div className="mt-4">
              <h4 className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Desglose por montura:</h4>
              <div className="space-y-1.5">
                {batchResult.mountsBreakdown.map((item) => (
                  <div key={item.mount.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 text-xs">
                    <span className="font-bold text-white truncate max-w-[140px] sm:max-w-none">{item.mount.nickname} • {item.mount.breed}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">{item.xpNeeded.toLocaleString()} XP restante</span>
                      <span className="text-amber-300 font-bold font-mono">{item.individualFormattedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculadora Manual Rápida */}
      <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-white">Calculadora Manual Rápida</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">XP Faltante a Calcular</label>
            <input
              type="number"
              min={1}
              max={867582}
              value={manualXpNeeded}
              onChange={(e) => setManualXpNeeded(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex items-center pt-2 sm:pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-200">
              <input
                type="checkbox"
                checked={manualIsSage}
                onChange={(e) => setManualIsSage(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              <span>¿Tiene capacidad « Sabia »? • XP x2</span>
            </label>
          </div>

          <div className="bg-slate-900/90 p-3.5 sm:p-4 rounded-xl border border-dofus-border flex flex-col justify-center">
            <span className="text-[11px] text-slate-400">Tiempo Requerido:</span>
            <p className="text-lg sm:text-xl font-bold text-amber-400 font-mono">{manualResult.formattedTime}</p>
            <p className="text-[11px] text-slate-400">{manualResult.itemsNeeded} carburantes {FUEL_VARIANTS[selectedVariant].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
