import React from 'react';

interface XpGaugeProps {
  currentXp: number; // 0 a 200.000
  maxGauge?: number; // 200.000 por defecto
  className?: string;
}

/**
 * Medidor de Experiencia oficial del pesebre (0 a 200.000 XP).
 * Distribuido exactamente en 4 zonas con marcas a 80k, 140k, 180k y 200k.
 * Diseño fiel a la referencia visual (XP.PNG / XP_Medidor.png) sin texto quemado.
 */
export const XpGauge: React.FC<XpGaugeProps> = ({
  currentXp,
  maxGauge = 200000,
  className = '',
}) => {
  const safeXp = Math.min(maxGauge, Math.max(0, currentXp));
  const percentage = maxGauge > 0 ? Math.min(100, Math.max(0, (safeXp / maxGauge) * 100)) : 0;

  return (
    <div
      className={`relative bg-[#222225] border-2 border-[#dfc38c] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between shadow-2xl shadow-black/80 select-none w-20 sm:w-24 flex-shrink-0 ${className}`}
      title={`Medidor de XP: ${safeXp.toLocaleString()} / ${maxGauge.toLocaleString()} XP`}
    >
      {/* Barra vertical (Track) */}
      <div className="relative w-8 sm:w-9 h-64 sm:h-72 bg-[#0d0d0f] rounded-sm border border-[#3d372b] overflow-hidden flex flex-col justify-end shadow-inner">
        {/* Relleno dinámico de XP */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#dfbe76] to-[#f4d697] transition-all duration-300 ease-out flex flex-col justify-start"
          style={{ height: `${percentage}%` }}
        >
          {/* Brillo superior blanco (highlight bar) */}
          <div className="w-full h-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* Marcas de distribución oficial según XP_Medidor.png:
            - Nivel 1 Extracto max: 80.000 (40% de la altura)
            - Nivel 2 Filtro max: 140.000 (70% de la altura)
            - Nivel 3 Pócima max: 180.000 (90% de la altura)
            (Sin texto incrustado, solo la distribución visual)
        */}
        <div
          className="absolute left-0 right-0 h-[2px] bg-[#161618] z-10 pointer-events-none shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
          style={{ bottom: '40%' }}
        />
        <div
          className="absolute left-0 right-0 h-[2px] bg-[#161618] z-10 pointer-events-none shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
          style={{ bottom: '70%' }}
        />
        <div
          className="absolute left-0 right-0 h-[2px] bg-[#161618] z-10 pointer-events-none shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
          style={{ bottom: '90%' }}
        />
      </div>

      {/* Insignia Circular inferior "XP" */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#161618] border border-[#35353d] flex items-center justify-center mt-2.5 shadow-md shadow-black/60">
        <span className="font-black text-sm sm:text-base tracking-widest text-[#eed496] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-mono">
          XP
        </span>
      </div>
    </div>
  );
};
