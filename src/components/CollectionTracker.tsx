import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Circle, Sparkles, Filter } from 'lucide-react';
import type { SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { db } from '../db/mountsDb';

export const CollectionTracker: React.FC = () => {
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('dragopavo');
  const [onlyMissing200, setOnlyMissing200] = useState<boolean>(false);

  useEffect(() => {
    db.mounts.toArray().then(setUserMounts);
  }, []);

  const catalog = activeSpecies === 'dragopavo' ? DRAGODINDES_DATA : activeSpecies === 'muluaga' ? MULDOS_DATA : VOLKORNES_DATA;

  const generations = [1,2,3,4,5,6,7,8,9,10];

  const totalSpeciesBreeds = catalog.length;
  const ownedBreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;
  const level200BreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && m.currentLevel >= 200 && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-amber-400" />
            Progreso de Colección & Metas a Nivel 200
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rastrea qué razas de las 10 generaciones ya posees y cuáles te faltan por subir al nivel máximo 200.
          </p>
        </div>

        {/* Selector de Especies */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-dofus-border">
          <button
            onClick={() => setActiveSpecies('dragopavo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSpecies === 'dragopavo'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Dragopavos ({DRAGODINDES_DATA.length})
          </button>
          <button
            onClick={() => setActiveSpecies('muluaga')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSpecies === 'muluaga'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Muluagas ({MULDOS_DATA.length})
          </button>
          <button
            onClick={() => setActiveSpecies('vueloceronte')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSpecies === 'vueloceronte'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Vuelocerontes ({VOLKORNES_DATA.length})
          </button>
        </div>
      </div>

      {/* Barra de progreso global de la especie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-dofus-card p-5 rounded-2xl border border-dofus-border shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300">Colección de Razas Poseídas</span>
            <span className="text-xs font-bold text-amber-400">{ownedBreedsCount} / {totalSpeciesBreeds} ({Math.round((ownedBreedsCount/totalSpeciesBreeds)*100)}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${(ownedBreedsCount/totalSpeciesBreeds)*100}%` }} />
          </div>
        </div>

        <div className="bg-dofus-card p-5 rounded-2xl border border-dofus-border shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300">Completadas a Nivel 200</span>
            <span className="text-xs font-bold text-emerald-400">{level200BreedsCount} / {totalSpeciesBreeds} ({Math.round((level200BreedsCount/totalSpeciesBreeds)*100)}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(level200BreedsCount/totalSpeciesBreeds)*100}%` }} />
          </div>
        </div>
      </div>

      {/* Filtro Solo Faltantes */}
      <div className="flex justify-end">
        <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-4 py-2 rounded-xl border border-dofus-border text-xs text-slate-300 font-medium">
          <input
            type="checkbox"
            checked={onlyMissing200}
            onChange={(e) => setOnlyMissing200(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
          />
          <span>Mostrar solo las que faltan por subir a Nivel 200</span>
        </label>
      </div>

      {/* Cuadrícula por Generaciones */}
      <div className="space-y-6">
        {generations.map((gen) => {
          const genBreeds = catalog.filter((b) => b.generation === gen);
          if (genBreeds.length === 0) return null;

          const filteredGenBreeds = onlyMissing200
            ? genBreeds.filter((def) => {
                const match = userMounts.find((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]));
                return !match || match.currentLevel < 200;
              })
            : genBreeds;

          if (onlyMissing200 && filteredGenBreeds.length === 0) return null;

          return (
            <div key={gen} className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-dofus-border pb-2">
                <span>Generación {gen}</span>
                <span className="text-xs text-slate-400 font-normal">{filteredGenBreeds.length} razas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredGenBreeds.map((def) => {
                  const match = userMounts.find((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]));
                  const isOwned = !!match;
                  const is200 = match && match.currentLevel >= 200;

                  return (
                    <div
                      key={def.id}
                      className={`p-3.5 rounded-xl border transition ${
                        is200
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                          : isOwned
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-100'
                          : 'bg-slate-900/60 border-dofus-border opacity-70 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs text-white">{def.name}</p>
                        {is200 ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">200 ✓</span>
                        ) : isOwned ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Niv. {match.currentLevel}</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Falta</span>
                        )}
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                        {def.bonuses.map((b, idx) => (
                          <p key={idx} className="truncate">• {b}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
