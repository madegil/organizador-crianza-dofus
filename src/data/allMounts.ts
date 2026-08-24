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

export function findMountByBreedAndSpecies(breedName: string, species?: SpeciesType): MountDefinition | undefined {
  const norm = breedName.toLowerCase().trim();
  return ALL_MOUNTS_DATA.find((m) => {
    if (species && m.species !== species) return false;
    return m.name.toLowerCase().includes(norm) || norm.includes(m.name.toLowerCase().split(' ')[0]);
  });
}
