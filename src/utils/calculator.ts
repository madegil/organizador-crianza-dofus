import { FUEL_TIERS, FUEL_VARIANTS, FUEL_ITEM_NAMES, MAX_MOUNT_XP, MAX_ENCLOS_GAUGE } from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';

export function calculateRemainingXp(currentXp: number, targetXp: number = MAX_MOUNT_XP): number {
  return Math.max(0, targetXp - currentXp);
}

export function formatDurationSpanish(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  if (rounded <= 0) return '0 segundos';

  const days = Math.floor(rounded / 86400);
  const hours = Math.floor((rounded % 86400) / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  if (seconds > 0 && days === 0) parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);

  if (parts.length === 0) return '0 segundos';
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
}

export function formatSecondsToTime(totalSeconds: number): string {
  return formatDurationSpanish(totalSeconds);
}

export interface TierFuelBreakdown {
  tier: FuelTier;
  tierName: string;
  itemName: string;
  rangeLabel: string;
  drainDurationText: string;
  xpNeeded: number;
  maxTierCapacity: number;
  itemsNeeded: number;
  variantValue: number;
  effectiveXpAdded: number;
}

export interface FuelBreakdownResult {
  totalXp: number;
  variant: FuelVariant;
  variantValue: number;
  fullCycles: number;
  remainderXp: number;
  tiers: TierFuelBreakdown[];
  totalItemsNeeded: number;
  totalDurationSeconds: number;
  formattedTotalTime: string;
}

export function calculateFuelBreakdown(
  xpNeeded: number,
  variant: FuelVariant = 'gigantesco',
  isSage: boolean = false
): FuelBreakdownResult {
  const safeXp = Math.max(0, Math.round(xpNeeded));
  const variantInfo = FUEL_VARIANTS[variant] || FUEL_VARIANTS.gigantesco;
  const variantVal = variantInfo.durability;

  const fullCycles = Math.floor(safeXp / MAX_ENCLOS_GAUGE);
  const remainderXp = safeXp % MAX_ENCLOS_GAUGE;

  // Distribución exacta de XP por nivel respetando sus limitantes:
  // Nivel 1 - Extracto: 0 - 80.000 (capacidad 80k)
  // Nivel 2 - Filtro: 80.000 - 140.000 (capacidad 60k)
  // Nivel 3 - Poción: 140.000 - 180.000 (capacidad 40k)
  // Nivel 4 - Elixir: 180.000 - 200.000 (capacidad 20k)
  const t1_xp = fullCycles * 80000 + Math.min(remainderXp, 80000);
  const t2_xp = fullCycles * 60000 + Math.max(0, Math.min(remainderXp - 80000, 60000));
  const t3_xp = fullCycles * 40000 + Math.max(0, Math.min(remainderXp - 140000, 40000));
  const t4_xp = fullCycles * 20000 + Math.max(0, Math.min(remainderXp - 180000, 20000));

  const tierXpMap: Record<FuelTier, number> = {
    1: t1_xp,
    2: t2_xp,
    3: t3_xp,
    4: t4_xp,
  };

  const rangeLabels: Record<FuelTier, string> = {
    1: '0 - 80.000',
    2: '80.000 - 140.000',
    3: '140.000 - 180.000',
    4: '180.000 - 200.000',
  };

  const drainTexts: Record<FuelTier, string> = {
    1: '14 horas y 16 minutos',
    2: '10 horas y 41 minutos',
    3: '7 horas y 08 minutos',
    4: '3 horas y 34 minutos',
  };

  const tiers: TierFuelBreakdown[] = ([1, 2, 3, 4] as FuelTier[]).map((tier) => {
    const xp = tierXpMap[tier];
    const items = xp > 0 ? Math.ceil(xp / variantVal) : 0;
    const itemName = FUEL_ITEM_NAMES[tier][variant];
    const tierInfo = FUEL_TIERS[tier];

    return {
      tier,
      tierName: tierInfo.name,
      itemName,
      rangeLabel: rangeLabels[tier],
      drainDurationText: drainTexts[tier],
      xpNeeded: xp,
      maxTierCapacity: tier === 1 ? 80000 : tier === 2 ? 60000 : tier === 3 ? 40000 : 20000,
      itemsNeeded: items,
      variantValue: variantVal,
      effectiveXpAdded: items * variantVal,
    };
  });

  const totalItemsNeeded = tiers.reduce((acc, t) => acc + t.itemsNeeded, 0);

  // Cálculo de tiempo exacto de vaciado según cada tier
  let totalDurationSeconds = 0;
  totalDurationSeconds += t1_xp * (FUEL_TIERS[1].drainDurationSeconds / 80000);
  totalDurationSeconds += t2_xp * (FUEL_TIERS[2].drainDurationSeconds / 60000);
  totalDurationSeconds += t3_xp * (FUEL_TIERS[3].drainDurationSeconds / 40000);
  totalDurationSeconds += t4_xp * (FUEL_TIERS[4].drainDurationSeconds / 20000);

  if (isSage) {
    totalDurationSeconds /= 2;
  }

  return {
    totalXp: safeXp,
    variant,
    variantValue: variantVal,
    fullCycles,
    remainderXp,
    tiers,
    totalItemsNeeded,
    totalDurationSeconds,
    formattedTotalTime: formatDurationSpanish(totalDurationSeconds),
  };
}

export interface FuelCalculation {
  xpNeeded: number;
  secondsNeeded: number;
  formattedTime: string;
  itemsNeeded: number;
  variant: FuelVariant;
  breakdown: FuelBreakdownResult;
}

export function calculateFuelForXp(
  xpNeeded: number,
  tier: FuelTier = 1,
  variant: FuelVariant = 'gigantesco',
  isSage: boolean = false
): FuelCalculation {
  const res = calculateFuelBreakdown(xpNeeded, variant, isSage);
  return {
    xpNeeded,
    secondsNeeded: res.totalDurationSeconds,
    formattedTime: res.formattedTotalTime,
    itemsNeeded: res.totalItemsNeeded,
    variant,
    breakdown: res,
  };
}

export interface BatchCalculationResult {
  totalMounts: number;
  maxSecondsNeeded: number;
  formattedTotalTime: string;
  totalFuelUnitsConsumed: number;
  itemsNeeded: number;
  dustCostTotal: number;
  mountsBreakdown: Array<{
    mount: UserMount;
    xpNeeded: number;
    individualSeconds: number;
    individualFormattedTime: string;
  }>;
}

export function calculateEnclosBatch(
  mounts: UserMount[],
  tier: FuelTier = 1,
  variant: FuelVariant = 'gigantesco',
  targetXp: number = MAX_MOUNT_XP
): BatchCalculationResult {
  const breakdown = mounts.map((mount) => {
    const xpNeeded = calculateRemainingXp(mount.currentXp, targetXp);
    const isSage = mount.capacity === 'sabia';
    const res = calculateFuelBreakdown(xpNeeded, variant, isSage);

    return {
      mount,
      xpNeeded,
      individualSeconds: res.totalDurationSeconds,
      individualFormattedTime: res.formattedTotalTime,
    };
  });

  const maxSecondsNeeded = breakdown.length > 0 ? Math.max(...breakdown.map((b) => b.individualSeconds)) : 0;
  const maxMountBreakdown = mounts.length > 0
    ? calculateFuelBreakdown(
        Math.max(...mounts.map((m) => calculateRemainingXp(m.currentXp, targetXp))),
        variant,
        false
      )
    : null;

  const itemsNeeded = maxMountBreakdown ? maxMountBreakdown.totalItemsNeeded : 0;
  const totalFuelUnitsConsumed = itemsNeeded * (FUEL_VARIANTS[variant]?.durability || 10000);
  const dustCostTotal = itemsNeeded * 200;

  return {
    totalMounts: mounts.length,
    maxSecondsNeeded,
    formattedTotalTime: formatDurationSpanish(maxSecondsNeeded),
    totalFuelUnitsConsumed,
    itemsNeeded,
    dustCostTotal,
    mountsBreakdown: breakdown,
  };
}
