import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Trophy } from 'lucide-react';
import type { UserMount } from '../types/mount';
import { db, type LogroMarcado } from '../db/mountsDb';
import { CATEGORIAS, LOGROS, PUNTOS_TOTALES, requisitosDeMeta, type CategoriaLogro, type Logro } from '../data/logros';
import { CATALOGO_POR_ESPECIE, ejemplaresDe } from '../utils/mountCatalog';
import { MountAvatar } from './MountAvatar';
import { IconColeccion, IconCruces } from './DofusIcons';

interface Props {
  userMounts: UserMount[];
  /** Avisa al padre del total para mostrarlo en la pestaña */
  onResumen?: (hechos: number, total: number) => void;
}

/** Un logro meta se completa solo cuando están hechos todos sus requisitos (que pueden ser otros metas) */
export const estaHecho = (l: Logro, marcados: Record<string, boolean>): boolean =>
  l.tipo === 'meta' ? requisitosDeMeta(l).every((r) => estaHecho(r, marcados)) : Boolean(marcados[l.id]);

export const contarHechos = (marcados: Record<string, boolean>) => LOGROS.filter((l) => estaHecho(l, marcados)).length;

/** Icono del logro con el aspecto de los del juego: marco dorado, dibujo y número */
const IconoLogro: React.FC<{ l: Logro; hecho: boolean }> = ({ l, hecho }) => {
  const especie = l.medible?.especie;
  const sprite = especie && CATEGORIAS.find((c) => c.id === especie)?.icono;
  return (
    <span
      aria-hidden="true"
      className={`relative grid place-items-center w-12 h-12 shrink-0 rounded-lg border-2 ${
        hecho ? 'border-kama bg-[#fff6d8]' : 'border-slate-300 bg-slate-100'
      }`}
    >
      {l.tipo === 'captura' && sprite && <img src={sprite} alt="" className="w-10 h-10 object-contain" />}
      {l.tipo === 'generacion' && <IconCruces className="w-9 h-9" />}
      {l.tipo === 'meta' && <IconColeccion className="w-9 h-9" />}
      {l.tipo === 'nacimientos' && (
        <svg viewBox="0 0 32 32" className="w-9 h-9">
          <path d="M16 29V15" stroke="#4a7a12" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M16 17c-1-6-6-9-11-8 0 6 5 9 11 8Z" fill="#7fc23a" />
          <path d="M16 14c1-6 6-9 11-8 0 6-5 9-11 8Z" fill="#a5d65a" />
          <circle cx="16" cy="8" r="3.4" fill="#f2c14e" />
        </svg>
      )}
      {l.numero !== undefined && (
        <span className="absolute -bottom-1 -right-1 min-w-[1.25rem] px-1 rounded-md bg-[#f2c14e] text-[#2a1f12] text-[11px] font-extrabold leading-5 text-center border border-[#b8861f]">
          {l.numero}
        </span>
      )}
    </span>
  );
};

const Puntos: React.FC<{ n: number }> = ({ n }) => (
  <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-slate-700" title={`${n} puntos de logro`}>
    {n}
    <Trophy aria-hidden="true" className="w-3.5 h-3.5 text-[#b8861f]" />
    <span className="sr-only">puntos</span>
  </span>
);

export const LogrosGanaderia: React.FC<Props> = ({ userMounts, onResumen }) => {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [soloFaltan, setSoloFaltan] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaLogro>('dragopavo');
  const [abierto, setAbierto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.logros
      .toArray()
      .then((lista) => setMarcados(Object.fromEntries(lista.map((l) => [l.id, l.hecho]))))
      .catch(() => setError('No se pudieron leer tus logros guardados en este navegador.'));
  }, []);

  const hechos = contarHechos(marcados);
  const puntos = LOGROS.filter((l) => estaHecho(l, marcados)).reduce((s, l) => s + l.puntos, 0);
  useEffect(() => onResumen?.(hechos, LOGROS.length), [hechos, onResumen]);

  const alternar = async (l: Logro) => {
    if (l.tipo === 'meta') return;
    const nuevo = !marcados[l.id];
    setMarcados((m) => ({ ...m, [l.id]: nuevo }));
    try {
      const fila: LogroMarcado = { id: l.id, hecho: nuevo, fecha: Date.now() };
      await db.logros.put(fila);
      setError(null);
    } catch {
      setMarcados((m) => ({ ...m, [l.id]: !nuevo }));
      setError('No se pudo guardar el cambio. Inténtalo de nuevo.');
    }
  };

  const porCategoria = useMemo(
    () =>
      CATEGORIAS.map((c) => {
        const todos = LOGROS.filter((l) => l.categoria === c.id);
        const n = todos.filter((l) => estaHecho(l, marcados)).length;
        return { ...c, todos, n, visibles: soloFaltan ? todos.filter((l) => !estaHecho(l, marcados)) : todos };
      }),
    [marcados, soloFaltan]
  );
  const actual = porCategoria.find((c) => c.id === categoria)!;

  /** Lo que hay dentro de cada logro: las razas que exige o los logros que agrupa */
  const detalle = (l: Logro) => {
    if (l.medible) {
      const defs = CATALOGO_POR_ESPECIE[l.medible.especie].filter((d) => d.generation === l.medible!.generacion);
      return (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {defs.map((d) => {
            const tiene = ejemplaresDe(userMounts, d).length > 0;
            return (
              <li key={d.id} className={`flex items-center gap-2 p-1.5 rounded-lg border ${tiene ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                <span className={tiene ? '' : 'grayscale-[.7] opacity-60'}>
                  <MountAvatar species={d.species} breed={d.name} imageUrl={d.imageUrl} size="sm" />
                </span>
                <span className="min-w-0 text-[11px] font-bold leading-tight text-slate-900">
                  {d.name}
                  {tiene && <span className="block text-[10px] text-emerald-700">En tu establo</span>}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
    if (l.tipo === 'meta') {
      return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {requisitosDeMeta(l).map((r) => (
            <li key={r.id} className="flex items-center gap-2 text-xs">
              <span className={`grid place-items-center w-4 h-4 rounded ${estaHecho(r, marcados) ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'}`} aria-hidden="true">
                {estaHecho(r, marcados) && <Check className="w-3 h-3" strokeWidth={3.5} />}
              </span>
              <span className={estaHecho(r, marcados) ? 'text-slate-900 font-semibold' : 'text-slate-600'}>{r.nombre}</span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex-1">
          <p className="flex flex-wrap items-baseline gap-x-3 text-sm font-bold text-slate-900">
            <span>
              {hechos} de {LOGROS.length} logros
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700">
              <Trophy aria-hidden="true" className="w-4 h-4 text-[#b8861f]" /> {puntos} de {PUNTOS_TOTALES} puntos
            </span>
          </p>
          <div className="mt-1.5 h-3 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${(hechos / LOGROS.length) * 100}%` }} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer select-none">
          <input type="checkbox" checked={soloFaltan} onChange={(e) => setSoloFaltan(e.target.checked)} className="w-4 h-4" />
          Ver solo los que me faltan
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-800 p-3 rounded-xl bg-rose-50 border border-rose-200">
          {error}
        </p>
      )}

      {/* Pestañas por categoría con su porcentaje, como el menú de logros del juego */}
      <div role="tablist" aria-label="Categoría" className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {porCategoria.map((c) => {
          const activa = categoria === c.id;
          const pct = Math.round((c.n / c.todos.length) * 100);
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => setCategoria(c.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl border-2 text-left ${
                activa ? 'bg-white border-blue-600 shadow-[0_3px_0_#33550f]' : 'bg-slate-50 border-slate-200 hover:border-blue-400'
              }`}
            >
              <img src={c.icono} alt="" width="36" height="36" className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-extrabold text-slate-900 truncate">{c.nombre}</span>
                <span className="block text-xs font-semibold text-slate-600">
                  {c.n} de {c.todos.length}{' '}
                  <span className={`font-extrabold ${pct === 100 ? 'text-emerald-700' : 'text-[#9a6a12]'}`}>({pct} %)</span>
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                  <span className="block h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <section role="tabpanel" aria-label={actual.nombre}>
        {actual.visibles.length === 0 ? (
          <p className="text-sm text-emerald-800 font-semibold p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            Has hecho todos los logros de {actual.nombre.toLowerCase()}.
          </p>
        ) : (
          <ul className="space-y-2">
            {actual.visibles.map((l) => {
              const hecho = estaHecho(l, marcados);
              const esMeta = l.tipo === 'meta';
              const tieneDetalle = Boolean(l.medible) || esMeta;
              const expandido = abierto === l.id;
              const prog = l.medible
                ? (() => {
                    const defs = CATALOGO_POR_ESPECIE[l.medible.especie].filter((d) => d.generation === l.medible!.generacion);
                    return { tienes: defs.filter((d) => ejemplaresDe(userMounts, d).length > 0).length, total: defs.length };
                  })()
                : esMeta
                ? { tienes: requisitosDeMeta(l).filter((r) => estaHecho(r, marcados)).length, total: requisitosDeMeta(l).length }
                : null;
              return (
                <li key={l.id} className={`rounded-xl border-2 ${hecho ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3 p-2.5">
                    <IconoLogro l={l} hecho={hecho} />
                    <div className="flex-1 min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className={`text-sm font-extrabold ${hecho ? 'text-emerald-900' : 'text-slate-900'}`}>{l.nombre}</span>
                        <Puntos n={l.puntos} />
                      </p>
                      <p className="text-xs text-slate-600">{l.descripcion}</p>
                      {prog && !hecho && (
                        <span className="mt-1.5 flex items-center gap-2">
                          <span className="flex-1 max-w-[16rem] h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                            <span className="block h-full rounded-full bg-blue-500" style={{ width: `${(prog.tienes / prog.total) * 100}%` }} />
                          </span>
                          <span className="text-[11px] font-bold whitespace-nowrap text-slate-600">
                            {esMeta
                              ? `${prog.tienes} de ${prog.total} logros`
                              : prog.tienes === prog.total
                              ? 'Tienes todas en tu establo'
                              : `${prog.tienes} de ${prog.total} en tu establo`}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {tieneDetalle && (
                        <button
                          type="button"
                          aria-expanded={expandido}
                          aria-label={`${expandido ? 'Ocultar' : 'Ver'} lo que pide ${l.nombre}`}
                          onClick={() => setAbierto(expandido ? null : l.id)}
                          className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-500"
                        >
                          <ChevronDown aria-hidden="true" className={`w-4 h-4 duration-300 ${expandido ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      {esMeta ? (
                        <span
                          className={`grid place-items-center w-9 h-9 rounded-lg ${hecho ? 'bg-emerald-600 text-white' : 'border-2 border-dashed border-slate-300'}`}
                          title="Se completa solo al conseguir los logros que agrupa"
                        >
                          {hecho && <Check aria-hidden="true" className="w-5 h-5" strokeWidth={3} />}
                          <span className="sr-only">{hecho ? 'Conseguido' : 'Se completa solo'}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={hecho}
                          aria-label={`Marcar ${l.nombre} como hecho`}
                          onClick={() => alternar(l)}
                          className={`grid place-items-center w-9 h-9 rounded-lg border-2 ${
                            hecho ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-white border-slate-300 hover:border-blue-500'
                          }`}
                        >
                          {hecho && <Check aria-hidden="true" className="w-5 h-5" strokeWidth={3} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {expandido && <div className="px-2.5 pb-2.5">{detalle(l)}</div>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-600">
        Márcalos tú cuando el juego te los dé; los logros que agrupan a otros (los de «Conseguir los siguientes logros») se completan solos. Las barras cuentan las razas registradas en tu
        Establo. Todo se guarda en este navegador y va en la copia de seguridad .json.
      </p>
    </div>
  );
};
