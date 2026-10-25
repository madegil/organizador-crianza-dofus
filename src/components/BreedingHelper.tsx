import React, { useEffect, useMemo, useState } from 'react';
import { IconMedallon } from './DofusIcons';
import type { MountDefinition, SpeciesType, UserMount } from '../types/mount';
import { getMountCrosses } from '../data/allMounts';
import { db } from '../db/mountsDb';
import { MountGrid } from './MountGrid';
import { MountDetailModal } from './MountDetailModal';
import { SpeciesTabs } from './SpeciesTabs';
import { CATALOGO_POR_ESPECIE, coincide, ejemplaresDe } from '../utils/mountCatalog';

/**
 * Cruces: todas las razas de una especie en una sola página, agrupadas por generación.
 * Al pulsar una raza se abre su ficha con los progenitores posibles, como el árbol genético del juego.
 */
export const BreedingHelper: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesType>('dragopavo');
  const [busqueda, setBusqueda] = useState('');
  const [abierta, setAbierta] = useState<MountDefinition | null>(null);
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);

  // Las monturas del establo solo sirven para marcar qué progenitores ya tienes
  useEffect(() => {
    db.mounts
      .toArray()
      .then(setUserMounts)
      .catch(() => setUserMounts([]));
  }, []);

  const catalogo = CATALOGO_POR_ESPECIE[species];
  const visibles = useMemo(() => catalogo.filter((d) => coincide(d, busqueda)), [catalogo, busqueda]);
  const tienes = (d: MountDefinition) => ejemplaresDe(userMounts, d).length > 0;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-3.5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconMedallon name="cruces" />
            <div>
              <h1 className="text-xl sm:text-2xl text-slate-900 leading-tight">Árbol de cruces</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-[60ch]">
                Pulsa una raza para ver qué parejas la dan. Desde ahí puedes saltar a cada progenitor y seguir el árbol hacia atrás.
              </p>
            </div>
          </div>
          <SpeciesTabs
            value={species}
            onChange={(s) => {
              setSpecies(s);
              setBusqueda('');
            }}
          />
        </div>

        <MountGrid
          catalogo={catalogo}
          visibles={visibles}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          onSelect={setAbierta}
          resumenGen={(g, defs) => (g === 1 ? 'Salvajes, se capturan' : `${defs.length} razas`)}
          distintivo={(d) => {
            const n = getMountCrosses(d).length;
            return (
              <span className="flex flex-col items-end gap-0.5">
                {n > 1 && (
                  <span className="text-[9px] font-extrabold px-1 rounded bg-blue-100 text-blue-900" title={`${n} parejas posibles`}>
                    {n} cruces
                  </span>
                )}
                {tienes(d) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="La tienes en tu establo" />
                )}
              </span>
            );
          }}
        />

        <p className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> La tienes en tu establo
        </p>
      </div>

      <MountDetailModal montura={abierta} onClose={() => setAbierta(null)} userMounts={userMounts} enfoque="cruces" />
    </div>
  );
};
