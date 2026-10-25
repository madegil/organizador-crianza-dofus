import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

type Gen = number | 'all';

interface GenFilterProps {
  generations: number[];
  selected: Gen;
  onChange: (g: Gen) => void;
  /** Texto de la opción "todas" en los botones de escritorio */
  allLabel?: string;
  /** Cuántas razas hay en cada generación (opcional, se muestra en el desplegable) */
  counts?: Record<number, number>;
}

/**
 * Filtro por generación sin scroll horizontal:
 * - móvil: un desplegable nativo, cómodo con el pulgar y accesible
 * - desde sm: botones que bajan de línea si no caben
 */
export const GenFilter: React.FC<GenFilterProps> = ({
  generations,
  selected,
  onChange,
  allLabel = 'Todas',
  counts,
}) => {
  const selectId = useId();

  return (
    <>
      <div className="sm:hidden">
        <label htmlFor={selectId} className="sr-only">
          Generación
        </label>
        <div className="relative">
          <select
            id={selectId}
            value={String(selected)}
            onChange={(e) => onChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full appearance-none min-h-[44px] pl-3 pr-10 rounded-xl border-2 border-slate-300 bg-white text-sm font-bold text-slate-900 shadow-[0_2px_0_#c4ac80] focus:border-blue-500"
          >
            <option value="all">Todas las generaciones</option>
            {generations.map((g) => (
              <option key={g} value={g}>
                {`Generación ${g}${counts?.[g] ? ` (${counts[g]} razas)` : ''}`}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600"
          />
        </div>
      </div>

      <div role="group" aria-label="Filtrar por generación" className="hidden sm:flex flex-wrap items-center gap-1.5">
        {(['all', ...generations] as Gen[]).map((g) => {
          const isActive = selected === g;
          return (
            <button
              key={g}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(g)}
              title={g === 'all' ? undefined : `Generación ${g}`}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold ${
                isActive ? 'bg-blue-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {g === 'all' ? allLabel : `G${g}`}
            </button>
          );
        })}
      </div>
    </>
  );
};
