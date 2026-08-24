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
  const fecondeMounts = mounts.filter((m) => m.fertility === 'feconde').length;
  const totalRemainingXp = needXpMounts.reduce((acc, m) => acc + Math.max(0, MAX_MOUNT_XP - m.currentXp), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dofus-card rounded-2xl border border-dofus-border p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monturas</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{totalMounts}</p>
          <p className="text-xs text-slate-400 mt-1">Registradas en tu establo</p>
        </div>

        <div className="bg-dofus-card rounded-2xl border border-dofus-border p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nivel 200 Alcanzado</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">{level200Mounts}</p>
          <p className="text-xs text-slate-400 mt-1">
            {totalMounts > 0 ? `${Math.round((level200Mounts / totalMounts) * 100)}% de tu inventario` : '0%'}
          </p>
        </div>

        <div className="bg-dofus-card rounded-2xl border border-dofus-border p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faltan por subir a 200</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-sky-400 mt-2">{needXpMounts.length}</p>
          <p className="text-xs text-slate-400 mt-1">Requieren pesebre / XP</p>
        </div>

        <div className="bg-dofus-card rounded-2xl border border-dofus-border p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">XP Total Faltante</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-300 mt-2 font-mono">{totalRemainingXp.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Para completar todo el establo</p>
        </div>
      </div>

      {/* Módulo de Excel & Importación */}
      <ExcelManager mounts={mounts} onDataChanged={fetchMounts} />

      {/* Tabla de Inventario de Monturas */}
      <MountTable mounts={mounts} onDataChanged={fetchMounts} />
    </div>
  );
};
