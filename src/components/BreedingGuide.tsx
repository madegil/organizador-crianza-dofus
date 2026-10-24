import React, { useId, useState } from 'react';
import { Sparkles, Heart, Zap, Droplet, ChevronDown, ChevronUp, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';

interface BreedingGuideProps {
  defaultOpen?: boolean;
  /** false = página propia: siempre abierta y sin botón para plegar */
  collapsible?: boolean;
}

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

export const BreedingGuide: React.FC<BreedingGuideProps> = ({ defaultOpen = false, collapsible = true }) => {
  const [isOpenState, setIsOpen] = useState(defaultOpen);
  const isOpen = !collapsible || isOpenState;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Cabecera fija (página de la Guía) o acordeón (si se incrusta en otra página) */}
      {!collapsible ? (
        <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-xs flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              Guía de serenidad y medidores
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Cómo ajustar la serenidad y llenar Aguante, Madurez y Amor
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-xs flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Guía de serenidad y medidores
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {isOpen
                  ? 'Toca para ocultar la guía'
                  : 'Cómo ajustar la serenidad y llenar Aguante, Madurez y Amor'}
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0" aria-hidden="true">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
      )}

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="p-3.5 sm:p-5 pt-0 border-t border-slate-100 space-y-3.5 sm:space-y-4">
          {/* Cómo funciona */}
          <div className="pt-3.5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong className="text-slate-900">1. Ajusta la serenidad.</strong> Usa carburantes de{' '}
              <strong className="text-slate-900">pérdida de serenidad</strong> para bajarla hacia −5.000 o de{' '}
              <strong className="text-slate-900">aumento de serenidad</strong> para subirla hacia +5.000, según el
              medidor que quieras llenar.
            </p>
            <p>
              <strong className="text-slate-900">2. Llena el medidor que necesites.</strong> Con la serenidad en la zona
              correcta, los carburantes de Aguante, Madurez y Amor van subiendo su medidor hasta 20.000.
            </p>
          </div>

          <SerenityChart />

          {/* Tarjetas de medidores, en el mismo orden que la barra (izquierda → derecha) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
            {/* Aguante */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-xs">
              <h3 className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 flex-shrink-0 text-yellow-500 fill-yellow-400" aria-hidden="true" /> Aguante
              </h3>
              <p className="text-xs text-amber-900 mt-1 font-bold">Serenidad negativa: de −5.000 a −1</p>
              <p className="text-[11px] text-amber-800 font-medium mt-0.5 leading-snug">
                Con la serenidad por debajo de 0, los carburantes de aguante llenan este medidor. Entre −2.000 y −1
                también sube la Madurez.
              </p>
            </div>

            {/* Madurez */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 shadow-xs">
              <h3 className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 flex-shrink-0 text-sky-500 fill-sky-400" aria-hidden="true" /> Madurez
              </h3>
              <p className="text-xs text-sky-900 mt-1 font-bold">Serenidad cerca de 0: de −2.000 a +2.000</p>
              <p className="text-[11px] text-sky-800 font-medium mt-0.5 leading-snug">
                Es la zona neutra: los carburantes de madurez llenan este medidor.
              </p>
            </div>

            {/* Amor */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 shadow-xs">
              <h3 className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 flex-shrink-0 text-rose-500 fill-rose-500" aria-hidden="true" /> Amor
              </h3>
              <p className="text-xs text-rose-900 mt-1 font-bold">Serenidad positiva: de 0 a +5.000</p>
              <p className="text-[11px] text-rose-800 font-medium mt-0.5 leading-snug">
                Con la serenidad en 0 o por encima, los carburantes de amor llenan este medidor. Entre 0 y +2.000
                también sube la Madurez.
              </p>
            </div>
          </div>

          {/* Ajuste de serenidad */}
          <div className="p-3 bg-slate-50 rounded-xl text-[11px] sm:text-xs text-slate-700 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
            <p className="flex items-start gap-2">
              <ArrowDown className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-px" aria-hidden="true" />
              <span>
                <strong className="text-slate-900 font-bold">Pérdida de serenidad:</strong> baja la serenidad hacia
                −5.000, la zona de Aguante.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <ArrowUp className="w-4 h-4 text-rose-600 flex-shrink-0 mt-px" aria-hidden="true" />
              <span>
                <strong className="text-slate-900 font-bold">Aumento de serenidad:</strong> sube la serenidad hacia
                +5.000, la zona de Amor.
              </span>
            </p>
          </div>

          {/* Reglas de Fértil vs Fecunda */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-[11px] sm:text-xs text-blue-950 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-px" aria-hidden="true" />
              <span>
                <strong className="font-extrabold text-blue-900">Montura fértil:</strong> empieza con los medidores en 0
                y hay que llenarlos hasta 20.000.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-px" aria-hidden="true" />
              <span>
                <strong className="font-extrabold text-blue-900">Montura fecunda:</strong> Aguante, Madurez y Amor
                están en 20.000; ya está lista para cruzar.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
