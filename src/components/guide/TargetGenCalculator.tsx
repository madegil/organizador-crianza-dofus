import React, { useId, useState } from 'react';

/** Probabilidad de que el bebé salga de la generación objetivo (reglas de la 3.7). */
export const targetGenChance = (level1: number, level2: number, optimakina: boolean, almanax: boolean): number =>
  Math.min(100, 30 + 0.15 * (level1 + level2) + (optimakina ? 20 : 0) + (almanax ? 20 : 0));

const clampLevel = (v: string) => Math.min(200, Math.max(1, Math.round(Number(v) || 1)));

export const TargetGenCalculator: React.FC = () => {
  const [level1, setLevel1] = useState(1);
  const [level2, setLevel2] = useState(1);
  const [optimakina, setOptimakina] = useState(false);
  const [almanax, setAlmanax] = useState(false);
  const ids = { l1: useId(), l2: useId(), opt: useId(), alm: useId(), out: useId() };
  const chance = targetGenChance(level1, level2, optimakina, almanax);
  const fmt = (n: number) => n.toLocaleString('es', { maximumFractionDigits: 2 });

  const levelField = (id: string, label: string, value: number, set: (n: number) => void) => (
    <div className="space-y-1">
      <label htmlFor={id} className="flex justify-between text-xs font-bold text-slate-700">
        <span>{label}</span>
        <span className="font-mono text-slate-900">Nivel {value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={1}
        max={200}
        value={value}
        onChange={(e) => set(clampLevel(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
      <p className="text-xs font-extrabold text-slate-900">Calcula tu probabilidad</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {levelField(ids.l1, 'Padre 1', level1, setLevel1)}
        {levelField(ids.l2, 'Padre 2', level2, setLevel2)}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
        <label htmlFor={ids.opt} className="flex items-center gap-2 cursor-pointer">
          <input id={ids.opt} type="checkbox" checked={optimakina} onChange={(e) => setOptimakina(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          Con Optimákina (+20 %)
        </label>
        <label htmlFor={ids.alm} className="flex items-center gap-2 cursor-pointer">
          <input id={ids.alm} type="checkbox" checked={almanax} onChange={(e) => setAlmanax(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          Día del bonus de Almanax (+20 %)
        </label>
      </div>
      <div className="space-y-1.5" aria-live="polite" id={ids.out}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-slate-600">Generación objetivo</span>
          <span className="text-2xl font-black text-blue-900 font-mono">{fmt(chance)} %</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${chance}%` }} />
        </div>
        <p className="text-[11px] text-slate-500">
          Si hay varias monturas posibles en la generación objetivo, esta probabilidad se reparte entre ellas.
        </p>
      </div>
    </div>
  );
};
