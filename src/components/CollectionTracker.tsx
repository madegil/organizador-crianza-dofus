import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { getDefaultMaxReproductions } from '../utils/mountRules';
import { IconMedallon } from './DofusIcons';
import type { MountDefinition, SpeciesType, UserMount } from '../types/mount';
import { db, normalizeStoredMounts } from '../db/mountsDb';
import { MountGrid } from './MountGrid';
import { MountDetailModal } from './MountDetailModal';
import { SpeciesTabs } from './SpeciesTabs';
import { LogrosGanaderia, contarHechos } from './LogrosGanaderia';
import { LOGROS } from '../data/logros';
import { CATALOGO_POR_ESPECIE, NOMBRE_ESPECIE, coincide, ejemplaresDe, esNivel200 } from '../utils/mountCatalog';

type Vista = 'razas' | 'logros';
type Filtro = 'todas' | 'faltan' | 'tienes';

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'faltan', label: 'Me faltan' },
  { id: 'tienes', label: 'Las tengo' },
];

const nuevoId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `mount_${crypto.randomUUID()}`
    : `mount_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

/** Barra de progreso de la cabecera */
const Progreso: React.FC<{ titulo: string; valor: number; total: number; color: string; ayuda: string }> = ({
  titulo,
  valor,
  total,
  color,
  ayuda,
}) => {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline gap-2 text-sm font-bold mb-1.5">
        <span className="text-slate-900">{titulo}</span>
        <span className="whitespace-nowrap">
          {valor} de {total}
          <span className="ml-2 text-slate-500 font-semibold">{pct} %</span>
        </span>
      </div>
      <div
        className="w-full bg-slate-200 h-3 rounded-full overflow-hidden"
        role="progressbar"
        aria-label={titulo}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={valor}
      >
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-600 mt-1.5">{ayuda}</p>
    </div>
  );
};

export const CollectionTracker: React.FC = () => {
  const [vista, setVista] = useState<Vista>('razas');
  const [especie, setEspecie] = useState<SpeciesType>('dragopavo');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [abierta, setAbierta] = useState<MountDefinition | null>(null);
  const [userMounts, setUserMounts] = useState<UserMount[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [estado, setEstado] = useState('');
  const [resumenLogros, setResumenLogros] = useState({ hechos: 0, total: LOGROS.length });
  // Bloqueo síncrono: evita registros duplicados por doble clic
  const bloqueo = useRef(false);

  const cargar = async () => {
    setErrorCarga(false);
    try {
      await normalizeStoredMounts();
      setUserMounts(await db.mounts.toArray());
    } catch (err) {
      console.error(err);
      setErrorCarga(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const catalogo = CATALOGO_POR_ESPECIE[especie];
  const tienes = (d: MountDefinition) => ejemplaresDe(userMounts, d).length > 0;
  const en200 = (d: MountDefinition) => ejemplaresDe(userMounts, d).some(esNivel200);
  const conseguidas = catalogo.filter(tienes).length;
  const de200 = catalogo.filter(en200).length;

  const visibles = useMemo(
    () =>
      catalogo.filter(
        (d) => coincide(d, busqueda) && (filtro === 'todas' || (filtro === 'tienes' ? tienes(d) : !tienes(d)))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogo, busqueda, filtro, userMounts]
  );

  const registrar = async (def: MountDefinition) => {
    if (bloqueo.current) return;
    bloqueo.current = true;
    setRegistrando(true);
    const ahora = Date.now();
    const nueva: UserMount = {
      id: nuevoId(),
      nickname: def.name,
      definitionId: def.id,
      species: def.species,
      breed: def.name,
      generation: def.generation,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      reproductionCount: 0,
      maxReproductions: getDefaultMaxReproductions(def.species),
      // Mismos valores que el registro rápido anterior
      serenity: 2000,
      love: 20000,
      maturity: 20000,
      stamina: 20000,
      imageUrl: def.imageUrl || '',
      notes: 'Registrada desde Colección',
      createdAt: ahora,
      updatedAt: ahora,
    };
    try {
      await db.mounts.add(nueva);
      await cargar();
      setEstado(`${def.name} registrada en tu establo. Edita sus datos desde el Establo.`);
    } catch (err) {
      console.error(err);
      setEstado(`No se pudo registrar ${def.name}. Inténtalo de nuevo.`);
    } finally {
      bloqueo.current = false;
      setRegistrando(false);
    }
  };

  const quitar = async (id: string) => {
    const m = userMounts.find((x) => x.id === id);
    try {
      await db.mounts.delete(id);
      await cargar();
      setEstado(`${m?.nickname || m?.breed || 'La montura'} se quitó del establo.`);
    } catch (err) {
      console.error(err);
      setEstado('No se pudo quitar la montura. Inténtalo de nuevo.');
    }
  };

  const onResumen = useCallback((hechos: number, total: number) => setResumenLogros({ hechos, total }), []);

  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 space-y-3" aria-busy="true">
        <div className="h-7 w-56 rounded-lg bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto my-12 text-rose-900">
        <p className="text-sm font-semibold">
          No se pudo abrir el almacenamiento de este navegador. Si estás en modo privado o lo tienes bloqueado, ábrelo en una ventana normal.
        </p>
        <button
          type="button"
          onClick={() => {
            setCargando(true);
            cargar();
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <p className="sr-only" role="status" aria-live="polite">
        {estado}
      </p>

      <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-3.5 sm:p-6 space-y-5">
        {/* Cabecera y cambio de vista */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconMedallon name="coleccion" />
            <div>
              <h1 className="text-xl sm:text-2xl text-slate-900 leading-tight">
                {vista === 'razas' ? `Tu colección de ${NOMBRE_ESPECIE[especie].varios}` : 'Logros de ganadería'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {vista === 'razas'
                  ? `Hay ${catalogo.length} razas de ${NOMBRE_ESPECIE[especie].uno}. Pulsa una para ver tus ejemplares, registrarla o quitarla.`
                  : 'Marca los logros que ya tienes en el juego y mira cuáles te faltan.'}
              </p>
            </div>
          </div>
          <div role="tablist" aria-label="Vista" className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full lg:w-auto">
            {(
              [
                ['razas', 'Razas'],
                ['logros', `Logros ${resumenLogros.hechos}/${resumenLogros.total}`],
              ] as [Vista, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={vista === id}
                onClick={() => setVista(id)}
                className={`min-h-[44px] px-4 rounded-xl text-sm font-bold ${vista === id ? 'bg-blue-800 text-white' : 'text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {vista === 'razas' ? (
          <>
            <SpeciesTabs
              value={especie}
              onChange={(s) => {
                setEspecie(s);
                setBusqueda('');
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <Progreso
                titulo="Razas conseguidas"
                valor={conseguidas}
                total={catalogo.length}
                color="bg-blue-700"
                ayuda="Cada raza cuenta una vez, aunque tengas varios ejemplares."
              />
              <Progreso
                titulo="Razas en nivel 200"
                valor={de200}
                total={catalogo.length}
                color="bg-emerald-600"
                ayuda="Una montura llega a nivel 200 al acumular 867.582 puntos de experiencia."
              />
            </div>

            <MountGrid
              catalogo={catalogo}
              visibles={visibles}
              busqueda={busqueda}
              onBusqueda={setBusqueda}
              onSelect={setAbierta}
              apagada={(d) => !tienes(d)}
              resumenGen={(_, defs) => `${defs.filter(tienes).length} de ${defs.length}`}
              distintivo={(d) => {
                const n = ejemplaresDe(userMounts, d).length;
                if (!n) return null;
                return (
                  <span className="flex items-center gap-0.5">
                    {en200(d) && (
                      <span title="Tienes una en nivel 200" className="grid place-items-center w-4 h-4 rounded-full bg-kama">
                        <Star aria-hidden="true" className="w-2.5 h-2.5 text-slate-900" fill="currentColor" />
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold px-1 rounded bg-emerald-600 text-white" title={`${n} en tu establo`}>
                      ×{n}
                    </span>
                  </span>
                );
              }}
              extra={
                <div role="group" aria-label="Mostrar" className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white border-2 border-slate-300">
                  {FILTROS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={filtro === f.id}
                      onClick={() => setFiltro(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                        filtro === f.id ? 'bg-slate-800 text-white' : 'text-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              }
              vacio={
                <p className="text-sm text-slate-600 text-center py-10">
                  {filtro === 'tienes'
                    ? `Aún no tienes ningún ${NOMBRE_ESPECIE[especie].uno}${busqueda ? ' con ese nombre' : ''}. Pulsa una raza en «Todas» para registrarla.`
                    : filtro === 'faltan'
                    ? 'No te falta ninguna raza con ese criterio.'
                    : 'Ninguna raza coincide con la búsqueda.'}
                </p>
              }
            />
          </>
        ) : (
          <LogrosGanaderia userMounts={userMounts} onResumen={onResumen} />
        )}
      </div>

      {/* Mantiene el contador de logros aunque la vista de logros no esté montada */}
      {vista === 'razas' && <ResumenLogrosOculto onResumen={onResumen} />}

      {estado && (
        <p className="text-sm text-slate-200 text-center" aria-hidden="true">
          {estado}
        </p>
      )}

      <MountDetailModal
        montura={abierta}
        onClose={() => setAbierta(null)}
        userMounts={userMounts}
        enfoque="coleccion"
        onRegistrar={registrar}
        onQuitar={quitar}
        registrando={registrando}
      />
    </div>
  );
};

/** Lee cuántos logros hay marcados para mostrarlo en la pestaña sin montar la vista completa */
const ResumenLogrosOculto: React.FC<{ onResumen: (h: number, t: number) => void }> = ({ onResumen }) => {
  useEffect(() => {
    db.logros
      .toArray()
      .then((l) => onResumen(contarHechos(Object.fromEntries(l.map((x) => [x.id, x.hecho]))), LOGROS.length))
      .catch(() => {});
  }, [onResumen]);
  return null;
};
