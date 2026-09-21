import React, { useState } from 'react';
import { GitFork, Heart, Shield, Droplet, Sparkles } from 'lucide-react';
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
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <GitFork className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Árbol de Cruces & Guía de Hibridaciones
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Consulta cómo obtener cada generación a partir de los cruces de razas puras y combinadas según Dofus 3.5.
              </p>
            </div>
          </div>
        </div>

        {/* Reglas de Serenidad y Medidores (Tarjetas estilo index) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Guía de Medidores y Serenidad (-5.000 a +5.000)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Amor: Dragonalgas
                </span>
                <p className="text-xs text-rose-900 mt-1 font-bold">
                  Requiere Serenidad &gt; 0
                </p>
                <p className="text-[11px] text-rose-700/90 font-medium mt-0.5">
                  Entre 0 y 2.000, sube Amor y Madurez a la vez.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Resistencia: Fulminador
                </span>
                <p className="text-xs text-amber-900 mt-1 font-bold">
                  Requiere Serenidad &lt; 0
                </p>
                <p className="text-[11px] text-amber-700/90 font-medium mt-0.5">
                  Entre -2.000 y -1, sube Resistencia y Madurez.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5" /> Madurez: Abrevadero
                </span>
                <p className="text-xs text-sky-900 mt-1 font-bold">
                  Entre -2.000 y +2.000
                </p>
                <p className="text-[11px] text-sky-700/90 font-medium mt-0.5">
                  Zona neutra óptima para entrenar madurez.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Experiencia: Pesebre
                </span>
                <p className="text-xs text-purple-900 mt-1 font-bold">
                  Cualquier Serenidad
                </p>
                <p className="text-[11px] text-purple-700/90 font-medium mt-0.5">
                  Sube de nivel pasivamente a 200 en cualquier estado.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl text-[11px] sm:text-xs text-slate-600 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-medium">
            <span>• <strong className="text-slate-800 font-bold">Aporreador:</strong> Disminuye la serenidad hacia valores negativos</span>
            <span>• <strong className="text-slate-800 font-bold">Acariciador:</strong> Aumenta la serenidad hacia valores positivos</span>
          </div>
        </div>

        {/* Catálogo de Recetas de Cruce */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Catálogo Completo de Cruces ({catalog.length} Razas)
            </h2>
            <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setSpecies('dragopavo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  species === 'dragopavo'
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Dragopavos
              </button>
              <button
                onClick={() => setSpecies('muluaga')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  species === 'muluaga'
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Muluagas
              </button>
              <button
                onClick={() => setSpecies('vueloceronte')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  species === 'vueloceronte'
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Vuelocerontes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {catalog.map((m) => (
              <div
                key={m.id}
                className="p-3 sm:p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition space-y-2 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <MountAvatar
                    species={species}
                    breed={m.name}
                    imageUrl={m.imageUrl}
                    size="sm"
                    generation={m.generation}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300/60 flex-shrink-0">
                        Gen {m.generation}
                      </span>
                    </div>
                  </div>
                </div>

                {m.parents && (
                  <div className="p-2 bg-blue-50/80 border border-blue-200/80 rounded-xl text-[11px] text-blue-900">
                    <span className="font-medium text-slate-500 block text-[10px]">Cruce requerido:</span>
                    <span className="font-extrabold text-[#1e3a8a]">
                      {getParentName(m.parents[0])}
                    </span>
                    <span className="text-slate-500 font-bold mx-1">×</span>
                    <span className="font-extrabold text-[#1e3a8a]">
                      {getParentName(m.parents[1])}
                    </span>
                  </div>
                )}

                <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-0.5 font-medium">
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
