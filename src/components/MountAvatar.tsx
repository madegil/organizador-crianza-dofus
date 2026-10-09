import React, { useState } from 'react';
import type { SpeciesType } from '../types/mount';

interface MountAvatarProps {
  species: SpeciesType;
  breed: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  generation?: number;
  className?: string;
  imageUrl?: string;
}

const SIZE_CONFIG = {
  xs: {
    container: 'w-6 h-6 rounded-md text-xs',
    img: 'w-5 h-5',
    emoji: 'text-xs',
    badge: 'text-[9px] w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    border: 'border',
  },
  sm: {
    container: 'w-8 h-8 rounded-lg text-sm',
    img: 'w-7 h-7',
    emoji: 'text-sm',
    badge: 'text-[10px] w-4 h-4 -bottom-1 -right-1',
    border: 'border',
  },
  md: {
    container: 'w-10 h-10 rounded-xl text-base',
    img: 'w-9 h-9',
    emoji: 'text-base',
    badge: 'text-xs w-5 h-5 -bottom-1 -right-1',
    border: 'border-2',
  },
  lg: {
    container: 'w-14 h-14 rounded-2xl text-xl',
    img: 'w-12 h-12',
    emoji: 'text-xl',
    badge: 'text-xs w-5 h-5 -bottom-1 -right-1',
    border: 'border-2',
  },
  xl: {
    container: 'w-20 h-20 rounded-3xl text-3xl',
    img: 'w-16 h-16',
    emoji: 'text-3xl',
    badge: 'text-sm w-6 h-6 -bottom-1.5 -right-1.5',
    border: 'border-2',
  },
};

const BREED_COLORS: Record<string, { primary: string; secondary: string }> = {
  // Dragopavos
  Almendrado: { primary: '#F59E0B', secondary: '#D97706' },
  Pelirrojo: { primary: '#EF4444', secondary: '#B91C1C' },
  Dorado: { primary: '#FBBF24', secondary: '#F59E0B' },
  Índigo: { primary: '#3B82F6', secondary: '#1D4ED8' },
  Ébano: { primary: '#374151', secondary: '#111827' },
  Púrpura: { primary: '#8B5CF6', secondary: '#6D28D9' },
  Orquídea: { primary: '#EC4899', secondary: '#BE185D' },
  Turquesa: { primary: '#06B6D4', secondary: '#0E7490' },
  Marfil: { primary: '#F3F4F6', secondary: '#E5E7EB' },
  Esmeralda: { primary: '#10B981', secondary: '#047857' },
  Ciruela: { primary: '#7C3AED', secondary: '#4C1D95' },
  Armadura: { primary: '#64748B', secondary: '#334155' },
  Kramac: { primary: '#0284C7', secondary: '#0369A1' },

  // Mulaguas
  Dorado_M: { primary: '#FCD34D', secondary: '#F59E0B' },
  Índigo_M: { primary: '#60A5FA', secondary: '#2563EB' },
  Ébano_M: { primary: '#4B5563', secondary: '#1F2937' },
  Púrpura_M: { primary: '#A78BFA', secondary: '#7C3AED' },
  Orquídea_M: { primary: '#F472B6', secondary: '#DB2777' },

  // Vuelocerontes
  Dorado_V: { primary: '#FDE68A', secondary: '#D97706' },
  Índigo_V: { primary: '#93C5FD', secondary: '#1D4ED8' },
  Ébano_V: { primary: '#6B7280', secondary: '#111827' },
};

function getBreedColors(breed: string): { primary: string; secondary: string } {
  const normalized = breed.trim();
  if (BREED_COLORS[normalized]) {
    return BREED_COLORS[normalized];
  }
  for (const [key, colors] of Object.entries(BREED_COLORS)) {
    if (normalized.toLowerCase().includes(key.toLowerCase().split('_')[0])) {
      return colors;
    }
  }
  return { primary: '#94A3B8', secondary: '#64748B' };
}

const SPECIES_CONFIG: Record<
  SpeciesType,
  {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  dragopavo: {
    bg: 'from-amber-500/10 via-amber-600/5 to-slate-900/60',
    border: 'border-amber-400/40',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-amber-950 font-black',
    badgeBorder: 'border-amber-300',
  },
  muluaga: {
    bg: 'from-sky-500/10 via-blue-600/5 to-slate-900/60',
    border: 'border-sky-400/40',
    badgeBg: 'bg-sky-500',
    badgeText: 'text-sky-950 font-black',
    badgeBorder: 'border-sky-300',
  },
  vueloceronte: {
    bg: 'from-emerald-500/10 via-teal-600/5 to-slate-900/60',
    border: 'border-emerald-400/40',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-emerald-950 font-black',
    badgeBorder: 'border-emerald-300',
  },
};

export const MountAvatar: React.FC<MountAvatarProps> = ({
  species,
  breed,
  size = 'md',
  showBadge = true,
  generation,
  className = '',
  imageUrl,
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeConfig = SIZE_CONFIG[size];
  const speciesConfig = SPECIES_CONFIG[species] || SPECIES_CONFIG.dragopavo;
  const { primary, secondary } = getBreedColors(breed);

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {/* Contenedor Principal */}
      <div
        className={`
          ${sizeConfig.container}
          ${sizeConfig.border}
          ${speciesConfig.border}
          bg-gradient-to-br ${speciesConfig.bg}
          relative flex items-center justify-center
          overflow-hidden shadow-inner select-none
          transition-transform duration-200 group-hover:scale-105
        `}
        style={{
          boxShadow: `0 0 12px ${primary}25, inset 0 1px 1px rgba(255,255,255,0.15)`,
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
            decoding="async"
            className="w-full h-full object-contain drop-shadow-md z-10"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full z-10">
            <span
              className={`font-black uppercase tracking-wider text-slate-100 ${
                size === 'xs' ? 'text-[9px]' : size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-xs' : 'text-sm'
              }`}
            >
              {breed.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Badge de Generación */}
      {showBadge && generation && (
        <span
          className={`
            absolute ${sizeConfig.badge}
            ${speciesConfig.badgeBg} ${speciesConfig.badgeText}
            border ${speciesConfig.badgeBorder}
            rounded-full flex items-center justify-center
            shadow-sm font-mono leading-none z-20
          `}
          title={`Generación ${generation}`}
        >
          {generation}
        </span>
      )}
    </div>
  );
};
