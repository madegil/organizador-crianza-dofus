import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Circle, Eye, Sparkles, Filter } from 'lucide-react';
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

  const loadMounts = async () => {
    const all = await db.mounts.toArray();
    setUserMounts(all);
  };

  useEffect(() => {
    loadMounts();
  }, []);

  const catalog =
    activeSpecies === 'dragopavo'
      ? DRAGODINDES_DATA
      : activeSpecies === 'muluaga'
      ? MULDOS_DATA
      : VOLKORNES_DATA;

  const generations = [1,2,3,4,5,6,7,8,9,10];

  const totalSpeciesBreeds = catalog.length;
  const ownedBreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;
  const level200BreedsCount = catalog.filter((def) => userMounts.some((m) => m.species === activeSpecies && (m.currentLevel >= 200 || m.currentXp >= 867582) && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]))).length;

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
      serenity: 2000,
      love: 20000,
      maturity: 20000,
      stamina: 20000,
      imageUrl: def.imageUrl || '',
      notes: `Registrado desde Colección`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.mounts.put(newMount);
    await loadMounts();
  };

  const percentage200 = totalSpeciesBreeds > 0 ? Math.round((level200BreedsCount / totalSpeciesBreeds) * 100) : 0;
  const percentageOwned = totalSpeciesBreeds > 0 ? Math.round((ownedBreedsCount / totalSpeciesBreeds) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-slate-900 to-dofus-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-dofus-border shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Catálogo & Meta Nivel 200</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Seguimiento de las {totalSpeciesBreeds} razas. Registra tus ejemplares y completa la meta de nivel 200.
              </p>
            </div>
          </div>

          {/* Selector de Especie */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-dofus-border self-start sm:self-auto">
            <button
              onClick={() => setActiveSpecies('dragopavo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSpecies === 'dragopavo'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🐴 Dragopavos</span>
              <span className="text-[10px] opacity-75">({DRAGODINDES_DATA.length})</span>
            </button>
            <button
              onClick={() => setActiveSpecies('muluaga')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSpecies === 'muluaga'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🐟 Muldos</span>
              <span className="text-[10px] opacity-75">({MULDOS_DATA.length})</span>
            </button>
            <button
              onClick={() => setActiveSpecies('vueloceronte')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSpecies === 'vueloceronte'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🦏 Vuelocerontes</span>
              <span className="text-[10px] opacity-75">({VOLKORNES_DATA.length})</span>
            </button>
          </div>
        </div>

        {/* Barras de Progreso Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-dofus-border/60">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Razas Obtenidas</span>
              <span className="text-amber-400 font-mono">{ownedBreedsCount} / {totalSpeciesBreeds} ({percentageOwned}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/60">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${percentageOwned}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Meta Nivel 200 (867.582 XP)</span>
              <span className="text-emerald-400 font-mono">{level200BreedsCount} / {totalSpeciesBreeds} ({percentage200}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/60">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${percentage200}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtro Rápido */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyMissing200}
            onChange={(e) => setOnlyMissing200(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
          />
          <span>Mostrar solo razas que me faltan a Nivel 200</span>
        </label>
        <span className="text-xs text-slate-400">
          Haz clic en una raza no registrada para añadirla a tu establo.
        </span>
      </div>

      {/* Grid por Generaciones */}
      <div className="space-y-6">
        {generations.map((gen) => {
          const genBreeds = catalog.filter((b) => b.generation === gen);
          if (genBreeds.length === 0) return null;

          const filteredGenBreeds = onlyMissing200
            ? genBreeds.filter((def) => {
                const match = userMounts.find((m) => m.species === activeSpecies && m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]));
                return !match || (match.currentLevel < 200 && match.currentXp < 867582);
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
                  const is200 = match && (match.currentLevel >= 200 || match.currentXp >= 867582);

                  return (
                    <div
                      key={def.id}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-3 relative overflow-hidden ${
                        is200
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 shadow-sm'
                          : isOwned
                          ? 'bg-slate-900/90 border-amber-500/30 text-white'
                          : 'bg-slate-900/40 border-dofus-border text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <MountAvatar
                        species={activeSpecies}
                        breed={def.name}
                        imageUrl={def.imageUrl}
                        size="md"
                        generation={def.generation}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-xs truncate">{def.name}</p>
                          {is200 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : isOwned ? (
                            <Circle className="w-3 h-3 text-amber-400 fill-amber-400/20 flex-shrink-0" />
                          ) : null}
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          {is200 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              Nivel 200 ✓
                            </span>
                          ) : isOwned ? (
                            <span className="text-amber-300 font-mono">
                              Nvl {match.currentXp >= 867582 ? 200 : match.currentLevel} ({Math.max(0, 867582 - match.currentXp).toLocaleString()} XP)
                            </span>
                          ) : (
                            <button
                              onClick={() => quickRegisterMount(def)}
                              className="text-slate-400 hover:text-amber-400 font-semibold hover:underline"
                            >
                              + Añadir al establo
                            </button>
                          )}
                        </div>
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
