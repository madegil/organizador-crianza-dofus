import React, { useEffect, useState } from 'react';
import type { UserMount } from '../types/mount';
import { MountTable } from './MountTable';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Letrero de Madera Oficial 'Gestor de monturas' (Fiel a la estética del mockup) */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2 select-none">
        <div className="relative inline-flex flex-col items-center">
          {/* Hojas decorativas en la parte superior */}
          <span className="absolute -top-3 left-6 text-emerald-500 text-2xl filter drop-shadow">🍃</span>
          <span className="absolute -top-3 right-6 text-emerald-500 text-2xl transform scale-x-[-1] filter drop-shadow">🍃</span>

          {/* Sello de herradura central */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-amber-950 flex items-center justify-center shadow-md -mb-3.5 z-10">
            <span className="text-amber-950 text-base font-black">🐴</span>
          </div>

          {/* Tablón de madera texturizado */}
          <div className="bg-gradient-to-b from-[#5c3a21] via-[#432818] to-[#2e180d] border-[3.5px] border-[#241208] rounded-2xl px-8 sm:px-12 py-3 shadow-2xl shadow-black/70 relative min-w-[260px] sm:min-w-[300px]">
            {/* Clavos esquineros */}
            <div className="absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute bottom-2 left-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute bottom-2 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>

            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
                Gestor de
              </h1>
              <span className="block text-3xl sm:text-4xl font-black text-[#facc15] tracking-wide drop-shadow-[0_3px_5px_rgba(0,0,0,1)] leading-none mt-0.5">
                monturas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Principal: Acciones, Filtros y Lista de Monturas */}
      <MountTable mounts={mounts} onDataChanged={fetchMounts} />
    </div>
  );
};
