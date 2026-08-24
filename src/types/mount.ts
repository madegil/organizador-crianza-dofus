export type SpeciesType = 'dragodinde' | 'muldo' | 'volkorne';
export type FertilityStatus = 'fertile' | 'feconde' | 'sterile' | 'senile';
export type SpecialCapacity = 'none' | 'sage' | 'amoureuse' | 'endurante' | 'precoce' | 'reproducteur' | 'cameleone';

export interface MountDefinition {
  id: string;
  species: SpeciesType;
  generation: number;
  name: string;
  parents?: [string, string];
  bonuses: string[];
}

export interface UserMount {
  id: string;
  nickname: string;
  definitionId: string;
  species: SpeciesType;
  breed: string;
  generation: number;
  gender: 'M' | 'F';
  currentLevel: number;
  currentXp: number;
  fertility: FertilityStatus;
  capacity: SpecialCapacity;
  serenity: number;
  love: number;
  maturity: number;
  stamina: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type FuelTier = 1 | 2 | 3 | 4;
export type FuelVariant = 'minuscule' | 'petit' | 'normal' | 'grand' | 'gigantesque';

export interface FuelInfo {
  tier: FuelTier;
  name: string;
  rangeMin: number;
  rangeMax: number;
  consumptionPer10s: number;
  gainPer10s: number;
  drainDurationSeconds: number;
  dustCostGigantesque: number;
}
