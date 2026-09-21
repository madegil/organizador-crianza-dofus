import type { FuelInfo, FuelTier, FuelVariant } from '../types/mount';

export { MAX_MOUNT_XP, MOUNT_LEVEL_XP_THRESHOLDS, calculateLevelFromXp, calculateXpForLevel } from './mountXpTable';
export const LEVEL_100_XP = 172668;
export const MAX_ENCLOS_GAUGE = 200000;
export const MAX_MOUNT_BREEDING_STAT = 20000;

export const FUEL_TIERS: Record<FuelTier, FuelInfo> = {
  1: {
    tier: 1,
    name: 'Extracto',
    rangeMin: 0,
    rangeMax: 80000,
    consumptionPer10s: 15.576,
    gainPer10s: 15.576,
    drainDurationSeconds: 14 * 3600 + 16 * 60, // 14 horas y 16 minutos (51.360 s)
    dustCostGigantesque: 50,
  },
  2: {
    tier: 2,
    name: 'Filtro',
    rangeMin: 80000,
    rangeMax: 140000,
    consumptionPer10s: 15.6,
    gainPer10s: 15.6,
    drainDurationSeconds: 10 * 3600 + 41 * 60, // 10 horas y 41 minutos (38.460 s)
    dustCostGigantesque: 200,
  },
  3: {
    tier: 3,
    name: 'Poción',
    rangeMin: 140000,
    rangeMax: 180000,
    consumptionPer10s: 15.576,
    gainPer10s: 15.576,
    drainDurationSeconds: 7 * 3600 + 8 * 60, // 7 horas y 08 minutos (25.680 s)
    dustCostGigantesque: 800,
  },
  4: {
    tier: 4,
    name: 'Elixir',
    rangeMin: 180000,
    rangeMax: 200000,
    consumptionPer10s: 15.576,
    gainPer10s: 15.576,
    drainDurationSeconds: 3 * 3600 + 34 * 60, // 3 horas y 34 minutos (12.840 s)
    dustCostGigantesque: 3200,
  },
};

export const FUEL_VARIANTS: Record<FuelVariant, { name: string; durability: number }> = {
  gigantesco: { name: 'Gigantesco', durability: 10000 },
  grande: { name: 'Grande', durability: 8000 },
  normal: { name: 'Normal', durability: 6000 },
  pequeno: { name: 'Pequeño', durability: 4000 },
  minusculo: { name: 'Minúsculo', durability: 2000 },
};

export const FUEL_ITEM_NAMES: Record<FuelTier, Record<FuelVariant, string>> = {
  1: {
    gigantesco: 'Extracto gigantesco de experiencia de montura',
    grande: 'Extracto grande de experiencia de montura',
    normal: 'Extracto de experiencia de montura',
    pequeno: 'Extracto pequeño de experiencia de montura',
    minusculo: 'Extracto minúsculo de experiencia de montura',
  },
  2: {
    gigantesco: 'Filtro gigantesco de experiencia de montura',
    grande: 'Filtro grande de experiencia de montura',
    normal: 'Filtro de experiencia de montura',
    pequeno: 'Filtro pequeño de experiencia de montura',
    minusculo: 'Filtro minúsculo de experiencia de montura',
  },
  3: {
    gigantesco: 'Pócima gigantesca de experiencia de montura',
    grande: 'Pócima grande de experiencia de montura',
    normal: 'Pócima de experiencia de montura',
    pequeno: 'Pócima pequeña de experiencia de montura',
    minusculo: 'Pócima minúscula de experiencia de montura',
  },
  4: {
    gigantesco: 'Elixir gigantesco de experiencia de montura',
    grande: 'Elixir grande de experiencia de montura',
    normal: 'Elixir de experiencia de montura',
    pequeno: 'Elixir pequeño de experiencia de montura',
    minusculo: 'Elixir minúsculo de experiencia de montura',
  },
};
