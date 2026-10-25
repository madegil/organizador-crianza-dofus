import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Link2, Plus, Trash2, X } from 'lucide-react';
import type { MountDefinition, UserMount } from '../types/mount';
import { getMountCrosses } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';
import { definicion, ejemplaresDe, esNivel200, hijos, NOMBRE_ESPECIE } from '../utils/mountCatalog';
import { formatNumber } from '../utils/formatNumber';
import { FERTILITY_LABELS } from '../data/labels';

interface Props {
  /** Montura abierta; null cierra la ventana */
  montura: MountDefinition | null;
  onClose: () => void;
  userMounts: UserMount[];
  /** Qué se muestra primero: los progenitores (Cruces) o tus ejemplares (Colección) */
  enfoque: 'cruces' | 'coleccion';
  onRegistrar?: (def: MountDefinition) => Promise<void> | void;
  onQuitar?: (mountId: string) => Promise<void> | void;
  registrando?: boolean;
}

/** Ficha pequeña de un progenitor o de una cría: al pulsarla se abre esa montura */
const Ficha: React.FC<{ def: MountDefinition; tienes: boolean; onClick: () => void }> = ({ def, tienes, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-2 w-full min-w-0 p-1.5 sm:p-2 rounded-xl bg-white border-2 border-slate-200 text-left hover:border-blue-500 hover:-translate-y-0.5"
  >
    <span className="relative shrink-0">
      <MountAvatar species={def.species} breed={def.name} imageUrl={def.imageUrl} size="sm" />
      {tienes && (
        <span className="absolute -top-1 -right-1 grid place-items-center w-4 h-4 rounded-full bg-emerald-600 text-white ring-2 ring-white" title="La tienes en tu establo">
          <Check aria-hidden="true" className="w-2.5 h-2.5" strokeWidth={3.5} />
        </span>
      )}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">{def.name}</span>
      <span className="text-[10px] font-bold text-slate-600">
        Gen. {def.generation}
        {tienes && <span className="sr-only">, la tienes</span>}
      </span>
    </span>
  </button>
);

/** Botón de quitar en dos pasos: el primer clic pide confirmación en el mismo sitio */
const BotonQuitar: React.FC<{ nombre: string; onConfirm: () => void }> = ({ nombre, onConfirm }) => {
  const [pidiendo, setPidiendo] = useState(false);
  useEffect(() => {
    if (!pidiendo) return;
    const t = window.setTimeout(() => setPidiendo(false), 4000);
    return () => window.clearTimeout(t);
  }, [pidiendo]);
  return pidiendo ? (
    <button
      type="button"
      onClick={onConfirm}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
    >
      <Trash2 aria-hidden="true" className="w-3.5 h-3.5" /> Confirmar
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setPidiendo(true)}
      aria-label={`Quitar ${nombre} del establo`}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50"
    >
      <Trash2 aria-hidden="true" className="w-3.5 h-3.5" /> Quitar
    </button>
  );
};

export const MountDetailModal: React.FC<Props> = ({
  montura,
  onClose,
  userMounts,
  enfoque,
  onRegistrar,
  onQuitar,
  registrando,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  // Historial dentro de la ventana: permite ir a un progenitor y volver
  const [historial, setHistorial] = useState<MountDefinition[]>([]);
  const actual = historial[historial.length - 1] ?? null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (montura) {
      setHistorial([montura]);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [montura]);

  useEffect(() => {
    cuerpoRef.current?.scrollTo({ top: 0 });
  }, [actual?.id]);

  const ir = (def: MountDefinition) => setHistorial((h) => [...h, def]);
  const volver = () => setHistorial((h) => h.slice(0, -1));
  const tienes = (def: MountDefinition) => ejemplaresDe(userMounts, def).length > 0;

  const cruces = actual ? getMountCrosses(actual) : [];
  const parejas = cruces
    .map(([a, b]) => [definicion(a), definicion(b)] as const)
    .filter((p): p is readonly [MountDefinition, MountDefinition] => Boolean(p[0] && p[1]))
    // Primero las parejas que ya puedes formar
    .sort((p, q) => Number(tienes(q[0]) && tienes(q[1])) - Number(tienes(p[0]) && tienes(p[1])));
  const crias = actual ? hijos(actual.id) : [];
  const ejemplares = actual ? ejemplaresDe(userMounts, actual) : [];

  const seccionEjemplares = actual && (
    <section aria-labelledby="ficha-ejemplares" className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 id="ficha-ejemplares" className="font-display text-lg text-slate-900">
          Tus ejemplares {ejemplares.length > 0 && <span className="text-slate-500">({ejemplares.length})</span>}
        </h3>
        {onRegistrar && (
          <button
            type="button"
            onClick={() => onRegistrar(actual)}
            disabled={registrando}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-60"
          >
            <Plus aria-hidden="true" className="w-4 h-4" />
            {registrando ? 'Registrando…' : ejemplares.length ? 'Añadir otro' : 'Registrar'}
          </button>
        )}
      </div>
      {ejemplares.length === 0 ? (
        <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300">
          Aún no la tienes. Regístrala cuando la consigas y contará para tu colección.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {ejemplares.map((m) => (
            <li key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-extrabold text-slate-900 truncate">
                  {m.nickname || m.breed}{' '}
                  <span className={m.gender === 'F' ? 'text-pink-600' : 'text-sky-700'} aria-label={m.gender === 'F' ? 'hembra' : 'macho'}>
                    {m.gender === 'F' ? '♀' : '♂'}
                  </span>
                </span>
                <span className="block text-xs text-slate-600">
                  Nivel {m.currentLevel} · {formatNumber(m.currentXp)} XP · {FERTILITY_LABELS[m.fertility] ?? m.fertility}
                  {esNivel200(m) && <span className="ml-1 font-bold text-emerald-700">Nivel 200</span>}
                </span>
              </span>
              {onQuitar && <BotonQuitar nombre={m.nickname || m.breed} onConfirm={() => onQuitar(m.id)} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const seccionProgenitores = actual && (
    <section aria-labelledby="ficha-progenitores" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 id="ficha-progenitores" className="font-display text-lg text-slate-900">
          Progenitores posibles {parejas.length > 1 && <span className="text-slate-500">({parejas.length})</span>}
        </h3>
        {parejas.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
            <span className="grid place-items-center w-3.5 h-3.5 rounded-full bg-emerald-600 text-white" aria-hidden="true">
              <Check className="w-2 h-2" strokeWidth={4} />
            </span>
            La tienes en tu establo
          </span>
        )}
      </div>
      {parejas.length === 0 ? (
        <p className="text-sm text-amber-950 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <strong>Salvaje.</strong> No sale de ningún cruce: se captura con una red.{' '}
          <a href="/#donde-capturar" className="font-bold underline">
            Dónde encontrarla
          </a>
        </p>
      ) : (
        <ul className="space-y-2">
          {parejas.map(([a, b], i) => {
            const lista = tienes(a) && tienes(b);
            return (
              <li
                key={`${a.id}-${b.id}-${i}`}
                className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 p-1.5 rounded-2xl ${
                  lista ? 'bg-emerald-50 border-2 border-emerald-300' : ''
                }`}
              >
                <Ficha def={a} tienes={tienes(a)} onClick={() => ir(a)} />
                <span className="grid place-items-center w-6 h-6 rounded-full bg-slate-100 text-slate-600" aria-label="con">
                  <Link2 aria-hidden="true" className="w-3.5 h-3.5" />
                </span>
                <Ficha def={b} tienes={tienes(b)} onClick={() => ir(b)} />
                {lista && (
                  <span className="col-span-3 text-xs font-bold text-emerald-800 px-1">Tienes los dos: puedes intentar este cruce</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const seccionCrias = actual && crias.length > 0 && (
    <section aria-labelledby="ficha-crias" className="space-y-2">
      <h3 id="ficha-crias" className="font-display text-lg text-slate-900">
        Sirve para criar <span className="text-slate-500">({crias.length})</span>
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {crias.map((c) => (
          <li key={c.id}>
            <Ficha def={c} tienes={tienes(c)} onClick={() => ir(c)} />
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // Clic en el fondo oscuro: cerrar
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="ficha-titulo"
      className="ficha-montura w-[min(40rem,calc(100vw-1.5rem))] max-h-[min(52rem,calc(100dvh-1.5rem))] p-0 rounded-3xl bg-white text-slate-800 border-2 border-slate-300"
    >
      {actual && (
        <div className="flex flex-col max-h-[min(52rem,calc(100dvh-1.5rem))]">
          {/* Cabecera fija con la montura */}
          <header className="flex items-start gap-3 p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
            {historial.length > 1 && (
              <button
                type="button"
                onClick={volver}
                aria-label="Volver a la montura anterior"
                className="shrink-0 grid place-items-center w-9 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-blue-500"
              >
                <ArrowLeft aria-hidden="true" className="w-5 h-5" />
              </button>
            )}
            <MountAvatar species={actual.species} breed={actual.name} imageUrl={actual.imageUrl} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 id="ficha-titulo" className="text-2xl text-slate-900 leading-tight">
                {actual.name}
              </h2>
              <p className="text-sm text-slate-600">
                {NOMBRE_ESPECIE[actual.species].uno[0].toUpperCase() + NOMBRE_ESPECIE[actual.species].uno.slice(1)} de
                generación {actual.generation}
              </p>
              <ul className="flex flex-wrap gap-1 mt-1.5" aria-label="Bonus">
                {actual.bonuses.map((b) => (
                  <li key={b} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar"
              className="shrink-0 grid place-items-center w-9 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-rose-400"
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </button>
          </header>

          <div ref={cuerpoRef} className="overflow-y-auto p-4 sm:p-5 space-y-5">
            {enfoque === 'coleccion' ? (
              <>
                {seccionEjemplares}
                {seccionProgenitores}
              </>
            ) : (
              <>
                {seccionProgenitores}
                {ejemplares.length > 0 && seccionEjemplares}
              </>
            )}
            {seccionCrias}
          </div>
        </div>
      )}
    </dialog>
  );
};
