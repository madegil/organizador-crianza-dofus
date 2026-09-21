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
    consumptionPer10s: 10,
    gainPer10s: 10, // 1.0 XP/s base
    drainDurationSeconds: 80000, // 22 horas, 13 minutos y 20 segundos (80.000 s)
    dustCostGigantesque: 50,
    capacity: 80000,
  },
  2: {
    tier: 2,
    name: 'Filtro',
    rangeMin: 80000,
    rangeMax: 140000,
    consumptionPer10s: 20,
    gainPer10s: 20, // 2.0 XP/s base
    drainDurationSeconds: 30000, // 8 horas y 20 minutos (30.000 s)
    dustCostGigantesque: 200,
    capacity: 60000,
  },
  3: {
    tier: 3,
    name: 'Poción',
    rangeMin: 140000,
    rangeMax: 180000,
    consumptionPer10s: 30,
    gainPer10s: 30, // 3.0 XP/s base
    drainDurationSeconds: 40000 / 3, // 3 horas, 42 minutos y 13 segundos (13.333,33 s)
    dustCostGigantesque: 800,
    capacity: 40000,
  },
  4: {
    tier: 4,
    name: 'Elixir',
    rangeMin: 180000,
    rangeMax: 200000,
    consumptionPer10s: 40,
    gainPer10s: 40, // 4.0 XP/s base
    drainDurationSeconds: 5000, // 1 hora, 23 minutos y 20 segundos (5.000 s)
    dustCostGigantesque: 3200,
    capacity: 20000,
  },
};

// Duración total del vaciado completo continuo de 200.000 a 0: 35 h 38 m 53 s (35 h 39 min)
export const TOTAL_CONTINUOUS_DRAIN_SECONDS = 80000 + 30000 + 40000 / 3 + 5000; // 128.333,33 s

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
