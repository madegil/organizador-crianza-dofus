import React, { useState, useEffect } from 'react';
import type { SpeciesType } from '../types/mount';
import { getColorsFromBreedName } from '../utils/mountColors';

interface MountAvatarProps {
  species: SpeciesType;
  breed: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'card';
  className?: string;
  generation?: number;
}

export const MountAvatar: React.FC<MountAvatarProps> = ({
  species,
  breed,
  imageUrl,
  size = 'md',
  className = '',
  generation,
}) => {
  const [imgError, setImgError] = useState(false);
  const { primary, secondary } = getColorsFromBreedName(breed);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-12 h-12 text-xs',
    lg: 'w-16 h-16 text-sm',
    xl: 'w-24 h-24 text-base',
    card: 'w-20 h-20 sm:w-24 sm:h-24 text-sm',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16',
    card: 'w-16 h-16 sm:w-20 sm:h-20',
  }[size];

  // SVG Stylized Sprites tailored for each Dofus Mount Species
  const renderSpeciesSvg = () => {
    switch (species) {
      case 'dragopavo':
        return (
          <svg viewBox="0 0 64 64" fill="none" className={`${iconSizes} drop-shadow-md z-10`}>
            {/* Cuerpo principal del Dragopavo */}
            <path
              d="M32 12C24 12 18 18 18 26C18 34 22 42 32 46C42 42 46 34 46 26C46 18 40 12 32 12Z"
              fill={primary}
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Cresta / Cabeza secundaria */}
            <path
              d="M32 6C28 6 26 10 28 14C30 18 34 18 36 14C38 10 36 6 32 6Z"
              fill={secondary}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Pico característico */}
            <polygon points="32,20 28,26 36,26" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Ojos */}
            <circle cx="26" cy="18" r="2" fill="#ffffff" />
            <circle cx="26" cy="18" r="1" fill="#0f172a" />
            <circle cx="38" cy="18" r="2" fill="#ffffff" />
            <circle cx="38" cy="18" r="1" fill="#0f172a" />
            {/* Montura / Silla de montar */}
            <rect x="24" y="30" width="16" height="8" rx="3" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
            {/* Franjas / Patrón secundario */}
            <path d="M22 34C26 38 38 38 42 34" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
            {/* Patas */}
            <path d="M26 46L24 58M38 46L40 58" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'muluaga':
        return (
          <svg viewBox="0 0 64 64" fill="none" className={`${iconSizes} drop-shadow-md z-10`}>
            {/* Cuerpo acuático de Muluaga */}
            <path
              d="M32 8C22 8 16 16 18 28C20 40 26 50 32 58C38 50 44 40 46 28C48 16 42 8 32 8Z"
              fill={primary}
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Aleta dorsal secundaria */}
            <path
              d="M32 4C24 4 20 12 24 20C28 20 36 20 40 20C44 12 40 4 32 4Z"
              fill={secondary}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Cuernos / bigotes acuáticos */}
            <path d="M20 20Q12 16 14 26M44 20Q52 16 50 26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            {/* Ojos brillantes */}
            <circle cx="25" cy="22" r="2.5" fill="#38bdf8" />
            <circle cx="25" cy="22" r="1" fill="#0f172a" />
            <circle cx="39" cy="22" r="2.5" fill="#38bdf8" />
            <circle cx="39" cy="22" r="1" fill="#0f172a" />
            {/* Escamas de color secundario */}
            <circle cx="32" cy="32" r="3" fill={secondary} />
            <circle cx="28" cy="40" r="2.5" fill={secondary} />
            <circle cx="36" cy="40" r="2.5" fill={secondary} />
            <circle cx="32" cy="48" r="2" fill={secondary} />
          </svg>
        );

      case 'vueloceronte':
        return (
          <svg viewBox="0 0 64 64" fill="none" className={`${iconSizes} drop-shadow-md z-10`}>
            {/* Cabeza acorazada de Vueloceronte */}
            <path
              d="M20 18L32 10L44 18L48 36L32 54L16 36L20 18Z"
              fill={primary}
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Cuerno frontal imponente */}
            <polygon points="32,4 28,18 36,18" fill={secondary} stroke="#0f172a" strokeWidth="1.5" />
            {/* Cuernos laterales / orejas blindadas */}
            <polygon points="16,14 18,24 10,20" fill={secondary} stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="48,14 46,24 54,20" fill={secondary} stroke="#0f172a" strokeWidth="1.5" />
            {/* Placas de armadura */}
            <path d="M22 28H42M26 38H38" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            {/* Ojos furiosos */}
            <polygon points="24,24 28,26 24,28" fill="#facc15" stroke="#0f172a" strokeWidth="1" />
            <polygon points="40,24 36,26 40,28" fill="#facc15" stroke="#0f172a" strokeWidth="1" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses} ${className}`}>
      {/* Contenedor circular con degradado suave de los colores de la raza */}
      <div
        className="w-full h-full rounded-2xl p-1 flex items-center justify-center shadow-sm border border-slate-200/90 bg-slate-50/80 overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${primary}22 0%, ${secondary}33 100%)`,
        }}
      >
        {/* Glow ambiental */}
        <div
          className="absolute inset-0 opacity-15 blur-sm pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${primary} 0%, ${secondary} 80%)`,
          }}
        />

        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={breed}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain drop-shadow-md z-10"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : (
          renderSpeciesSvg()
        )}
      </div>

      {/* Indicador de Generación si está disponible */}
      {generation && (
        <span
          className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 font-bold border border-slate-700 rounded-md px-1 text-[9px] shadow-sm leading-tight z-20"
          title={`Generación ${generation}`}
        >
          G{generation}
        </span>
      )}
    </div>
  );
};
