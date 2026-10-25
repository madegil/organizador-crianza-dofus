import React, { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import type { UserMount } from '../types/mount';
import { db, type LogroMarcado } from '../db/mountsDb';
import { CATEGORIAS, LOGROS, type CategoriaLogro, type Logro } from '../data/logros';
import { CATALOGO_POR_ESPECIE, ejemplaresDe } from '../utils/mountCatalog';

interface Props {
  userMounts: UserMount[];
  /** Avisa al padre del total para mostrarlo en la pestaña */
  onResumen?: (hechos: number, total: number) => void;
}

/** Cuántas razas de esa generación tienes registradas y cuántas hay */
const progresoDe = (l: Logro, mounts: UserMount[]) => {
  if (!l.medible) return null;
  const defs = CATALOGO_POR_ESPECIE[l.medible.especie].filter((d) => d.generation === l.medible!.generacion);
  const tienes = defs.filter((d) => ejemplaresDe(mounts, d).length > 0).length;
  return { tienes, total: defs.length };
};

export const LogrosGanaderia: React.FC<Props> = ({ userMounts, onResumen }) => {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [soloFaltan, setSoloFaltan] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaLogro>('dragopavo');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.logros
      .toArray()
      .then((lista) => setMarcados(Object.fromEntries(lista.map((l) => [l.id, l.hecho]))))
      .catch(() => setError('No se pudieron leer tus logros guardados en este navegador.'));
  }, []);

  const hechos = LOGROS.filter((l) => marcados[l.id]).length;
  useEffect(() => onResumen?.(hechos, LOGROS.length), [hechos, onResumen]);

  const alternar = async (l: Logro) => {
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
        return { ...c, todos, visibles: soloFaltan ? todos.filter((l) => !marcados[l.id]) : todos };
      }),
    [marcados, soloFaltan]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            {hechos} de {LOGROS.length} logros hechos
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

      {/* Pestañas por categoría con su progreso */}
      <div role="tablist" aria-label="Categoría" className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {porCategoria.map((c) => {
          const n = c.todos.filter((l) => marcados[l.id]).length;
          const activa = categoria === c.id;
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
              <img src={c.icono} alt="" width="36" height="36" className="w-9 h-9 object-contain shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-extrabold text-slate-900">{c.nombre}</span>
                <span className="block text-xs font-semibold text-slate-600">
                  {n} de {c.todos.length}
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                  <span className="block h-full rounded-full bg-blue-600" style={{ width: `${(n / c.todos.length) * 100}%` }} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {porCategoria
        .filter((c) => c.id === categoria)
        .map((c) => (
          <section key={c.id} role="tabpanel" aria-label={c.nombre}>
            {c.visibles.length === 0 ? (
              <p className="text-sm text-emerald-800 font-semibold p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                Has hecho todos los logros de {c.nombre.toLowerCase()}.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {c.visibles.map((l) => {
                  const hecho = Boolean(marcados[l.id]);
                  const p = progresoDe(l, userMounts);
                  const completo = p && p.tienes === p.total;
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={hecho}
                        onClick={() => alternar(l)}
                        className={`logro w-full h-full flex items-start gap-3 p-3 rounded-xl border-2 text-left ${
                          hecho ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-blue-500'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-lg border-2 ${
                            hecho ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-white border-slate-300'
                          }`}
                        >
                          {hecho && <Check className="w-4 h-4" strokeWidth={3} />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`block text-sm font-extrabold ${hecho ? 'text-emerald-900' : 'text-slate-900'}`}>{l.nombre}</span>
                          <span className="block text-xs text-slate-600">{l.requisito}</span>
                          {p && !hecho && (
                            <span className="mt-1.5 flex items-center gap-2">
                              <span className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                                <span className="block h-full rounded-full bg-blue-500" style={{ width: `${(p.tienes / p.total) * 100}%` }} />
                              </span>
                              <span className={`text-[11px] font-bold whitespace-nowrap ${completo ? 'text-emerald-700' : 'text-slate-600'}`}>
                                {completo ? 'Tienes todas en tu establo' : `${p.tienes} de ${p.total} en tu establo`}
                              </span>
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}

      <p className="text-xs text-slate-600">
        La barra de cada logro cuenta las razas que tienes registradas en el Establo; márcalo tú cuando el juego te lo dé. Tus logros se
        guardan en este navegador y se incluyen en la copia de seguridad .json.
      </p>
    </div>
  );
};

export type { CategoriaLogro };
