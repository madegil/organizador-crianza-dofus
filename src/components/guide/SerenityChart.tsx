import React, { useId } from 'react';
import { Heart, Zap, Droplet } from 'lucide-react';

// Escala de serenidad: -5.000 … +5.000 → 0 % … 100 % del ancho de la barra
const SERENITY_MIN = -5000;
const SERENITY_MAX = 5000;
const pos = (value: number) => ((value - SERENITY_MIN) / (SERENITY_MAX - SERENITY_MIN)) * 100;

const SCALE_MARKS = [-5000, -2000, 0, 2000, 5000];
// Formato con punto de miles también en 4 cifras (toLocaleString('es') no agrupa 5000)
const formatSerenity = (v: number) => {
  const abs = Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return v > 0 ? `+${abs}` : v < 0 ? `−${abs}` : '0';
};

// Zonas en las que cada carburante especializado llena su medidor
const ZONES = [
  { key: 'aguante', label: 'Aguante', from: -5000, to: -1, bar: 'bg-yellow-400', text: 'text-yellow-300' },
  { key: 'madurez', label: 'Madurez', from: -2000, to: 2000, bar: 'bg-sky-400', text: 'text-sky-300' },
  { key: 'amor', label: 'Amor', from: 0, to: 5000, bar: 'bg-rose-500', text: 'text-rose-300' },
];

/** Gráfica de serenidad al estilo del juego: iconos arriba, barra de -5.000 a +5.000 y zonas debajo. */
export const SerenityChart: React.FC = () => {
  const captionId = useId();
  return (
  <figure
    className="rounded-2xl bg-[#1f1f22] border border-black/40 p-3.5 sm:p-4 shadow-inner text-slate-200"
    aria-labelledby={captionId}
  >
    {/* Iconos de los medidores */}
    <div className="relative h-10 sm:h-11" aria-hidden="true">
      <span className="absolute left-0 top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-yellow-400 bg-black/30 flex items-center justify-center">
        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-sky-400 bg-black/30 flex items-center justify-center">
        <Droplet className="w-5 h-5 text-sky-300 fill-sky-300" />
      </span>
      <span className="absolute right-0 top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-rose-500 bg-black/30 flex items-center justify-center">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
      </span>
    </div>

    {/* Barra de serenidad con marcas en -2.000, 0 y +2.000 */}
    <div className="relative mt-3 h-3.5 rounded-full bg-black/70 border border-white/10 overflow-hidden" aria-hidden="true">
      {[-2000, 0, 2000].map((v) => (
        <span
          key={v}
          className={`absolute top-0.5 bottom-0.5 w-[3px] -translate-x-1/2 rounded-sm ${v === 0 ? 'bg-white' : 'bg-white/40'}`}
          style={{ left: `${pos(v)}%` }}
        />
      ))}
    </div>

    {/* Escala numérica */}
    <div className="relative h-4 mt-1 text-[10px] font-mono text-slate-400" aria-hidden="true">
      {SCALE_MARKS.map((v, i) => (
        <span
          key={v}
          className={`absolute top-0 ${
            i === 0 ? 'left-0' : i === SCALE_MARKS.length - 1 ? 'right-0' : '-translate-x-1/2'
          } ${v === 0 ? 'text-white font-bold' : ''}`}
          style={i === 0 || i === SCALE_MARKS.length - 1 ? undefined : { left: `${pos(v)}%` }}
        >
          {formatSerenity(v)}
        </span>
      ))}
    </div>

    {/* Zonas de cada medidor (se solapan cerca de 0) */}
    <div className="mt-3 space-y-1" aria-hidden="true">
      {ZONES.map((z) => (
        <div key={z.key} className="relative h-6">
          <span
            className={`absolute top-0 text-[10px] font-bold leading-none ${z.text} ${z.key === 'amor' ? 'right-0' : ''}`}
            style={z.key === 'amor' ? undefined : { left: `${pos(z.from)}%` }}
          >
            {z.label} <span className="font-mono font-medium text-slate-400">{formatSerenity(z.from)} a {formatSerenity(z.to)}</span>
          </span>
          <div
            className={`absolute bottom-0.5 h-1.5 rounded-full ${z.bar}`}
            style={{ left: `${pos(z.from)}%`, width: `${pos(z.to) - pos(z.from)}%` }}
          />
        </div>
      ))}
    </div>

    <figcaption id={captionId} className="mt-3 text-[11px] text-slate-300 leading-snug">
      Barra de serenidad de −5.000 a +5.000, con 0 en el centro. Por debajo de 0 sube el Aguante, entre −2.000 y
      +2.000 sube la Madurez y desde 0 hacia arriba sube el Amor.
    </figcaption>
  </figure>
  );
};
