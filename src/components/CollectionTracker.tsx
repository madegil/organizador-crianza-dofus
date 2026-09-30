import { getDefaultMaxReproductions } from '../utils/mountRules';
import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Circle, Eye, Sparkles, Filter, Plus } from 'lucide-react';
import type { SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { normalizeBreedParts } from '../data/allMounts';
import { db, normalizeStoredMounts } from '../db/mountsDb';
import { MountAvatar } from './MountAvatar';

export const CollectionTracker: React.FC = () => {
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('dragopavo');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadMounts = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      await normalizeStoredMounts();
      const all = await db.mounts.toArray();
      setUserMounts(all);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
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
      reproductionCount: 0,
      maxReproductions: getDefaultMaxReproductions(activeSpecies),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto my-12 text-rose-900">
        <p className="text-sm font-semibold">
          No se pudo acceder al almacenamiento local (¿modo privado o almacenamiento bloqueado?)
        </p>
        <button
          onClick={loadMounts}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Layers className="w-5 h-5" />
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

          {/* Selector de Especie */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveSpecies('dragopavo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSpecies === 'dragopavo'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🐴 Dragopavos ({DRAGODINDES_DATA.length})
            </button>
            <button
              onClick={() => setActiveSpecies('muluaga')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSpecies === 'muluaga'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🐟 Mulaguas ({MULDOS_DATA.length})
            </button>
            <button
              onClick={() => setActiveSpecies('vueloceronte')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSpecies === 'vueloceronte'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              🦏 Vuelocerontes ({VOLKORNES_DATA.length})
            </button>
          </div>
        </div>

        {/* Barras de Progreso Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Razas Obtenidas</span>
              <span className="text-[#1e3a8a] font-mono">
                {ownedBreedsCount} / {totalSpeciesBreeds} ({percentageOwned}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1e3a8a] rounded-full transition-all"
                style={{ width: `${percentageOwned}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Meta Nivel 200 (867.582 XP)</span>
              <span className="text-emerald-700 font-mono">
                {level200BreedsCount} / {totalSpeciesBreeds} ({percentage200}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${percentage200}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid por Generaciones */}
      <div className="space-y-4 sm:space-y-6">
        {/* Filtro por Generación */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedGen('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              selectedGen === 'all'
                ? 'bg-[#1e3a8a] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Todas las Generaciones
          </button>
          {generations.map((g) => {
            return (
              <button
                key={g}
                onClick={() => setSelectedGen(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  selectedGen === g
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                G{g}
              </button>
            );
          })}
        </div>

        {/* Grid de Razas adaptable (1 col en xs, 2 en sm, 3 en lg, 4 en xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
