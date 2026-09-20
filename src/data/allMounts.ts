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

function normalizeBreedName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\balmendrada\b/g, 'almendrado')
    .replace(/\bdorada\b/g, 'dorado')
    .replace(/\bpelirroja\b/g, 'pelirrojo')
    .replace(/\borqu[íi]dea\b/g, 'orquídeo');
}

export function findMountByBreedAndSpecies(breedName: string, species?: SpeciesType): MountDefinition | undefined {
  const norm = normalizeBreedName(breedName);
  return ALL_MOUNTS_DATA.find((m) => {
    if (species && m.species !== species) return false;
    const mNorm = normalizeBreedName(m.name);
    return mNorm === norm || mNorm.includes(norm) || norm.includes(mNorm.split(' ')[0]);
  });
}
