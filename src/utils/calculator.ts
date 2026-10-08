import {
  FUEL_TIERS,
  FUEL_VARIANTS,
  FUEL_ITEM_NAMES,
  MAX_MOUNT_XP,
  MAX_ENCLOS_GAUGE,
  TOTAL_CONTINUOUS_DRAIN_SECONDS,
} from '../data/fuelData';
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

export function formatShortTime(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  if (rounded <= 0) return '0s';

  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${rounded}s`;
}

export type TrainingStrategy = 'cascade' | 'tier4' | 'tier3' | 'tier2' | 'tier1';

export interface TierFuelBreakdown {
  tier: FuelTier;
  tierName: string;
  itemName: string;
  rangeLabel: string;
  consumptionRatePer10s: number;
  baseXpPerSec: number;
  effectiveXpPerSec: number;
  drainDurationText: string;
  drainDurationSeconds: number;
  xpNeeded: number;
  durabilityNeeded: number;
  maxTierCapacity: number;
  itemsNeeded: number;
  variantValue: number;
  effectiveXpAdded: number;
  timeToTargetIfMaintainedSeconds: number;
  formattedTimeIfMaintained: string;
  baseItemsByTier?: Record<FuelTier, number>;
  baseDurability?: number;
  baseItems?: number;
  refills?: number;
  capacityPerRefill?: number;
}

export interface FuelBreakdownResult {
  totalXp: number;
  variant: FuelVariant;
  variantValue: number;
  isSage: boolean;
  strategy: TrainingStrategy;
  tiers: TierFuelBreakdown[];

  // Tiempo que tarda la montura en subir la XP objetivo
  mountTrainingSeconds: number;
  formattedMountTrainingTime: string;
  effectiveRatePerSec: number;

  // Tiempo de vaciado físico del carburante (autonomía del depósito)
  fuelDrainSeconds: number;
  formattedFuelDrainTime: string;

  // Carburantes
  totalItemsNeeded: number;
  totalDurabilityNeeded: number;

  // Referencia general del medidor
  fullCascadeDrainSeconds: number;
  formattedFullCascadeDrainTime: string;
  baseItemsByTier?: Record<FuelTier, number>;
  baseDurability?: number;
  refills?: number;
  capacityPerRefill?: number;
  maintenanceUnits?: number;
  baseUnitsTotal?: number;
  includeBase?: boolean;
}

export function calculateFuelBreakdown(
  xpNeeded: number,
  variant: FuelVariant = 'gigantesco',
  isSage: boolean = false,
  strategy: TrainingStrategy = 'cascade',
  includeBase: boolean = true
): FuelBreakdownResult {
  const safeXp = Math.max(0, Math.round(xpNeeded));
  const variantInfo = FUEL_VARIANTS[variant] || FUEL_VARIANTS.gigantesco;
  const variantVal = variantInfo.durability;

  // Durabilidad de carburante neta necesaria para la montura
  // (Si es sabia, recibe x2 XP por cada punto de durabilidad)
  const durabilityNeededTotal = isSage ? Math.ceil(safeXp / 2) : safeXp;

  // Límites por tier
  const tierCapacities: Record<FuelTier, number> = {
    1: 80000,
    2: 60000,
    3: 40000,
    4: 20000,
  };

  const rangeLabels: Record<FuelTier, string> = {
    1: '0 - 80.000',
    2: '80.001 - 140.000',
    3: '140.001 - 180.000',
    4: '180.001 - 200.000',
  };

  const drainTexts: Record<FuelTier, string> = {
    1: '22 horas y 13 minutos',
    2: '8 horas y 20 minutos',
    3: '3 horas y 42 minutos',
    4: '1 hora y 23 minutos',
  };

  // 1. Cálculo si se mantiene un tier específico (tier4, tier3, tier2 o tier1)
  const selectedFixedTier: FuelTier | null =
    strategy === 'tier4' ? 4 : strategy === 'tier3' ? 3 : strategy === 'tier2' ? 2 : strategy === 'tier1' ? 1 : null;

  const baseItemsByTier: Record<FuelTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let baseDurability = 0, baseUnitsTotal = 0, refills = 0, capacityPerRefill = 0, maintenanceUnits = 0;
  if (selectedFixedTier !== null) {
    capacityPerRefill = tierCapacities[selectedFixedTier];
    if (safeXp > 0) {
      for (let t = 1; t < selectedFixedTier; t++) {
        const cap = tierCapacities[t as FuelTier], units = Math.ceil(cap / variantVal);
        baseItemsByTier[t as FuelTier] = units; baseDurability += cap; baseUnitsTotal += units;
      }
      refills = Math.ceil(durabilityNeededTotal / capacityPerRefill);
      maintenanceUnits = Math.ceil(durabilityNeededTotal / variantVal);
    }
  }

  // 2. Reparto en cascada de la durabilidad (por si se usa cascade o como referencia)
  const fullCycles = Math.floor(durabilityNeededTotal / MAX_ENCLOS_GAUGE);
  const remainderDur = durabilityNeededTotal % MAX_ENCLOS_GAUGE;

  const t1_dur = fullCycles * 80000 + Math.min(remainderDur, 80000);
  const t2_dur = fullCycles * 60000 + Math.max(0, Math.min(remainderDur - 80000, 60000));
  const t3_dur = fullCycles * 40000 + Math.max(0, Math.min(remainderDur - 140000, 40000));
  const t4_dur = fullCycles * 20000 + Math.max(0, Math.min(remainderDur - 180000, 20000));

  const tierCascadeDurMap: Record<FuelTier, number> = {
    1: t1_dur,
    2: t2_dur,
    3: t3_dur,
    4: t4_dur,
  };

  const tiers: TierFuelBreakdown[] = ([1, 2, 3, 4] as FuelTier[]).map((tier) => {
    const tierInfo = FUEL_TIERS[tier];
    const itemName = FUEL_ITEM_NAMES[tier][variant];
    const consumptionRatePer10s = tierInfo.consumptionPer10s || 10;
    const baseXpPerSec = consumptionRatePer10s / 10;
    const effectiveXpPerSec = isSage ? baseXpPerSec * 2 : baseXpPerSec;

    // Tiempo si mantienes exclusivamente este tier
    const timeToTargetIfMaintainedSeconds = safeXp > 0 ? safeXp / effectiveXpPerSec : 0;

    let durabilityForThisTier = 0, items = 0, tierRefills: number | undefined;
    if (selectedFixedTier !== null) {
      if (tier === selectedFixedTier) {
        durabilityForThisTier = durabilityNeededTotal; items = maintenanceUnits; tierRefills = refills;
      }
    } else {
      durabilityForThisTier = tierCascadeDurMap[tier];
      items = durabilityForThisTier > 0 ? Math.ceil(durabilityForThisTier / variantVal) : 0;
    }
    const xpForThisTier = isSage ? durabilityForThisTier * 2 : durabilityForThisTier;

    return {
      tier,
      tierName: tierInfo.name,
      itemName,
      rangeLabel: rangeLabels[tier],
      consumptionRatePer10s,
      baseXpPerSec,
      effectiveXpPerSec,
      drainDurationText: drainTexts[tier],
      drainDurationSeconds: tierInfo.drainDurationSeconds,
      xpNeeded: xpForThisTier,
      durabilityNeeded: durabilityForThisTier,
      maxTierCapacity: tierCapacities[tier],
      itemsNeeded: items,
      variantValue: variantVal,
      effectiveXpAdded: items * variantVal * (isSage ? 2 : 1),
      timeToTargetIfMaintainedSeconds,
      formattedTimeIfMaintained: formatDurationSpanish(timeToTargetIfMaintainedSeconds),
      baseItemsByTier: selectedFixedTier ? baseItemsByTier : undefined,
      baseDurability: selectedFixedTier && tier < selectedFixedTier ? (safeXp > 0 ? tierCapacities[tier] : 0) : undefined,
      baseItems: selectedFixedTier && tier < selectedFixedTier ? baseItemsByTier[tier] : undefined,
      refills: tierRefills,
      capacityPerRefill: tierCapacities[tier],
    };
  });

  const totalItemsNeeded = selectedFixedTier !== null
    ? maintenanceUnits + (includeBase ? baseUnitsTotal : 0)
    : tiers.reduce((acc, t) => acc + t.itemsNeeded, 0);

  // Cálculo del tiempo de subida de la montura y de vaciado de carburante
  let mountTrainingSeconds = 0;
  let fuelDrainSeconds = 0;
  let effectiveRatePerSec = 1;

  if (selectedFixedTier !== null) {
    const tierInfo = FUEL_TIERS[selectedFixedTier];
    effectiveRatePerSec = isSage ? (tierInfo.gainPer10s! / 10) * 2 : tierInfo.gainPer10s! / 10;
    mountTrainingSeconds = safeXp > 0 ? safeXp / effectiveRatePerSec : 0;
    // Autonomía física del tramo seleccionado
    fuelDrainSeconds = tierInfo.drainDurationSeconds;
  } else {
    // Cascada: drena a 4/s en T4, 3/s en T3, 2/s en T2, 1/s en T1
    mountTrainingSeconds =
      t4_dur / 4.0 +
      t3_dur / 3.0 +
      t2_dur / 2.0 +
      t1_dur / 1.0;

    fuelDrainSeconds = mountTrainingSeconds;
    effectiveRatePerSec = mountTrainingSeconds > 0 ? safeXp / mountTrainingSeconds : 1;
  }

  return {
    totalXp: safeXp,
    variant,
    variantValue: variantVal,
    isSage,
    strategy,
    tiers,
    mountTrainingSeconds,
    formattedMountTrainingTime: formatDurationSpanish(mountTrainingSeconds),
    effectiveRatePerSec,
    fuelDrainSeconds,
    formattedFuelDrainTime: formatDurationSpanish(fuelDrainSeconds),
    totalItemsNeeded,
    totalDurabilityNeeded: durabilityNeededTotal,
    fullCascadeDrainSeconds: TOTAL_CONTINUOUS_DRAIN_SECONDS,
    formattedFullCascadeDrainTime: '35 horas y 39 minutos',
    baseItemsByTier: selectedFixedTier ? baseItemsByTier : undefined,
    baseDurability: selectedFixedTier ? baseDurability : undefined,
    refills: selectedFixedTier ? refills : undefined,
    capacityPerRefill: selectedFixedTier ? capacityPerRefill : undefined,
    maintenanceUnits: selectedFixedTier ? maintenanceUnits : undefined,
    baseUnitsTotal: selectedFixedTier ? baseUnitsTotal : undefined,
    includeBase,
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
  const strat: TrainingStrategy = tier === 4 ? 'tier4' : tier === 3 ? 'tier3' : tier === 2 ? 'tier2' : 'tier1';
  const res = calculateFuelBreakdown(xpNeeded, variant, isSage, strat);
  return {
    xpNeeded,
    secondsNeeded: res.mountTrainingSeconds,
    formattedTime: res.formattedMountTrainingTime,
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
  mountsBreakdown: {
    mount: UserMount;
    xpNeeded: number;
    individualSeconds: number;
    individualFormattedTime: string;
  }[];
}

export function calculateEnclosBatch(
  mounts: UserMount[],
  tier: FuelTier = 1,
  variant: FuelVariant = 'gigantesco',
  targetXp: number = MAX_MOUNT_XP
): BatchCalculationResult {
  const strat: TrainingStrategy = tier === 4 ? 'tier4' : tier === 3 ? 'tier3' : tier === 2 ? 'tier2' : 'tier1';
  const breakdown = mounts.map((mount) => {
    const xpNeeded = calculateRemainingXp(mount.currentXp, targetXp);
    const isSage = mount.capacity === 'sabia';
    const res = calculateFuelBreakdown(xpNeeded, variant, isSage, strat);

    return {
      mount,
      xpNeeded,
      individualSeconds: res.mountTrainingSeconds,
      individualFormattedTime: res.formattedMountTrainingTime,
    };
  });

  const maxSecondsNeeded = breakdown.length > 0 ? Math.max(...breakdown.map((b) => b.individualSeconds)) : 0;
  const maxMountBreakdown =
    mounts.length > 0
      ? calculateFuelBreakdown(
          Math.max(...mounts.map((m) => calculateRemainingXp(m.currentXp, targetXp))),
          variant,
          false,
          strat
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
