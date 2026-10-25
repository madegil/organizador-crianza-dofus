import React from 'react';

/*
  Iconos propios del Gestor de monturas.
  Estilo de icono de juego: formas rellenas a dos tonos, contorno grueso de tinta y un brillo,
  como el rótulo del logo. Los colores son fijos para que se reconozcan en madera y en pergamino.
*/

const TINTA = '#25180c';
const HOJA = '#88b43a';
const HOJA_OSC = '#4a7a12';
const KAMA = '#f2c14e';
const KAMA_OSC = '#b8861f';
const PERG = '#fbf4e1';
const PERG_OSC = '#dfcb9f';
const TEJA = '#c4572e';
const TEJA_OSC = '#8f3a1c';
const MADERA = '#8a5a32';
const MADERA_OSC = '#5c3a1e';
const ROSA = '#e8557a';

export type DofusIconName = 'guia' | 'establo' | 'calculadora' | 'coleccion' | 'cruces';

interface IconProps {
  className?: string;
}

const base = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: TINTA,
  strokeWidth: 2,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
  'aria-hidden': true,
};

/** Guía: pergamino enrollado con una hoja como marcapáginas */
export const IconGuia: React.FC<IconProps> = ({ className }) => (
  <svg {...base} className={className}>
    <path d="M8 6h15a3 3 0 0 1 3 3v16a2 2 0 0 1-2 2H10a3 3 0 0 1-3-3V7" fill={PERG} />
    <path d="M7 7a2 2 0 0 0-4 0v3h4" fill={PERG_OSC} />
    <path d="M11 12h10M11 16h10M11 20h6" stroke={MADERA} strokeWidth="1.8" />
    <path d="M22 3c-3 1-4.5 4-3.5 7 3-.3 5.2-2.8 3.5-7Z" fill={HOJA} />
    <path d="M19 9.5 21.5 5" stroke={HOJA_OSC} strokeWidth="1.4" />
  </svg>
);

/** Establo: granero de tejado rojo con puerta en cruz */
export const IconEstablo: React.FC<IconProps> = ({ className }) => (
  <svg {...base} className={className}>
    <path d="M6 14v13h20V14" fill={MADERA} />
    <path d="M3 15 16 5l13 10" fill={TEJA} />
    <path d="M7.5 12.5 16 6l8.5 6.5" stroke={TEJA_OSC} strokeWidth="1.4" fill="none" />
    <rect x="11" y="17" width="10" height="10" fill={KAMA} />
    <path d="m11 17 10 10M21 17 11 27" stroke={KAMA_OSC} strokeWidth="1.6" />
    <path d="M9 12.2h0" stroke={PERG} strokeWidth="2.5" />
  </svg>
);

/** Calculadora: frasco de carburante con experiencia burbujeando */
export const IconCalculadora: React.FC<IconProps> = ({ className }) => (
  <svg {...base} className={className}>
    <rect x="12.5" y="2.5" width="7" height="4" rx="1" fill={MADERA} />
    <path d="M13.5 6.5v5.2a9 9 0 1 0 5 0V6.5Z" fill={PERG} />
    <path d="M8.2 19.5a7.8 7.8 0 0 0 15.6 0Z" fill={HOJA} stroke="none" />
    <path d="M13.5 6.5v5.2a9 9 0 1 0 5 0V6.5Z" fill="none" />
    <path d="M8.3 19.5h15.4" stroke={HOJA_OSC} strokeWidth="1.4" />
    <circle cx="13" cy="23.5" r="1.3" fill={PERG} stroke="none" />
    <circle cx="18" cy="22" r="0.9" fill={PERG} stroke="none" />
    <path d="M11 15.5a5.5 5.5 0 0 1 2.5-2.8" stroke="#fff" strokeWidth="1.4" opacity="0.8" />
  </svg>
);

/** Colección: medalla dorada con estrella y cinta verde */
export const IconColeccion: React.FC<IconProps> = ({ className }) => (
  <svg {...base} className={className}>
    <path d="m10 3 3.5 8M22 3l-3.5 8" stroke={TINTA} strokeWidth="5" />
    <path d="m10 3 3.5 8M22 3l-3.5 8" stroke={HOJA} strokeWidth="2.6" />
    <circle cx="16" cy="19.5" r="9" fill={KAMA} />
    <circle cx="16" cy="19.5" r="6" fill="none" stroke={KAMA_OSC} strokeWidth="1.4" />
    <path
      d="m16 15.5 1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3Z"
      fill={PERG}
      strokeWidth="1.2"
    />
  </svg>
);

/** Cruces: dos corazones entrelazados, uno de cada progenitor */
export const IconCruces: React.FC<IconProps> = ({ className }) => (
  <svg {...base} className={className}>
    <path
      d="M12 26S3 20.5 3 13.8A4.8 4.8 0 0 1 12 11a4.8 4.8 0 0 1 9 2.8C21 20.5 12 26 12 26Z"
      fill={HOJA}
    />
    <path
      d="M20 28s-9-5.5-9-12.2A4.8 4.8 0 0 1 20 13a4.8 4.8 0 0 1 9 2.8C29 22.5 20 28 20 28Z"
      fill={ROSA}
    />
    <path d="M14 15.5a2.3 2.3 0 0 1 2.3-2" stroke={PERG} strokeWidth="1.6" />
  </svg>
);

export const DOFUS_ICONS: Record<DofusIconName, React.FC<IconProps>> = {
  guia: IconGuia,
  establo: IconEstablo,
  calculadora: IconCalculadora,
  coleccion: IconColeccion,
  cruces: IconCruces,
};

/** Medallón de pergamino para la cabecera de cada sección */
export const IconMedallon: React.FC<{ name: DofusIconName; className?: string }> = ({ name, className = '' }) => {
  const Icon = DOFUS_ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={`medallon grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 border-2 border-slate-300 shadow-[inset_0_1px_0_rgba(255,250,235,0.8),0_3px_0_#c4ac80] shrink-0 ${className}`}
    >
      <Icon className="w-8 h-8 sm:w-9 sm:h-9" />
    </span>
  );
};
