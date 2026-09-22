import type { MountDefinition, SpeciesType } from '../types/mount';
import { DRAGODINDES_DATA } from './dragodindes';
import { MULDOS_DATA } from './muldos';
import { VOLKORNES_DATA } from './volkornes';

export const ALL_MOUNTS_DATA: MountDefinition[] = [
  ...DRAGODINDES_DATA,
  ...MULDOS_DATA,
  ...VOLKORNES_DATA,
];

export function getMountsBySpecies(species: SpeciesType): MountDefinition[] {
  return ALL_MOUNTS_DATA.filter((m) => m.species === species);
}

export function getMountDefinitionById(id: string): MountDefinition | undefined {
  return ALL_MOUNTS_DATA.find((m) => m.id === id);
}

export function normalizeBreedName(name: string): string {
  return (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\balmendrad[ao]\b/g, 'almendrado')
    .replace(/\bdorad[ao]\b/g, 'dorado')
    .replace(/\bpelirroj[ao]\b/g, 'pelirrojo')
    .replace(/\borquide[ao]\b/g, 'orquideo');
}

export function normalizeBreedParts(name: string): string {
  return normalizeBreedName(name)
    .replace(/\b(y|e)\b/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ');
}

export function findMountByBreedAndSpecies(
  breedName: string,
  species?: SpeciesType,
  generation?: number
): MountDefinition | undefined {
  if (!breedName) return undefined;
  const norm = normalizeBreedName(breedName);
  const normParts = normalizeBreedParts(breedName);

  const candidates = ALL_MOUNTS_DATA.filter((m) => !species || m.species === species);

  // 1. Coincidencia con generación especificada
  if (generation) {
    const genMatch = candidates.find(
      (m) => m.generation === generation && normalizeBreedName(m.name) === norm
    );
    if (genMatch) return genMatch;

    const genPartsMatch = candidates.find(
      (m) => m.generation === generation && normalizeBreedParts(m.name) === normParts
    );
    if (genPartsMatch) return genPartsMatch;
  }

  // 2. Coincidencia exacta de nombre normalizado
  const exactMatch = candidates.find((m) => normalizeBreedName(m.name) === norm);
  if (exactMatch) return exactMatch;

  // 3. Coincidencia de partes normalizadas (independiente de orden y conjunciones y/e)
  const partsMatch = candidates.find((m) => normalizeBreedParts(m.name) === normParts);
  if (partsMatch) return partsMatch;

  // 4. Fallback por contención únicamente si no hubo coincidencia exacta o de partes
  return candidates.find((m) => {
    const mNorm = normalizeBreedName(m.name);
    return mNorm.includes(norm) || norm.includes(mNorm);
  });
}
