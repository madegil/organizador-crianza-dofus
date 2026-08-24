import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, Calculator, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import type { UserMount } from '../types/mount';
import { MAX_MOUNT_XP } from '../data/fuelData';
import { MountTable } from './MountTable';
import { ExcelManager } from './ExcelManager';
import { db, initSeedDataIfEmpty } from '../db/mountsDb';

export const Dashboard: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMounts = async () => {
    await initSeedDataIfEmpty();
    const all = await db.mounts.toArray();
    setMounts(all);
    setLoading(false);
  };

  useEffect(() => {
    fetchMounts();
  }, []);

  const totalMounts = mounts.length;
  const level200Mounts = mounts.filter((m) => m.currentLevel >= 200).length;
  const needXpMounts = mounts.filter((m) => m.currentLevel < 200);
  const totalRemainingXp = needXpMounts.reduce((acc, m) => acc + Math.max(0, MAX_MOUNT_XP - m.currentXp), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Tarjetas de Métricas Principales (2x2 en Móvil, 4 en Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monturas</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl sm:text-3xl font-black text-white">{totalMounts}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">En tu establo</p>
          </div>
        </div>

        <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Nivel 200</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl sm:text-3xl font-black text-emerald-400">{level200Mounts}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
              {totalMounts > 0 ? `${Math.round((level200Mounts / totalMounts) * 100)}% del total` : '0%'}
            </p>
          </div>
        </div>

        <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Faltan a 200</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl sm:text-3xl font-black text-sky-400">{needXpMounts.length}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Requieren XP</p>
          </div>
        </div>

        <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">XP Faltante</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-2xl font-black text-purple-300 font-mono truncate">{totalRemainingXp.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Total restante</p>
          </div>
        </div>
      </div>

      {/* Módulo de Excel & Importación */}
      <ExcelManager mounts={mounts} onDataChanged={fetchMounts} />

      {/* Tabla e Inventario de Monturas */}
      <MountTable mounts={mounts} onDataChanged={fetchMounts} />
    </div>
  );
};
