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
  // Cruces se dibuja aparte (IconCruces), a partir del SVG de ADN elegido
  cruces: [],
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

/*
  Cruces: doble hélice de ADN a partir del SVG elegido (viewBox 510), pasada a colores planos
  y recoloreada para destacar sobre la madera: peldaños crema, hebras coral y bolitas luminosas.
*/
const HEBRA = '#ff6a3d';
const HEBRA_BRILLO = '#ffb347';
const HEBRA_SOMBRA = '#b8321c';
const BOLITAS = {
  oro: ['#ffc93c', '#ffe27a', '#d4891a'],
  agua: ['#3fb6f5', '#86e0ff', '#1e6fc4'],
  hoja: ['#6fd16a', '#b4f7a4', '#2f8f4a'],
} as const;

export const IconCruces: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 510 510" aria-hidden="true" className={`icono-plano ${className}`}>
    <g fill="#f3e3bd">
      <path d="m78.56 34.756h352.881v11.122h-352.881z" />
      <path d="m78.56 97.294h352.881v11.122h-352.881z" />
      <path d="m125.638 159.833h258.725v11.122h-258.725z" />
      <path d="m78.56 463.684h352.881v11.122h-352.881z" />
      <path d="m78.56 401.145h352.881v11.122h-352.881z" />
      <path d="m125.638 338.607h258.725v11.122h-258.725z" />
    </g>
    <path d="m442.236 509.561c-12.577 0-22.772-10.195-22.772-22.772 0-30.599-7.775-60.955-22.487-87.785-14.711-26.83-36.124-49.708-61.923-66.161l-184.598-117.725c-32.234-20.557-58.987-49.143-77.367-82.665s-28.097-71.45-28.097-109.681c0-12.577 10.195-22.772 22.772-22.772s22.772 10.195 22.772 22.772c0 30.599 7.775 60.955 22.487 87.785 14.711 26.83 36.123 49.708 61.922 66.161l184.597 117.725c32.234 20.557 58.988 49.143 77.368 82.665s28.096 71.45 28.096 109.681c.002 12.577-10.193 22.772-22.77 22.772z" fill={HEBRA} />
    <path d="m436.911 377.108c-18.381-33.522-45.135-62.108-77.368-82.665l-184.597-117.725c-25.799-16.453-47.211-39.331-61.922-66.161-14.712-26.83-22.487-57.186-22.487-87.785 0-9.32-5.601-17.328-13.619-20.852-8.018 3.525-13.619 11.532-13.619 20.852 0 38.231 9.716 76.159 28.096 109.681s45.134 62.108 77.367 82.665l184.597 117.725c25.799 16.453 47.212 39.331 61.923 66.161 14.712 26.83 22.487 57.186 22.487 87.785 0 9.32 5.602 17.328 13.619 20.852 8.018-3.525 13.619-11.532 13.619-20.852.001-38.231-9.715-76.158-28.096-109.681z" fill={HEBRA_BRILLO} fillOpacity={0.55} />
    <path d="m359.543 294.443-82.725-52.757-43.606 26.209 101.842 64.949c10.263 6.545 19.817 14.122 28.546 22.544h59.719c-17.064-24.183-38.759-44.99-63.776-60.945z" fill={HEBRA_SOMBRA} fillOpacity={0.55} />
    <path d="m67.764 509.561c-12.577 0-22.772-10.195-22.772-22.772 0-38.231 9.716-76.159 28.096-109.681s45.134-62.108 77.367-82.665l184.597-117.725c25.799-16.453 47.212-39.331 61.923-66.161 14.712-26.83 22.487-57.186 22.487-87.785.002-12.577 10.197-22.772 22.774-22.772s22.772 10.195 22.772 22.772c0 38.231-9.716 76.159-28.096 109.681s-45.135 62.108-77.368 82.665l-184.598 117.725c-25.799 16.452-47.211 39.331-61.922 66.161-14.712 26.83-22.487 57.186-22.487 87.785-.001 12.577-10.196 22.772-22.773 22.772z" fill={HEBRA} />
    <path d="m174.946 332.843 184.597-117.725c32.234-20.557 58.988-49.143 77.368-82.665s28.096-71.45 28.096-109.681c0-10.104-6.582-18.665-15.69-21.643-9.108 2.978-15.69 11.54-15.69 21.643 0 30.599-7.775 60.955-22.487 87.785-14.711 26.83-36.124 49.708-61.923 66.161l-184.597 117.725c-32.234 20.557-58.987 49.143-77.367 82.665s-28.096 71.45-28.096 109.681c0 10.104 6.582 18.665 15.69 21.643 9.108-2.978 15.69-11.54 15.69-21.643 0-30.599 7.775-60.955 22.487-87.785 14.711-26.83 36.122-49.708 61.922-66.161z" fill={HEBRA_BRILLO} fillOpacity={0.55} />
    <circle cx="255.001" cy="165.394" r="39.337" fill={BOLITAS.oro[0]} />
    <circle cx="255.001" cy="165.394" r="32.83" fill={BOLITAS.oro[1]} />
    <path d="m281.673 136.473c1.079 5.823.857 11.979-.899 18.057-6.03 20.871-27.838 32.903-48.71 26.872-6.077-1.756-11.403-4.851-15.754-8.87 2.627 14.177 12.977 26.379 27.771 30.653 20.872 6.03 42.68-6.001 48.71-26.872 4.275-14.794-.527-30.057-11.118-39.84z" fill={BOLITAS.oro[2]} />
    <circle cx="168.997" cy="406.706" r="39.337" fill={BOLITAS.oro[0]} />
    <circle cx="168.997" cy="406.706" r="32.83" fill={BOLITAS.oro[1]} />
    <path d="m195.67 377.785c1.079 5.823.857 11.979-.899 18.057-6.03 20.871-27.838 32.903-48.71 26.872-6.077-1.756-11.403-4.851-15.754-8.87 2.627 14.177 12.977 26.379 27.771 30.653 20.872 6.03 42.68-6.001 48.71-26.872 4.275-14.794-.527-30.057-11.118-39.84z" fill={BOLITAS.oro[2]} />
    <circle cx="345.026" cy="102.856" r="39.337" fill={BOLITAS.agua[0]} />
    <circle cx="345.026" cy="102.856" r="32.83" fill={BOLITAS.agua[1]} />
    <path d="m362.623 67.667c2.653 5.295 4.149 11.271 4.149 17.597 0 21.725-17.612 39.337-39.337 39.337-6.326 0-12.302-1.495-17.597-4.149 6.459 12.89 19.789 21.74 35.188 21.74 21.725 0 39.337-17.612 39.337-39.337 0-15.399-8.85-28.729-21.74-35.188z" fill={BOLITAS.agua[2]} />
    <circle cx="345.026" cy="470.663" r="39.337" fill={BOLITAS.agua[0]} />
    <circle cx="345.026" cy="470.663" r="32.83" fill={BOLITAS.agua[1]} />
    <path d="m362.623 435.475c2.653 5.295 4.149 11.271 4.149 17.597 0 21.725-17.612 39.337-39.337 39.337-6.326 0-12.302-1.495-17.597-4.149 6.459 12.89 19.789 21.74 35.188 21.74 21.725 0 39.337-17.612 39.337-39.337 0-15.399-8.85-28.73-21.74-35.188z" fill={BOLITAS.agua[2]} />
    <circle cx="160.809" cy="40.317" r="39.337" fill={BOLITAS.hoja[0]} />
    <circle cx="160.809" cy="40.317" r="32.83" fill={BOLITAS.hoja[1]} />
    <path d="m178.405 5.129c2.653 5.295 4.149 11.271 4.149 17.597 0 21.725-17.612 39.337-39.337 39.337-6.326 0-12.302-1.495-17.597-4.149 6.459 12.89 19.789 21.74 35.188 21.74 21.725 0 39.337-17.612 39.337-39.337.001-15.399-8.849-28.729-21.74-35.188z" fill={BOLITAS.hoja[2]} />
    <circle cx="262.082" cy="345.825" r="39.337" fill={BOLITAS.hoja[0]} />
    <circle cx="262.082" cy="345.825" r="32.83" fill={BOLITAS.hoja[1]} />
    <path d="m279.678 310.637c2.653 5.295 4.149 11.271 4.149 17.597 0 21.725-17.612 39.337-39.337 39.337-6.326 0-12.302-1.495-17.597-4.149 6.459 12.89 19.789 21.74 35.188 21.74 21.725 0 39.337-17.612 39.337-39.337.001-15.399-8.849-28.73-21.74-35.188z" fill={BOLITAS.hoja[2]} />
  </svg>
);

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
