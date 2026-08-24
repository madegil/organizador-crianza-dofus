import { FUEL_TIERS, FUEL_VARIANTS, MAX_MOUNT_XP, LEVEL_100_XP } from '../data/fuelData';
import type { FuelTier, FuelVariant, UserMount } from '../types/mount';

export function calculateRemainingXp(currentXp: number, targetXp: number = MAX_MOUNT_XP): number {
  return Math.max(0, targetXp - currentXp);
}

export function formatSecondsToTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

export interface FuelCalculation {
  xpNeeded: number;
  effectiveXpPerSec: number;
  secondsNeeded: number;
  formattedTime: string;
  pulsesCount: number;
  totalFuelUnits: number;
  itemsNeeded: number;
  variant: FuelVariant;
  dustCost: number;
}

export function calculateFuelForXp(
  xpNeeded: number,
  tier: FuelTier = 2,
  variant: FuelVariant = 'gigantesque',
  isSage: boolean = false
): FuelCalculation {
  const tierInfo = FUEL_TIERS[tier];
  const variantInfo = FUEL_VARIANTS[variant];

  // Base gain per second (Tier 1: 1/s, Tier 2: 2/s, Tier 3: 3/s, Tier 4: 4/s)
  const baseGainPerSec = tierInfo.gainPer10s / 10;
  const effectiveXpPerSec = isSage ? baseGainPerSec * 2 : baseGainPerSec;

  const secondsNeeded = effectiveXpPerSec > 0 ? Math.ceil(xpNeeded / effectiveXpPerSec) : 0;
  const pulsesCount = Math.ceil(secondsNeeded / 10);
  const totalFuelUnits = pulsesCount * tierInfo.consumptionPer10s;
  const itemsNeeded = Math.ceil(totalFuelUnits / variantInfo.durability);
  const dustCost = itemsNeeded * tierInfo.dustCostGigantesque;

  return {
    xpNeeded,
    effectiveXpPerSec,
    secondsNeeded,
    formattedTime: formatSecondsToTime(secondsNeeded),
    pulsesCount,
    totalFuelUnits,
    itemsNeeded,
    variant,
    dustCost,
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
  tier: FuelTier = 2,
  variant: FuelVariant = 'gigantesque',
  targetXp: number = MAX_MOUNT_XP
): BatchCalculationResult {
  const tierInfo = FUEL_TIERS[tier];
  const variantInfo = FUEL_VARIANTS[variant];

  const breakdown = mounts.map((mount) => {
    const xpNeeded = calculateRemainingXp(mount.currentXp, targetXp);
    const isSage = mount.capacity === 'sage';
    const effectiveGainPerSec = isSage ? (tierInfo.gainPer10s / 10) * 2 : tierInfo.gainPer10s / 10;
    const individualSeconds = effectiveGainPerSec > 0 ? Math.ceil(xpNeeded / effectiveGainPerSec) : 0;

    return {
      mount,
      xpNeeded,
      individualSeconds,
      individualFormattedTime: formatSecondsToTime(individualSeconds),
    };
  });

  const maxSecondsNeeded = breakdown.length > 0 ? Math.max(...breakdown.map((b) => b.individualSeconds)) : 0;
  const pulsesCount = Math.ceil(maxSecondsNeeded / 10);
  const totalFuelUnitsConsumed = pulsesCount * tierInfo.consumptionPer10s;
  const itemsNeeded = Math.ceil(totalFuelUnitsConsumed / variantInfo.durability);
  const dustCostTotal = itemsNeeded * tierInfo.dustCostGigantesque;

  return {
    totalMounts: mounts.length,
    maxSecondsNeeded,
    formattedTotalTime: formatSecondsToTime(maxSecondsNeeded),
    totalFuelUnitsConsumed,
    itemsNeeded,
    dustCostTotal,
    mountsBreakdown: breakdown,
  };
}
