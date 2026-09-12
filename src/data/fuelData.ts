import type { FuelInfo, FuelTier, FuelVariant } from '../types/mount';

export { MAX_MOUNT_XP, MOUNT_LEVEL_XP_THRESHOLDS, calculateLevelFromXp, calculateXpForLevel } from './mountXpTable';
export const LEVEL_100_XP = 172668;
export const MAX_ENCLOS_GAUGE = 100000;
export const MAX_MOUNT_BREEDING_STAT = 20000;

export const FUEL_TIERS: Record<FuelTier, FuelInfo> = {
  1: {
    tier: 1,
    name: 'Extracto',
    rangeMin: 0,
    rangeMax: 40000,
    consumptionPer10s: 10,
    gainPer10s: 10, // 1 XP/s
    drainDurationSeconds: 11 * 3600 + 6 * 60, // 11h 06m
    dustCostGigantesque: 50,
  },
  2: {
    tier: 2,
    name: 'Filtro',
    rangeMin: 40001,
    rangeMax: 70000,
    consumptionPer10s: 20,
    gainPer10s: 20, // 2 XP/s
    drainDurationSeconds: 4 * 3600 + 9 * 60, // 4h 09m
    dustCostGigantesque: 200,
  },
  3: {
    tier: 3,
    name: 'Poción',
    rangeMin: 70001,
    rangeMax: 90000,
    consumptionPer10s: 30,
    gainPer10s: 30, // 3 XP/s
    drainDurationSeconds: 1 * 3600 + 51 * 60, // 1h 51m
    dustCostGigantesque: 800,
  },
  4: {
    tier: 4,
    name: 'Elixir',
    rangeMin: 90001,
    rangeMax: 100000,
    consumptionPer10s: 40,
    gainPer10s: 40, // 4 XP/s
    drainDurationSeconds: 42 * 60, // 42m
    dustCostGigantesque: 3200,
  },
};

export const FUEL_VARIANTS: Record<FuelVariant, { name: string; durability: number }> = {
  minusculo: { name: 'Minúsculo', durability: 1000 },
  pequeno: { name: 'Pequeño', durability: 2000 },
  normal: { name: 'Normal', durability: 3000 },
  grande: { name: 'Grande', durability: 4000 },
  gigantesco: { name: 'Gigantesco', durability: 5000 },
};
