import { getDefaultMaxReproductions } from '../utils/mountRules';
import React, { useState, useEffect, useRef } from 'react';
import { Layers, CheckCircle2, Eye, Plus } from 'lucide-react';
import type { SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { normalizeBreedParts } from '../data/allMounts';
import { db, normalizeStoredMounts } from '../db/mountsDb';
import { MAX_MOUNT_XP } from '../data/fuelData';
import { MountAvatar } from './MountAvatar';

// \u00AD = guion opcional: solo se parte la palabra si no cabe (pantallas de ~320 px)
const SPECIES_OPTIONS: { key: SpeciesType; label: string; count: number }[] = [
  { key: 'dragopavo', label: 'Drago\u00ADpavos', count: DRAGODINDES_DATA.length },
  { key: 'muluaga', label: 'Mula\u00ADguas', count: MULDOS_DATA.length },
  { key: 'vueloceronte', label: 'Vuelo\u00ADcerontes', count: VOLKORNES_DATA.length },
];

export const CollectionTracker: React.FC = () => {
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('dragopavo');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  // Bloqueo síncrono: evita registros duplicados por doble clic antes de que React re-renderice
  const registeringRef = useRef(false);

  const loadMounts = async () => {
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
        (m.currentLevel >= 200 || m.currentXp >= MAX_MOUNT_XP)
    )
  ).length;

  const createMountId = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? `mount_${crypto.randomUUID()}`
      : `mount_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const quickRegisterMount = async (def: any) => {
    if (registeringRef.current) return;
    registeringRef.current = true;
    setRegisteringId(def.id);
    setRegisterError(null);

    const newMount: UserMount = {
      id: createMountId(),
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

    try {
      // Si ya existe un ejemplar de esta raza (p. ej. registrado en otra pestaña), no duplicar
      const existing = await db.mounts.toArray();
      if (!existing.some((m) => isMountOfDef(m, def))) {
        await db.mounts.add(newMount);
      }
      await loadMounts();
      setStatusText(`${def.name} registrada en tu establo.`);
    } catch (err) {
      console.error(err);
      setRegisterError(`No se pudo registrar «${def.name}». Inténtalo de nuevo.`);
    } finally {
      registeringRef.current = false;
      setRegisteringId(null);
    }
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
          type="button"
          onClick={() => {
            setLoading(true);
            loadMounts();
          }}
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
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

          {/* Selector de Especie: 3 columnas iguales en móvil, en línea desde sm */}
          <div
            role="group"
            aria-label="Especie"
            className="grid grid-cols-3 gap-1 w-full sm:w-auto sm:self-start lg:self-auto sm:flex sm:items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 flex-shrink-0"
          >
            {SPECIES_OPTIONS.map((opt) => {
              const isActive = activeSpecies === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActiveSpecies(opt.key)}
                  aria-pressed={isActive}
                  className={`min-h-[44px] sm:min-h-0 px-1.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center sm:gap-1 leading-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span className="max-w-full text-center [hyphens:manual]">{opt.label}</span>
                  <span className={`text-[10px] sm:text-xs font-semibold ${isActive ? 'text-blue-100' : 'text-slate-600'}`}>
                    ({opt.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barras de Progreso Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <div className="flex justify-between items-baseline gap-2 text-xs font-bold mb-1.5">
              <span className="text-slate-700">Razas Obtenidas</span>
              <span className="text-[#1e3a8a] font-mono whitespace-nowrap">
                {ownedBreedsCount} / {totalSpeciesBreeds} ({percentageOwned}%)
              </span>
            </div>
            <div
              className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Razas obtenidas"
              aria-valuemin={0}
              aria-valuemax={totalSpeciesBreeds}
              aria-valuenow={ownedBreedsCount}
              aria-valuetext={`${ownedBreedsCount} de ${totalSpeciesBreeds} razas (${percentageOwned}%)`}
            >
              <div
                className="h-full bg-[#1e3a8a] rounded-full transition-all"
                style={{ width: `${percentageOwned}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline gap-2 text-xs font-bold mb-1.5">
              <span className="text-slate-700">Meta Nivel 200 (867.582 XP)</span>
              <span className="text-emerald-700 font-mono whitespace-nowrap">
                {level200BreedsCount} / {totalSpeciesBreeds} ({percentage200}%)
              </span>
            </div>
            <div
              className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Razas en nivel 200"
              aria-valuemin={0}
              aria-valuemax={totalSpeciesBreeds}
              aria-valuenow={level200BreedsCount}
              aria-valuetext={`${level200BreedsCount} de ${totalSpeciesBreeds} razas en nivel 200 (${percentage200}%)`}
            >
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
        <div
          role="group"
          aria-label="Filtrar por generación"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
        >
          <button
            type="button"
            onClick={() => setSelectedGen('all')}
            aria-pressed={selectedGen === 'all'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              selectedGen === 'all'
                ? 'bg-[#1e3a8a] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Todas las Generaciones
          </button>
          {generations.map((g) => {
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGen(g)}
                aria-pressed={selectedGen === g}
                title={`Generación ${g}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                  selectedGen === g
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                G{g}
              </button>
            );
          })}
        </div>

        {registerError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold"
          >
            <span>{registerError}</span>
            <button
              type="button"
              onClick={() => setRegisterError(null)}
              className="text-rose-700 hover:text-rose-900 font-bold cursor-pointer"
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {statusText}
        </p>

        {/* Grid de Razas adaptable (1 col en xs, 2 en sm, 3 en lg, 4 en xl) */}
        <div
          role="list"
          aria-label={`Razas${selectedGen === 'all' ? '' : ` de generación ${selectedGen}`}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3"
        >
          {filteredCatalog.map((def) => {
            const matches = userMounts.filter((m) => isMountOfDef(m, def));
            const isOwned = matches.length > 0;
            const hasLvl200 = matches.some(
              (m) => m.currentLevel >= 200 || m.currentXp >= MAX_MOUNT_XP
            );

            return (
              <div
                key={def.id}
                role="listitem"
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                  hasLvl200
                    ? 'bg-emerald-50/50 border-emerald-300/80'
                    : isOwned
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
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
                      <h2 className="font-extrabold text-xs text-slate-900 block truncate leading-tight">
                        {def.name}
                      </h2>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Gen {def.generation}
                      </span>
                    </div>
                  </div>

                  {/* Estado de posesión */}
                  <div className="flex-shrink-0">
                    {hasLvl200 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" /> Nvl 200
                      </span>
                    ) : isOwned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold border border-blue-200">
                        <Eye className="w-3 h-3 text-blue-600" aria-hidden="true" /> Obtenida
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => quickRegisterMount(def)}
                        disabled={registeringId !== null}
                        aria-busy={registeringId === def.id}
                        title="Registrar montura en tu establo"
                        aria-label={`Registrar ${def.name} en tu establo`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-800 text-[10px] font-bold border border-slate-200 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                        {registeringId === def.id ? 'Registrando…' : 'Registrar'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de ejemplares en establo */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {matches.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic block">
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
