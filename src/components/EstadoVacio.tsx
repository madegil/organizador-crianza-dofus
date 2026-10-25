import React from 'react';

interface EstadoVacioProps {
  titulo: string;
  children?: React.ReactNode;
}

/** Huevo bicolor con el anillo de generaciones: se tambalea al pasar el ratón, como a punto de eclosionar */
const HuevoGeneraciones: React.FC = () => {
  const clipId = `huevo-${React.useId().replace(/:/g, '')}`;
  return (
  <svg viewBox="0 0 96 112" className="huevo w-20 h-24" aria-hidden="true">
    <ellipse cx="48" cy="104" rx="26" ry="5" fill="#000" opacity="0.18" />
    <defs>
      <clipPath id={clipId}>
        <path d="M48 6C27 6 12 40 12 66c0 22 16 38 36 38s36-16 36-38C84 40 69 6 48 6Z" />
      </clipPath>
    </defs>
    <g clipPath={`url(#${clipId})`}>
      <rect width="96" height="112" fill="#88B43A" />
      <rect x="48" width="48" height="112" fill="#F2C14E" />
      <path d="M12 58c12 6 24-6 36 0s24 6 36 0v8c-12 6-24-6-36 0s-24 6-36 0Z" fill="#FBF4E1" opacity="0.9" />
      <ellipse cx="34" cy="34" rx="7" ry="11" fill="#fff" opacity="0.35" />
    </g>
    <path
      d="M48 6C27 6 12 40 12 66c0 22 16 38 36 38s36-16 36-38C84 40 69 6 48 6Z"
      fill="none"
      stroke="#2A1F12"
      strokeWidth="3"
    />
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={i} cx={20 + i * 6.2} cy={62 + Math.sin(i) * 1.5} r="1.6" fill="#2A1F12" opacity="0.55" />
    ))}
  </svg>
  );
};

export const EstadoVacio: React.FC<EstadoVacioProps> = ({ titulo, children }) => (
  <div className="estado-vacio flex flex-col items-center text-center gap-3 py-10 px-4">
    <HuevoGeneraciones />
    <p className="font-display text-xl text-slate-900">{titulo}</p>
    {children && <div className="text-sm text-slate-600 max-w-md">{children}</div>}
  </div>
);
