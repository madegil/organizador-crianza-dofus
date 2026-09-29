import React, { useState } from 'react';
import { GitFork } from 'lucide-react';
import type { SpeciesType } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { ALL_MOUNTS_DATA } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';

export const BreedingHelper: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesType>('dragopavo');

  const catalog =
    species === 'dragopavo'
      ? DRAGODINDES_DATA
      : species === 'muluaga'
      ? MULDOS_DATA
      : VOLKORNES_DATA;

  const getParentName = (parentId: string) => {
    const parent = ALL_MOUNTS_DATA.find((m) => m.id === parentId);
    return parent ? parent.name : parentId;
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 sm:space-y-6">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <GitFork className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Árbol de Cruces &amp; Guía de Hibridaciones
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Consulta cómo obtener cada generación a partir de cruces según Dofus 3.5.
              </p>
            </div>
          </div>
        </div>

        {/* Catálogo de Cruces */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Catálogo Completo de Cruces ({catalog.length} Razas)
            </h2>
            {/* Pestañas simétricas en mobile, compactas en desktop */}
            <div className="grid grid-cols-3 w-full sm:w-auto sm:flex gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSpecies('dragopavo')}
                className={`py-1.5 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition text-center cursor-pointer ${
                  species === 'dragopavo'
                    ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                Dragopavos
              </button>
              <button
                onClick={() => setSpecies('muluaga')}
                className={`py-1.5 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition text-center cursor-pointer ${
                  species === 'muluaga'
                    ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                Mulaguas
              </button>
              <button
                onClick={() => setSpecies('vueloceronte')}
                className={`py-1.5 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition text-center cursor-pointer ${
                  species === 'vueloceronte'
                    ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                Vuelocerontes
              </button>
            </div>
          </div>

          {/* Grid responsivo adaptable: 1 col (mobile), 2 cols (tablet), 3 cols (desktop), 4 cols (wide) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {catalog.map((m) => (
              <div
                key={m.id}
                className="p-3 sm:p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition space-y-2.5 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <MountAvatar
                      species={species}
                      breed={m.name}
                      imageUrl={m.imageUrl}
                      size="sm"
                      generation={m.generation}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300/60 flex-shrink-0">
                          G{m.generation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {m.parents && (
                    <div className="p-2 bg-blue-50/90 border border-blue-200/80 rounded-xl text-blue-950 space-y-1">
                      <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider">
                        Cruce requerido:
                      </span>
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        <span className="font-extrabold text-[#1e3a8a] bg-white px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                          {getParentName(m.parents[0])}
                        </span>
                        <span className="text-slate-400 font-bold">×</span>
                        <span className="font-extrabold text-[#1e3a8a] bg-white px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                          {getParentName(m.parents[1])}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-0.5 font-medium">
                  {m.bonuses.map((b, idx) => (
                    <p key={idx} className="truncate">• {b}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
