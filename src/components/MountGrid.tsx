import React, { useId } from 'react';
import { Search } from 'lucide-react';
import type { MountDefinition } from '../types/mount';
import { MountAvatar } from './MountAvatar';
import { generacionesDe } from '../utils/mountCatalog';

interface Props {
  catalogo: MountDefinition[];
  /** Monturas visibles tras filtrar; las demás no se pintan */
  visibles: MountDefinition[];
  onSelect: (def: MountDefinition) => void;
  /** Aspecto de cada ficha según su estado (p. ej. apagada si no la tienes) */
  apagada?: (def: MountDefinition) => boolean;
  /** Distintivo en la esquina de la ficha */
  distintivo?: (def: MountDefinition) => React.ReactNode;
  /** Texto bajo el título de cada generación, p. ej. "3 de 10" */
  resumenGen?: (gen: number, defs: MountDefinition[]) => React.ReactNode;
  busqueda: string;
  onBusqueda: (q: string) => void;
  /** Controles extra junto al buscador (filtros) */
  extra?: React.ReactNode;
  vacio?: React.ReactNode;
}

/**
 * Todas las razas de una especie en una sola página, agrupadas por generación.
 * Una barra fija permite saltar a cada generación; en móvil sus botones bajan de línea, sin scroll horizontal.
 */
export const MountGrid: React.FC<Props> = ({
  catalogo,
  visibles,
  onSelect,
  apagada,
  distintivo,
  resumenGen,
  busqueda,
  onBusqueda,
  extra,
  vacio,
}) => {
  const uid = useId().replace(/:/g, '');
  const gens = generacionesDe(catalogo);
  const visiblesSet = new Set(visibles.map((v) => v.id));
  const grupos = gens
    .map((g) => ({ g, defs: catalogo.filter((d) => d.generation === g && visiblesSet.has(d.id)) }))
    .filter((x) => x.defs.length > 0);

  return (
    <div className="space-y-4">
      {/* Barra fija: buscador, filtros y saltos a cada generación */}
      <div className="sm:sticky top-0 z-20 -mx-1 px-1 pt-2 pb-2 bg-[#f6eed5]/95 backdrop-blur-sm space-y-2 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Buscar por nombre</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
              placeholder="Buscar por nombre, p. ej. esmeralda"
              className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border-2 border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500"
            />
          </label>
          {extra}
        </div>
        <nav aria-label="Ir a una generación" className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1">
          {gens.map((g) => {
            const hay = grupos.some((x) => x.g === g);
            return (
              <a
                key={g}
                href={`#${uid}-gen-${g}`}
                aria-disabled={!hay}
                className={`text-center min-w-[2.75rem] px-2 py-1.5 rounded-lg text-xs font-bold border ${
                  hay
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-blue-500'
                    : 'bg-transparent border-transparent text-slate-400 pointer-events-none'
                }`}
              >
                G{g}
              </a>
            );
          })}
        </nav>
      </div>

      {grupos.length === 0 && (vacio ?? <p className="text-sm text-slate-600 text-center py-10">Ninguna raza coincide con la búsqueda.</p>)}

      {grupos.map(({ g, defs }) => (
        <section key={g} id={`${uid}-gen-${g}`} aria-labelledby={`${uid}-t-${g}`} className="scroll-mt-4 sm:scroll-mt-32 space-y-2">
          <div className="flex items-baseline justify-between gap-2 border-b border-slate-200 pb-1">
            <h2 id={`${uid}-t-${g}`} className="text-lg text-slate-900">
              Generación {g}
            </h2>
            {resumenGen && <span className="text-xs font-semibold text-slate-600">{resumenGen(g, catalogo.filter((d) => d.generation === g))}</span>}
          </div>
          <ul className="grid grid-cols-3 min-[480px]:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
            {defs.map((def) => {
              const off = apagada?.(def) ?? false;
              return (
                <li key={def.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(def)}
                    className={`ficha-raza group relative w-full h-full flex flex-col items-center gap-1 p-2 pt-2.5 rounded-xl border-2 text-center hover:-translate-y-0.5 hover:border-blue-500 ${
                      off ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-300 shadow-[0_2px_0_#dfcb9f]'
                    }`}
                  >
                    <span className={off ? 'grayscale-[.7] opacity-60 group-hover:grayscale-0 group-hover:opacity-100' : ''}>
                      <MountAvatar species={def.species} breed={def.name} imageUrl={def.imageUrl} size="md" />
                    </span>
                    <span className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 ${off ? 'text-slate-600' : 'text-slate-900'}`}>
                      {def.name}
                    </span>
                    {distintivo && <span className="absolute top-1 right-1">{distintivo(def)}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};
