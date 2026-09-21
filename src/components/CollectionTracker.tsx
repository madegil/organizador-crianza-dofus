import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Circle, Eye, Sparkles, Filter, Plus } from 'lucide-react';
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

  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const totalSpeciesBreeds = catalog.length;
  const ownedBreedsCount = catalog.filter((def) =>
    userMounts.some(
      (m) =>
        m.species === activeSpecies &&
        m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0])
    )
  ).length;

  const level200BreedsCount = catalog.filter((def) =>
    userMounts.some(
      (m) =>
        m.species === activeSpecies &&
        (m.currentLevel >= 200 || m.currentXp >= 867582) &&
        m.breed.toLowerCase().includes(def.name.toLowerCase().split(' ')[0])
    )
  ).length;

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
      notes: 'Registrado desde Colección',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.mounts.put(newMount);
    await loadMounts();
  };

  const percentage200 =
    totalSpeciesBreeds > 0
      ? Math.round((level200BreedsCount / totalSpeciesBreeds) * 100)
      : 0;
  const percentageOwned =
    totalSpeciesBreeds > 0
      ? Math.round((ownedBreedsCount / totalSpeciesBreeds) * 100)
      : 0;

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 relative">
        {/* Cabecera y Selector de Especies */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Catálogo & Meta Nivel 200
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Seguimiento de las {totalSpeciesBreeds} razas. Registra ejemplares y completa tu colección.
              </p>
            </div>
          </div>

          {/* Selector de Especie */}
          <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveSpecies('dragopavo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSpecies === 'dragopavo'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>🐴 Dragopavos</span>
              <span className="text-[10px] opacity-80 font-mono font-normal">
                ({DRAGODINDES_DATA.length})
              </span>
            </button>
            <button
              onClick={() => setActiveSpecies('muluaga')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSpecies === 'muluaga'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>🐟 Muldos</span>
              <span className="text-[10px] opacity-80 font-mono font-normal">
                ({MULDOS_DATA.length})
              </span>
            </button>
            <button
              onClick={() => setActiveSpecies('vueloceronte')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSpecies === 'vueloceronte'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-950/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>🦏 Vuelocerontes</span>
              <span className="text-[10px] opacity-80 font-mono font-normal">
                ({VOLKORNES_DATA.length})
              </span>
            </button>
          </div>
        </div>

        {/* Barras de Progreso Globales con estilo index */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Razas Obtenidas</span>
              <span className="text-[#1e3a8a] font-mono">
                {ownedBreedsCount} / {totalSpeciesBreeds} ({percentageOwned}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-[#1e3a8a] rounded-full transition-all"
                style={{ width: `${percentageOwned}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Meta Nivel 200 (867.582 XP)</span>
              <span className="text-emerald-700 font-mono">
                {level200BreedsCount} / {totalSpeciesBreeds} ({percentage200}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${percentage200}%` }}
              />
            </div>
          </div>
        </div>

        {/* Barra de Filtro Rápido */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <label className="flex items-center gap-2.5 text-xs font-extrabold text-slate-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyMissing200}
              onChange={(e) => setOnlyMissing200(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Mostrar solo razas que me faltan a Nivel 200</span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            Haz clic en una raza no registrada para añadirla a tu establo.
          </span>
        </div>

        {/* Grid por Generaciones */}
        <div className="space-y-4 sm:space-y-5">
          {generations.map((gen) => {
            const genBreeds = catalog.filter((b) => b.generation === gen);
            if (genBreeds.length === 0) return null;

            const filteredGenBreeds = onlyMissing200
              ? genBreeds.filter((def) => {
                  const match = userMounts.find(
                    (m) =>
                      m.species === activeSpecies &&
                      m.breed
                        .toLowerCase()
                        .includes(def.name.toLowerCase().split(' ')[0])
                  );
                  return (
                    !match ||
                    (match.currentLevel < 200 && match.currentXp < 867582)
                  );
                })
              : genBreeds;

            if (onlyMissing200 && filteredGenBreeds.length === 0) return null;

            return (
              <div
                key={gen}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Generación {gen}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    {filteredGenBreeds.length} razas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                  {filteredGenBreeds.map((def) => {
                    const match = userMounts.find(
                      (m) =>
                        m.species === activeSpecies &&
                        m.breed
                          .toLowerCase()
                          .includes(def.name.toLowerCase().split(' ')[0])
                    );
                    const isOwned = !!match;
                    const is200 =
                      match &&
                      (match.currentLevel >= 200 || match.currentXp >= 867582);

                    return (
                      <div
                        key={def.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center gap-3 relative shadow-sm hover:shadow-md ${
                          is200
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : isOwned
                            ? 'bg-blue-50/70 border-blue-300 text-slate-900'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
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
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-xs truncate text-slate-900">
                              {def.name}
                            </p>
                            {is200 ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            ) : isOwned ? (
                              <Circle className="w-3 h-3 text-blue-600 fill-blue-600/20 flex-shrink-0" />
                            ) : null}
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            {is200 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                                Nivel 200 ✓
                              </span>
                            ) : isOwned ? (
                              <span className="text-[#1e3a8a] font-mono font-bold bg-blue-100/80 px-1.5 py-0.5 rounded border border-blue-200">
                                Nvl {match.currentXp >= 867582 ? 200 : match.currentLevel} ({Math.max(0, 867582 - match.currentXp).toLocaleString()} XP)
                              </span>
                            ) : (
                              <button
                                onClick={() => quickRegisterMount(def)}
                                className="text-[#1e3a8a] hover:text-blue-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" /> Añadir al establo
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
    </div>
  );
};
