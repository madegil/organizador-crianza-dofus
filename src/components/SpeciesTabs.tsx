import React from 'react';
import type { SpeciesType } from '../types/mount';
import { CATALOGO_POR_ESPECIE } from '../utils/mountCatalog';

const OPCIONES: { key: SpeciesType; label: string; img: string }[] = [
  { key: 'dragopavo', label: 'Dragopavos', img: 'https://api.dofusdu.de/dofus2/img/mount/20.png' },
  { key: 'muluaga', label: 'Mulaguas', img: 'https://api.dofusdu.de/dofus3/v1/img/item/97091-128.png' },
  { key: 'vueloceronte', label: 'Vuelocerontes', img: 'https://api.dofusdu.de/dofus3/v1/img/item/97177-128.png' },
];

/** Selector de especie con su retrato y el número de razas */
export const SpeciesTabs: React.FC<{ value: SpeciesType; onChange: (s: SpeciesType) => void }> = ({ value, onChange }) => (
  <div role="group" aria-label="Especie" className="grid grid-cols-3 gap-1 w-full lg:w-auto p-1 rounded-2xl bg-slate-100 border border-slate-200">
    {OPCIONES.map((o) => {
      const activa = value === o.key;
      return (
        <button
          key={o.key}
          type="button"
          aria-pressed={activa}
          onClick={() => onChange(o.key)}
          className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 min-h-[52px] px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
            activa ? 'bg-blue-800 text-white' : 'text-slate-700'
          }`}
        >
          <img src={o.img} alt="" width="28" height="28" className="w-7 h-7 object-contain" />
          <span className="leading-tight text-center">
            {o.label} <span className={`font-semibold ${activa ? 'text-blue-100' : 'text-slate-500'}`}>{CATALOGO_POR_ESPECIE[o.key].length}</span>
          </span>
        </button>
      );
    })}
  </div>
);
