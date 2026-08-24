import React, { useEffect, useState } from 'react';
import { Calculator, Zap, Clock, Sparkles, Box, Info, CheckCircle2 } from 'lucide-react';
import { FUEL_TIERS, FUEL_VARIANTS, MAX_MOUNT_XP } from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';
import { calculateEnclosBatch, calculateFuelForXp } from '../utils/calculator';
import { db } from '../db/mountsDb';

export const FuelCalculator: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [selectedMountIds, setSelectedMountIds] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<FuelTier>(2);
  const [selectedVariant, setSelectedVariant] = useState<FuelVariant>('gigantesque');

  // Modo Manual
  const [manualXpNeeded, setManualXpNeeded] = useState<number>(MAX_MOUNT_XP);
  const [manualIsSage, setManualIsSage] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const all = await db.mounts.toArray();
      setMounts(all);

      // Revisar query params si viene con batch
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-slate-900 to-dofus-card p-6 rounded-2xl border border-dofus-border shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Calculadora de XP & Carburantes de Cercado</h1>
            <p className="text-xs text-slate-400">
              Cálculo exacto para la jauge de <strong>Mangeoire (Pesebre)</strong> en Dofus 3.5. Capacidad máxima 100.000 y meta nivel 200 (867.582 XP).
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Tiers y Estrategia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as FuelTier[]).map((tier) => {
          const info = FUEL_TIERS[tier];
          const isSelected = selectedTier === tier;
          return (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-dofus-card border-dofus-border hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  tier === 1 ? 'bg-purple-500/20 text-purple-300' :
                  tier === 2 ? 'bg-blue-500/20 text-blue-300' :
                  tier === 3 ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  Tier {tier}: {info.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">+{info.gainPer10s / 10} XP/s</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mb-1">
                Jauge: {info.rangeMin.toLocaleString()} - {info.rangeMax.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">
                Se vacía en: <strong>{Math.floor(info.drainDurationSeconds/3600)}h {Math.floor((info.drainDurationSeconds%3600)/60)}m</strong>
              </p>
            </button>
          );
        })}
      </div>

      {/* Selector de Variante de Carburante */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Variante del Carburante a Emplear</h3>
          <p className="text-xs text-slate-400">Define cuánta durabilidad aporta cada objeto de pesebre individual.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FUEL_VARIANTS) as FuelVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVariant(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedVariant === v
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {FUEL_VARIANTS[v].name} ({FUEL_VARIANTS[v].durability.toLocaleString()} dur.)
            </button>
          ))}
        </div>
      </div>

      {/* Lote de Cercado (Hasta 10 monturas simultáneas) */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-dofus-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-400" />
              Optimización de Cercado en Lote (1 a 10 Monturas)
            </h2>
            <p className="text-xs text-slate-400">
              En Dofus, el carburante se consume a velocidad fija haya 1 o 10 monturas. ¡Llena tu cercado para máxima eficiencia!
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
            {selectedMounts.length} / 10 Seleccionadas
          </span>
        </div>

        {/* Selector de monturas del inventario */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mounts.map((m) => {
            const isSelected = selectedMountIds.includes(m.id);
            const remaining = Math.max(0, MAX_MOUNT_XP - m.currentXp);
            return (
              <button
                key={m.id}
                onClick={() => toggleSelectMount(m.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-900/60 border-dofus-border hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <p className="font-bold text-xs truncate">{m.nickname}</p>
                  <p className="text-[10px] text-slate-400 truncate">{m.breed}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] flex justify-between">
                  <span>Niv. {m.currentLevel}</span>
                  <span className="text-amber-400">{remaining.toLocaleString()} XP</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Resultados del Lote */}
        {selectedMounts.length > 0 && (
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-amber-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Resultado para el Lote ({selectedMounts.length} monturas)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Tiempo Total de Cercado</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{batchResult.formattedTotalTime}</p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Carburantes {FUEL_VARIANTS[selectedVariant].name} requeridos</span>
                <p className="text-2xl font-black text-sky-400 mt-1">{batchResult.itemsNeeded} unidades</p>
                <p className="text-[11px] text-slate-400">({batchResult.totalFuelUnitsConsumed.toLocaleString()} durabilidad total)</p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Costo en Poussière d'élevage (Gigantesque)</span>
                <p className="text-2xl font-black text-purple-300 mt-1">{batchResult.dustCostTotal.toLocaleString()} ⚗️</p>
              </div>
            </div>

            {/* Desglose individual */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Desglose por montura:</h4>
              <div className="space-y-1.5">
                {batchResult.mountsBreakdown.map((item) => (
                  <div key={item.mount.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 text-xs">
                    <span className="font-bold text-white">{item.mount.nickname} ({item.mount.breed})</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-mono">{item.xpNeeded.toLocaleString()} XP restante</span>
                      <span className="text-amber-300 font-bold">{item.individualFormattedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculadora Manual Rápida */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Calculadora Manual Rápida</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">XP Faltante a Calcular</label>
            <input
              type="number"
              min={1}
              max={867582}
              value={manualXpNeeded}
              onChange={(e) => setManualXpNeeded(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-200">
              <input
                type="checkbox"
                checked={manualIsSage}
                onChange={(e) => setManualIsSage(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              <span>¿Tiene capacidad « Sage »? (XP x2)</span>
            </label>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-dofus-border flex flex-col justify-center">
            <span className="text-xs text-slate-400">Tiempo Requerido:</span>
            <p className="text-xl font-bold text-amber-400">{manualResult.formattedTime}</p>
            <p className="text-xs text-slate-400">{manualResult.itemsNeeded} carburantes {FUEL_VARIANTS[selectedVariant].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
