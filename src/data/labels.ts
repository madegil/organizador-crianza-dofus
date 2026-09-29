import type { FertilityStatus, SpecialCapacity, SpeciesType } from '../types/mount';

export const FERTILITY_LABELS: Record<FertilityStatus, string> = {
  fertil: 'Fértil',
  fecunda: 'Fecunda',
  esteril: 'Estéril',
  senil: 'Senil',
};

export const CAPACITY_LABELS: Record<SpecialCapacity, string> = {
  ninguna: 'Ninguna',
  sabia: 'Sabia',
  enamoradiza: 'Enamoradiza',
  resistente: 'Resistente',
  precoz: 'Precoz',
  reproductora: 'Reproductora',
  camaleon: 'Camaleón',
};

export const SPECIES_LABELS: Record<SpeciesType, string> = {
  dragopavo: 'Dragopavo',
  muluaga: 'Muluaga',
  vueloceronte: 'Vueloceronte',
};
