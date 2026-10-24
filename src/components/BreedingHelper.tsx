import React, { useState } from 'react';
import { GitFork } from 'lucide-react';
import type { SpeciesType } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { ALL_MOUNTS_DATA } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';

// \u00AD = guion opcional: solo parte la palabra si no cabe (pantallas de ~320 px)
const SPECIES_OPTIONS: { key: SpeciesType; label: string }[] = [
  { key: 'dragopavo', label: 'Drago\u00ADpavos' },
  { key: 'muluaga', label: 'Mula\u00ADguas' },
  { key: 'vueloceronte', label: 'Vuelo\u00ADcerontes' },
];

export const BreedingHelper: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesType>('dragopavo');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');

  const catalog =
    species === 'dragopavo'
      ? DRAGODINDES_DATA
      : species === 'muluaga'
      ? MULDOS_DATA
      : VOLKORNES_DATA;

  const generations = Array.from(new Set(catalog.map((m) => m.generation))).sort((a, b) => a - b);
  const visibleCatalog =
    selectedGen === 'all' ? catalog : catalog.filter((m) => m.generation === selectedGen);

  const getParentName = (parentId: string) => {
    const parent = ALL_MOUNTS_DATA.find((m) => m.id === parentId);
    return parent ? parent.name : parentId;
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto sm:px-4 lg:px-6">
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3 sm:p-5 md:p-6 shadow-xl space-y-4 sm:space-y-6">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <GitFork className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
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
        <div className="sm:bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:p-5 sm:shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Catálogo Completo de Cruces ({catalog.length} Razas)
            </h2>
            {/* Pestañas simétricas en mobile, compactas en desktop */}
            <div role="group" aria-label="Especie" className="grid grid-cols-3 w-full sm:w-auto sm:flex gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
              {SPECIES_OPTIONS.map((opt) => {
                const isActive = species === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setSpecies(opt.key);
                      setSelectedGen('all');
                    }}
                    className={`min-h-[44px] sm:min-h-0 py-1.5 px-1.5 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition text-center leading-tight [hyphens:manual] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                      isActive
                        ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro por generación (desliza en horizontal en móvil) */}
          <div
            role="group"
            aria-label="Filtrar por generación"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
          >
            {(['all', ...generations] as (number | 'all')[]).map((g) => {
              const isActive = selectedGen === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedGen(g)}
                  title={g === 'all' ? undefined : `Generación ${g}`}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {g === 'all' ? 'Todas' : `G${g}`}
                </button>
              );
            })}
          </div>

          {/* Grid responsivo adaptable: 1 col (mobile), 2 cols (tablet), 3 cols (desktop), 4 cols (wide) */}
          <div
            role="list"
            aria-label={`Cruces${selectedGen === 'all' ? '' : ` de generación ${selectedGen}`}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3"
          >
            {visibleCatalog.map((m) => (
              <div
                key={m.id}
                role="listitem"
                className="p-3 sm:p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition space-y-2.5 hover:shadow-md flex flex-col justify-between"
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
                        <h3 className="font-extrabold text-xs text-slate-900 leading-snug">
                          {m.name}
                        </h3>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300/60 flex-shrink-0">
                          G{m.generation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {m.parents && (
                    <div className="p-2 bg-blue-50/90 border border-blue-200/80 rounded-xl text-blue-950 space-y-1">
                      <span className="font-semibold text-slate-600 block text-[11px] uppercase tracking-wider">
                        Cruce requerido:
                      </span>
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        <span className="font-extrabold text-[#1e3a8a] bg-white px-1.5 py-0.5 rounded-md border border-blue-200">
                          {getParentName(m.parents[0])}
                        </span>
                        <span className="text-slate-600 font-bold">×</span>
                        <span className="font-extrabold text-[#1e3a8a] bg-white px-1.5 py-0.5 rounded-md border border-blue-200">
                          {getParentName(m.parents[1])}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-0.5 font-medium">
                  {m.bonuses.map((b, idx) => (
                    <p key={idx}>• {b}</p>
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
