import React from 'react';

/*
  Iconos propios del Gestor de monturas, dibujados directamente sobre la madera, sin ficha detrás.

  Cada icono se describe como capas con un papel (relleno principal, secundario, acento, detalle, brillo)
  y se pinta en uno de tres estilos:
  - "juego":   color vivo, contorno de tinta y brillos, como los iconos de la interfaz de Dofus
  - "duotono": un solo color claro con relleno translúcido
  - "relieve": solo contorno claro con una sombra desplazada debajo
*/

export type IconVariant = 'juego' | 'duotono' | 'relieve';
export type DofusIconName = 'guia' | 'establo' | 'calculadora' | 'coleccion' | 'cruces';

type Role = 'principal' | 'secundario' | 'acento' | 'detalle' | 'brillo';

interface Layer {
  role: Role;
  d: string;
  /** Color en el estilo "juego" */
  color?: string;
  width?: number;
}

const TINTA = '#1f1409';

// Formas pensadas en una cuadrícula de 32: siluetas grandes y legibles a 24-28 px
const SHAPES: Record<DofusIconName, Layer[]> = {
  // Libro de la guía: tapa verde, páginas de pergamino y una hoja de marcapáginas
  guia: [
    { role: 'principal', d: 'M5 7.5C5 6 6 5 7.5 5H16v22H7.5A2.5 2.5 0 0 1 5 24.5Z', color: '#5e9a1c' },
    { role: 'secundario', d: 'M16 5h8.5C26 5 27 6 27 7.5v17a2.5 2.5 0 0 1-2.5 2.5H16Z', color: '#f6ecd0' },
    { role: 'detalle', d: 'M19 10.5h5M19 14.5h5M19 18.5h3.5', color: '#8a6a44', width: 1.8 },
    { role: 'acento', d: 'M9 5v9l2.2-1.8L13.4 14V5Z', color: '#f2c14e' },
    { role: 'brillo', d: 'M7.5 9v12', width: 1.6 },
  ],
  // Granero: tejado rojo, paredes de madera y puerta en cruz
  establo: [
    { role: 'secundario', d: 'M6.5 15v12h19V15', color: '#a86b3a' },
    { role: 'principal', d: 'M3 16.5 16 5l13 11.5-2.6 1.6L16 9 5.6 18.1Z', color: '#d2512b' },
    { role: 'acento', d: 'M11.5 18.5h9V27h-9Z', color: '#f2c14e' },
    { role: 'detalle', d: 'm11.5 18.5 9 8.5M20.5 18.5l-9 8.5', color: '#9a6a12', width: 1.6 },
    { role: 'brillo', d: 'M8 15.3 15.5 8.6', width: 1.6 },
  ],
  // Frasco de carburante con experiencia burbujeando
  calculadora: [
    { role: 'secundario', d: 'M12.5 3h7v4.5h-7Z', color: '#8a5a32' },
    { role: 'principal', d: 'M13.3 7.5v5A9.3 9.3 0 1 0 18.7 12.5v-5Z', color: '#eef4dc' },
    { role: 'acento', d: 'M7.6 19.5h16.8a8.4 8.4 0 0 1-16.8 0Z', color: '#7fc23a' },
    { role: 'detalle', d: 'M13 23.6h.1M18 22.2h.1M15.6 25.4h.1', color: '#f6ffe0', width: 2.6 },
    { role: 'brillo', d: 'M10.6 15.4a6.5 6.5 0 0 1 2.7-2.9', width: 1.6 },
  ],
  // Trofeo dorado de la colección
  coleccion: [
    { role: 'secundario', d: 'M8.5 7H5v2.5a5 5 0 0 0 4.6 5M23.5 7H27v2.5a5 5 0 0 1-4.6 5', color: 'none', width: 2.4 },
    { role: 'principal', d: 'M8.5 4.5h15v6.5a7.5 7.5 0 0 1-15 0Z', color: '#f2c14e' },
    { role: 'secundario', d: 'M14 18.2h4V22h-4Z', color: '#d9a22c' },
    { role: 'acento', d: 'M10 27v-2.5c0-1.4 1.1-2.5 2.5-2.5h7c1.4 0 2.5 1.1 2.5 2.5V27Z', color: '#8a5a32' },
    { role: 'detalle', d: 'm16 7.6 1.1 2.2 2.4.3-1.8 1.7.4 2.4-2.1-1.1-2.1 1.1.4-2.4-1.8-1.7 2.4-.3Z', color: '#fff3c4', width: 1.1 },
    { role: 'brillo', d: 'M11.2 7v4', width: 1.6 },
  ],
  // Dos corazones entrelazados: un progenitor de cada lado
  cruces: [
    { role: 'secundario', d: 'M12 25.5S3 20.2 3 13.6A4.8 4.8 0 0 1 12 10.8a4.8 4.8 0 0 1 9 2.8c0 6.6-9 11.9-9 11.9Z', color: '#7fc23a' },
    { role: 'principal', d: 'M20 28s-9-5.3-9-11.9A4.8 4.8 0 0 1 20 13.3a4.8 4.8 0 0 1 9 2.8C29 22.7 20 28 20 28Z', color: '#ef5b84' },
    { role: 'brillo', d: 'M14.2 15.6a2.4 2.4 0 0 1 2.4-2.1', width: 1.8 },
    { role: 'brillo', d: 'M6.2 13.2a2.3 2.3 0 0 1 2.3-2', width: 1.6 },
  ],
};

interface IconProps {
  className?: string;
  variant?: IconVariant;
}

const renderLayer = (l: Layer, i: number, variant: IconVariant) => {
  const isLine = l.role === 'detalle' || l.role === 'brillo' || l.color === 'none';

  if (variant === 'juego') {
    if (l.role === 'brillo') {
      return <path key={i} d={l.d} stroke="#ffffff" strokeOpacity={0.75} strokeWidth={l.width ?? 1.6} fill="none" />;
    }
    if (isLine) {
      return <path key={i} d={l.d} stroke={l.color === 'none' ? TINTA : l.color} strokeWidth={l.width ?? 2} fill="none" />;
    }
    return <path key={i} d={l.d} fill={l.color} stroke={TINTA} strokeWidth={2} />;
  }

  if (variant === 'duotono') {
    if (l.role === 'brillo') return null;
    if (isLine) return <path key={i} d={l.d} stroke="currentColor" strokeWidth={l.width ?? 2} fill="none" />;
    const opacity = l.role === 'principal' ? 0.38 : l.role === 'acento' ? 0.6 : 0.2;
    return (
      <path key={i} d={l.d} fill="currentColor" fillOpacity={opacity} stroke="currentColor" strokeWidth={2} />
    );
  }

  // relieve: solo contorno
  if (l.role === 'brillo') return null;
  return <path key={i} d={l.d} stroke="currentColor" strokeWidth={isLine ? l.width ?? 2 : 2.2} fill="none" />;
};

const makeIcon = (name: DofusIconName): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ className = '', variant = 'juego' }) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={`icono-${variant} ${className}`}
    >
      {SHAPES[name].map((l, i) => renderLayer(l, i, variant))}
    </svg>
  );
  Icon.displayName = `Icon-${name}`;
  return Icon;
};

export const IconGuia = makeIcon('guia');
export const IconEstablo = makeIcon('establo');
export const IconCalculadora = makeIcon('calculadora');
export const IconColeccion = makeIcon('coleccion');
export const IconCruces = makeIcon('cruces');

export const DOFUS_ICONS: Record<DofusIconName, React.FC<IconProps>> = {
  guia: IconGuia,
  establo: IconEstablo,
  calculadora: IconCalculadora,
  coleccion: IconColeccion,
  cruces: IconCruces,
};

/** Icono grande de cabecera de sección, sin marco: solo el dibujo con su sombra */
export const IconMedallon: React.FC<{ name: DofusIconName; className?: string }> = ({ name, className = '' }) => {
  const Icon = DOFUS_ICONS[name];
  return <Icon className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 ${className}`} />;
};
