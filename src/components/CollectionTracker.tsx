import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Circle, Eye, Sparkles, Filter, Plus } from 'lucide-react';
import type { SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { normalizeBreedParts } from '../data/allMounts';
import { db, initSeedDataIfEmpty } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';

export const CollectionTracker: React.FC = () => {
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('dragopavo');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);

  const loadMounts = async () => {
    await initSeedDataIfEmpty();
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

  const isMountOfDef = (m: UserMount, def: any) => {
    if (m.species !== activeSpecies) return false;
    if (m.definitionId && m.definitionId === def.id) return true;
    return normalizeBreedParts(m.breed) === normalizeBreedParts(def.name);
  };

  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const totalSpeciesBreeds = catalog.length;
  const ownedBreedsCount = catalog.filter((def) =>
    userMounts.some((m) => isMountOfDef(m, def))
  ).length;

  const level200BreedsCount = catalog.filter((def) =>
    userMounts.some(
      (m) =>
        isMountOfDef(m, def) &&
        (m.currentLevel >= 200 || m.currentXp >= 867582)
    )
  ).length;

  const quickRegisterMount = async (def: any) => {
    const newMount: UserMount = {
      id: `mount_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      reproductionCount: 0,
      maxReproductions: activeSpecies === 'dragopavo' ? 5 : activeSpecies === 'muluaga' ? 4 : 2,
      serenity: 2000,
      love: 20000,
      maturity: 20000,
      stamina: 20000,
      imageUrl: def.imageUrl || '',
      notes: 'Registrada desde Catálogo',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.mounts.add(newMount);
    await loadMounts();
  };

  const percentageOwned =
    totalSpeciesBreeds > 0
      ? Math.round((ownedBreedsCount / totalSpeciesBreeds) * 100)
      : 0;

  const percentage200 =
    totalSpeciesBreeds > 0
      ? Math.round((level200BreedsCount / totalSpeciesBreeds) * 100)
      : 0;

  const filteredCatalog =
    selectedGen === 'all'
      ? catalog
      : catalog.filter((m) => m.generation === selectedGen);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 sm:space-y-6">
        {/* Cabecera y Selector de Especies */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Catálogo &amp; Meta Nivel 200
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Seguimiento de las {totalSpeciesBreeds} razas. Registra ejemplares y completa tu colección.
              </p>
            </div>
          </div>

          {/* Selector de Especie simétrico en mobile */}
          <div className="grid grid-cols-3 w-full sm:w-auto sm:flex gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setActiveSpecies('dragopavo');
                setSelectedGen('all');
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                activeSpecies === 'dragopavo'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🐴 Dragopavos ({DRAGODINDES_DATA.length})
            </button>
            <button
              onClick={() => {
                setActiveSpecies('muluaga');
                setSelectedGen('all');
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                activeSpecies === 'muluaga'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🐟 Mulaguas ({MULDOS_DATA.length})
            </button>
            <button
              onClick={() => {
                setActiveSpecies('vueloceronte');
                setSelectedGen('all');
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                activeSpecies === 'vueloceronte'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-extrabold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🦏 Vuelocerontes ({VOLKORNES_DATA.length})
            </button>
          </div>
        </div>

        {/* Barras de Progreso Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Razas Obtenidas</span>
              <span className="text-[#1e3a8a] font-mono font-extrabold">
                {ownedBreedsCount} / {totalSpeciesBreeds} ({percentageOwned}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-[#1e3a8a] rounded-full transition-all duration-300"
                style={{ width: `${percentageOwned}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Meta Nivel 200 (867.582 XP)</span>
              <span className="text-emerald-700 font-mono font-extrabold">
                {level200BreedsCount} / {totalSpeciesBreeds} ({percentage200}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${percentage200}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filtro por Generación con scroll horizontal amigable en móvil */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtrar por Generación:
            </span>
            {selectedGen !== 'all' && (
              <button
                onClick={() => setSelectedGen('all')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Ver todas ({catalog.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
            <button
              onClick={() => setSelectedGen('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                selectedGen === 'all'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {generations.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGen(g)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  selectedGen === g
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Gen {g}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Razas adaptable (1 col en xs, 2 en sm, 3 en lg, 4 en xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredCatalog.map((def) => {
            const matches = userMounts.filter((m) => isMountOfDef(m, def));
            const isOwned = matches.length > 0;
            const hasLvl200 = matches.some(
              (m) => m.currentLevel >= 200 || m.currentXp >= 867582
            );

            return (
              <div
                key={def.id}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                  hasLvl200
                    ? 'bg-emerald-50/50 border-emerald-300/80 shadow-xs'
                    : isOwned
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MountAvatar
                      species={activeSpecies}
                      breed={def.name}
                      imageUrl={def.imageUrl}
                      size="sm"
                      generation={def.generation}
                    />
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs text-slate-900 block truncate leading-tight">
                        {def.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Gen {def.generation}
                      </span>
                    </div>
                  </div>

                  {/* Estado de posesión */}
                  <div className="flex-shrink-0">
                    {hasLvl200 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Nvl 200
                      </span>
                    ) : isOwned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold border border-blue-200">
                        <Eye className="w-3 h-3 text-blue-600" /> Obtenida
                      </span>
                    ) : (
                      <button
                        onClick={() => quickRegisterMount(def)}
                        title="Registrar montura en tu establo"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-800 text-[10px] font-bold border border-slate-200 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Registrar
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de ejemplares en establo */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {matches.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic block">
                      Sin ejemplares en establo
                    </span>
                  ) : (
                    <div className="space-y-1">
                      {matches.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-[11px] bg-white/80 px-2 py-1 rounded-lg border border-slate-200/60 font-medium"
                        >
                          <span className="text-slate-800 truncate font-semibold">
                            {m.nickname}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold ${
                              m.currentLevel >= 200
                                ? 'text-emerald-700'
                                : 'text-slate-500'
                            }`}
                          >
                            Nvl {m.currentLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
