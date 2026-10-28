import React from 'react';

/** Un tramo del medidor, para la leyenda que va a la derecha */
export interface XpGaugeTier {
  name: string;
  /** Texto del rango, p. ej. "0 – 80.000" */
  range: string;
  /** XP donde termina el tramo (80.000, 140.000, 180.000, 200.000) */
  upTo: number;
  /** Clase de color del tramo (marca de la leyenda) */
  color: string;
  /** Tramo que usa la forma de recarga elegida */
  active?: boolean;
}

interface XpGaugeProps {
  currentXp: number; // 0 a 200.000
  maxGauge?: number; // 200.000 por defecto
  className?: string;
  /** Tramos de abajo (vacío) a arriba (lleno); si se pasan, se explican a la derecha del medidor */
  tiers?: XpGaugeTier[];
}

/**
 * Medidor de Experiencia oficial del pesebre (0 a 200.000 XP).
 * Distribuido exactamente en 4 zonas con marcas a 80k, 140k, 180k y 200k.
 * Diseño fiel a la referencia visual (XP.PNG / XP_Medidor.png) sin texto quemado.
 * Con `tiers`, cada tramo se explica al lado, a la misma altura que su zona del medidor.
 */
export const XpGauge: React.FC<XpGaugeProps> = ({
  currentXp,
  maxGauge = 200000,
  className = '',
  tiers,
}) => {
  const safeXp = Math.min(maxGauge, Math.max(0, currentXp));
  const percentage = maxGauge > 0 ? Math.min(100, Math.max(0, (safeXp / maxGauge) * 100)) : 0;

  // Marcas entre tramos (sin el tope final)
  const marks = (tiers?.map((t) => t.upTo) ?? [80000, 140000, 180000]).filter((v) => v < maxGauge);

  // Tramos de arriba a abajo, con la parte del medidor que ocupa cada uno
  const legend = tiers
    ? tiers
        .map((t, i) => ({ ...t, share: (t.upTo - (i === 0 ? 0 : tiers[i - 1].upTo)) / maxGauge }))
        .reverse()
    : null;

  const gauge = (
    <div
      className={`relative bg-madera border-2 border-[#dfc38c] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between shadow-2xl shadow-black/80 select-none w-20 sm:w-24 flex-shrink-0 ${legend ? '' : className}`}
      title={`Medidor de XP: ${safeXp.toLocaleString()} / ${maxGauge.toLocaleString()} XP`}
    >
      {/* Barra vertical (Track) */}
      <div className="relative w-8 sm:w-9 h-64 sm:h-72 bg-[#1a120a] rounded-sm border border-[#4a321d] overflow-hidden flex flex-col justify-end shadow-inner">
        {/* Relleno dinámico de XP */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#dfbe76] to-[#f4d697] transition-all duration-300 ease-out flex flex-col justify-start"
          style={{ height: `${percentage}%` }}
        >
          {/* Brillo superior blanco (highlight bar) */}
          <div className="w-full h-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* Marcas de distribución oficial: 80.000 (40 %), 140.000 (70 %) y 180.000 (90 %) */}
        {marks.map((m) => (
          <div
            key={m}
            className="absolute left-0 right-0 h-[2px] bg-[#25180c] z-10 pointer-events-none shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
            style={{ bottom: `${(m / maxGauge) * 100}%` }}
          />
        ))}
      </div>

      {/* Insignia Circular inferior "XP" */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#25180c] border border-[#6b4a2b] flex items-center justify-center mt-2.5 shadow-md shadow-black/60">
        <span className="font-black text-sm sm:text-base tracking-widest text-[#eed496] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-mono">
          XP
        </span>
      </div>
    </div>
  );

  if (!legend) return gauge;

  return (
    <div className={`flex items-start gap-2 sm:gap-3 ${className}`}>
      {gauge}
      {/* Leyenda: misma altura y desplazamiento que la barra (borde 2px + padding del marco) */}
      <ol
        aria-label="Tramos del medidor de 200.000 XP"
        className="flex flex-col h-64 sm:h-72 mt-[12px] sm:mt-[14px] w-[11.5rem] sm:w-[13rem] min-w-0"
      >
        {legend.map((t) => (
          <li
            key={t.name}
            className="relative flex items-center min-h-0 pl-3 border-t border-dashed border-[#d8c398] first:border-t-0"
            style={{ flex: `${t.share} 1 0%` }}
          >
            {/* Franja del color del tramo, pegada al medidor */}
            <span aria-hidden="true" className={`absolute left-0 top-[3px] bottom-[3px] w-1.5 rounded-full ${t.color}`} />
            <span
              className={`flex flex-wrap items-baseline gap-x-1.5 leading-tight rounded-lg px-1.5 py-0.5 transition ${
                t.active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700'
              }`}
            >
              <span className={`text-xs font-extrabold ${t.active ? 'text-white' : 'text-slate-900'}`}>{t.name}</span>
              <span className={`text-[11px] font-mono whitespace-nowrap ${t.active ? 'text-slate-200' : 'text-slate-600'}`}>{t.range}</span>
              {t.active && <span className="sr-only">(en uso)</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};
