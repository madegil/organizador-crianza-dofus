import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Circle, Sparkles, Filter, Plus } from 'lucide-react';
import type { SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { db } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';

export const CollectionTracker: React.FC = () => {
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('dragopavo');
  const [onlyMissing200, setOnlyMissing200] = useState<boolean>(false);

  const fetchMounts = () => {
    db.mounts.toArray().then(setUserMounts);
  };

  useEffect(() => {
    fetchMounts();
  }, []);

  const catalog = activeSpecies === 'dragopavo' ? DRAGODINDES_DATA : activeSpecies === 'muluaga' ? MULDOS_DATA : VOLKORNES_DATA;

  const generations = [1,2,3,4,5,6,7,8,9,10];

  const totalSpeciesBreeds = catalog.length;
  const ownedBreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;
  const level200BreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && m.currentLevel >= 200 && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;

  const quickRegisterMount = async (def: any) => {
    const newMount: UserMount = {
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: def.name,
      definitionId: def.id,
      species: activeSpecies,
      breed: def.name,
      generation: def.generation,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      serenity: 0,
      love: 0,
      maturity: 0,
      stamina: 0,
      imageUrl: def.imageUrl || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.mounts.put(newMount);
    fetchMounts();
  };

  return (
    <div className="space-y-5 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-base sm:text-2xl font-black text-white flex items-center gap-2.5 sm:gap-3">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 flex-shrink-0" />
            <span>Progreso de Colección & Metas 200</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Rastrea con sus imágenes estándar qué razas ya posees en el establo y cuáles te faltan por subir a nivel 200.
          </p>
        </div>

        {/* Selector de Especies Responsive */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-dofus-border">
          <button
            onClick={() => setActiveSpecies('dragopavo')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeSpecies === 'dragopavo'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Dragopavos</span>
            <span className="text-[10px] opacity-75 font-normal">({DRAGODINDES_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveSpecies('muluaga')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeSpecies === 'muluaga'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Muluagas</span>
            <span className="text-[10px] opacity-75 font-normal">({MULDOS_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveSpecies('vueloceronte')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeSpecies === 'vueloceronte'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Vuelocerontes</span>
            <span className="text-[10px] opacity-75 font-normal">({VOLKORNES_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* Barra de progreso global de la especie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-dofus-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-dofus-border shadow-lg">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-semibold text-slate-300">Colección de Razas Poseídas</span>
            <span className="font-bold text-amber-400">{ownedBreedsCount} de {totalSpeciesBreeds} ({Math.round((ownedBreedsCount/totalSpeciesBreeds)*100)}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${(ownedBreedsCount/totalSpeciesBreeds)*100}%` }} />
          </div>
        </div>

        <div className="bg-dofus-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-dofus-border shadow-lg">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-semibold text-slate-300">Completadas a Nivel 200</span>
            <span className="font-bold text-emerald-400">{level200BreedsCount} de {totalSpeciesBreeds} ({Math.round((level200BreedsCount/totalSpeciesBreeds)*100)}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(level200BreedsCount/totalSpeciesBreeds)*100}%` }} />
          </div>
        </div>
      </div>

      {/* Filtro Solo Faltantes */}
      <div className="flex justify-end">
        <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-3.5 py-2 rounded-xl border border-dofus-border text-xs text-slate-300 font-medium">
          <input
            type="checkbox"
            checked={onlyMissing200}
            onChange={(e) => setOnlyMissing200(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
          />
          <span>Solo las que faltan por subir a 200</span>
        </label>
      </div>

      {/* Cuadrícula por Generaciones con Imágenes de Montura */}
      <div className="space-y-4 sm:space-y-6">
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
            <div key={gen} className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-lg space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between border-b border-dofus-border pb-2">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Generación {gen}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-normal">{filteredGenBreeds.length} razas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredGenBreeds.map((def) => {
                  const match = userMounts.find((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]));
                  const isOwned = !!match;
                  const is200 = match && match.currentLevel >= 200;

                  return (
                    <div
                      key={def.id}
                      className={`p-3.5 rounded-xl sm:rounded-2xl border transition flex flex-col justify-between space-y-2.5 ${
                        is200
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100 shadow-md shadow-emerald-500/5'
                          : isOwned
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-100 shadow-md shadow-amber-500/5'
                          : 'bg-slate-900/60 border-dofus-border opacity-75 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <MountAvatar
                          species={activeSpecies}
                          breed={def.name}
                          imageUrl={def.imageUrl}
                          size="md"
                          generation={def.generation}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-white truncate">{def.name}</p>
                          <div className="mt-1">
                            {is200 ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Nivel 200 ✓
                              </span>
                            ) : isOwned ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                Nvl {match.currentLevel} ({Math.max(0, 867582 - match.currentXp).toLocaleString()} XP)
                              </span>
                            ) : (
                              <button
                                onClick={() => quickRegisterMount(def)}
                                className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 hover:underline"
                              >
                                <Plus className="w-3 h-3" /> Registrar en establo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-0.5">
                        {def.bonuses.map((b: string, idx: number) => (
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
