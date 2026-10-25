import React from 'react';

/*
  Iconos propios del Gestor de monturas, dibujados directamente sobre la madera, sin ficha detrás.

  Cada icono se describe como capas con un papel (relleno principal, secundario, acento, detalle, brillo)
  y se pinta en uno de tres estilos:
  - "juego":   color vivo, contorno de tinta y brillos, como los iconos de la interfaz de Dofus
  - "plano":   igual que "juego" pero sin contorno negro
  - "duotono": un solo color claro con relleno translúcido
  - "relieve": solo contorno claro con una sombra desplazada debajo
*/

export type IconVariant = 'juego' | 'plano' | 'duotono' | 'relieve';
export type DofusIconName = 'guia' | 'establo' | 'calculadora' | 'coleccion' | 'cruces';

type Role = 'principal' | 'secundario' | 'acento' | 'detalle' | 'brillo';

interface Layer {
  role: Role;
  d: string;
  /** Color en el estilo "juego" */
  color?: string;
  width?: number;
  /** Hebra dibujada como trazo de color con este grosor */
  trazo?: number;
}

const TINTA = '#1f1409';

/** Estilo usado en todo el sitio */
export const ICON_VARIANT: IconVariant = 'plano';

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
  // Cerca de cercado: tres postes, dos travesaños clavados y hierba al pie
  establo: [
    { role: 'principal', d: 'M3.8 9.5 L6.2 6 L8.6 9.5 V27 H3.8 Z M13.6 9.5 L16.0 6 L18.4 9.5 V27 H13.6 Z M23.4 9.5 L25.8 6 L28.2 9.5 V27 H23.4 Z', color: '#c98d50' },
    { role: 'secundario', d: 'M3 11.5h26v3.6H3Z M3 18.5h26v3.6H3Z', color: '#a5683a' },
    { role: 'detalle', d: 'M6.2 13.3h.1M16 13.3h.1M25.8 13.3h.1M6.2 20.3h.1M16 20.3h.1M25.8 20.3h.1', color: '#f2c14e', width: 2.2 },
    { role: 'acento', d: 'M2 29c1.5-3.5 4-4.5 6-2.5 1.5-3 4.5-3.5 6.5-1 2-3 5.5-3 7.5 0 2-2.3 4.8-1.5 6 3.5Z', color: '#7fc23a' },
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
  // Doble hélice de ADN: una hebra por progenitor y peldaños entre ellas
  cruces: [
    { role: 'detalle', d: 'M10.8 6.5h10.4M7.5 10h17M10.8 13.5h10.4M10.8 18.5h10.4M7.5 22h17M10.8 25.5h10.4', color: '#f2c14e', width: 2.2 },
    { role: 'secundario', d: 'M16.0 4.0 L13.8 5.0 L11.8 6.0 L10.0 7.0 L8.6 8.0 L7.8 9.0 L7.5 10.0 L7.8 11.0 L8.6 12.0 L10.0 13.0 L11.8 14.0 L13.8 15.0 L16.0 16.0 L18.2 17.0 L20.2 18.0 L22.0 19.0 L23.4 20.0 L24.2 21.0 L24.5 22.0 L24.2 23.0 L23.4 24.0 L22.0 25.0 L20.3 26.0 L18.2 27.0 L16.0 28.0', color: '#ef5b84', trazo: 3.4 },
    { role: 'principal', d: 'M16.0 4.0 L18.2 5.0 L20.2 6.0 L22.0 7.0 L23.4 8.0 L24.2 9.0 L24.5 10.0 L24.2 11.0 L23.4 12.0 L22.0 13.0 L20.2 14.0 L18.2 15.0 L16.0 16.0 L13.8 17.0 L11.8 18.0 L10.0 19.0 L8.6 20.0 L7.8 21.0 L7.5 22.0 L7.8 23.0 L8.6 24.0 L10.0 25.0 L11.7 26.0 L13.8 27.0 L16.0 28.0', color: '#7fc23a', trazo: 3.4 },
  ],
};

interface IconProps {
  className?: string;
  variant?: IconVariant;
}

const renderLayer = (l: Layer, i: number, variant: IconVariant) => {
  const isLine = l.role === 'detalle' || l.role === 'brillo' || l.color === 'none';

  if (variant === 'juego' || variant === 'plano') {
    const outlined = variant === 'juego';
    if (l.role === 'brillo') {
      return <path key={i} d={l.d} stroke="#ffffff" strokeOpacity={0.75} strokeWidth={l.width ?? 1.6} fill="none" />;
    }
    if (l.trazo) {
      return (
        <g key={i}>
          {outlined && <path d={l.d} stroke={TINTA} strokeWidth={l.trazo + 2.4} fill="none" />}
          <path d={l.d} stroke={l.color} strokeWidth={l.trazo} fill="none" />
        </g>
      );
    }
    if (isLine) {
      const c = l.color === 'none' ? (outlined ? TINTA : '#b8861f') : l.color;
      return <path key={i} d={l.d} stroke={c} strokeWidth={l.width ?? 2} fill="none" />;
    }
    return outlined ? (
      <path key={i} d={l.d} fill={l.color} stroke={TINTA} strokeWidth={2} />
    ) : (
      <path key={i} d={l.d} fill={l.color} />
    );
  }

  if (variant === 'duotono') {
    if (l.role === 'brillo') return null;
    if (l.trazo) return <path key={i} d={l.d} stroke="currentColor" strokeWidth={l.trazo - 0.6} fill="none" />;
    if (isLine) return <path key={i} d={l.d} stroke="currentColor" strokeWidth={l.width ?? 2} fill="none" />;
    const opacity = l.role === 'principal' ? 0.38 : l.role === 'acento' ? 0.6 : 0.2;
    return (
      <path key={i} d={l.d} fill="currentColor" fillOpacity={opacity} stroke="currentColor" strokeWidth={2} />
    );
  }

  // relieve: solo contorno
  if (l.role === 'brillo') return null;
  if (l.trazo) return <path key={i} d={l.d} stroke="currentColor" strokeWidth={2.4} fill="none" />;
  return <path key={i} d={l.d} stroke="currentColor" strokeWidth={isLine ? l.width ?? 2 : 2.2} fill="none" />;
};

const makeIcon = (name: DofusIconName): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ className = '', variant = ICON_VARIANT }) => (
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
