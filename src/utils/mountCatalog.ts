import type { MountDefinition, SpeciesType, UserMount } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { ALL_MOUNTS_DATA, getMountCrosses, normalizeBreedParts, normalizeBreedName } from '../data/allMounts';
import { MAX_MOUNT_XP } from '../data/fuelData';

export const CATALOGO_POR_ESPECIE: Record<SpeciesType, MountDefinition[]> = {
  dragopavo: DRAGODINDES_DATA,
  muluaga: MULDOS_DATA,
  vueloceronte: VOLKORNES_DATA,
};

export const NOMBRE_ESPECIE: Record<SpeciesType, { uno: string; varios: string; Varios: string }> = {
  dragopavo: { uno: 'dragopavo', varios: 'dragopavos', Varios: 'Dragopavos' },
  muluaga: { uno: 'mulagua', varios: 'mulaguas', Varios: 'Mulaguas' },
  vueloceronte: { uno: 'vueloceronte', varios: 'vuelocerontes', Varios: 'Vuelocerontes' },
};

const porId = new Map(ALL_MOUNTS_DATA.map((m) => [m.id, m]));
export const definicion = (id: string) => porId.get(id);

/** Índice inverso: en qué crías aparece cada montura como progenitor */
const hijosDe = new Map<string, MountDefinition[]>();
for (const m of ALL_MOUNTS_DATA) {
  const vistos = new Set<string>();
  for (const [a, b] of getMountCrosses(m)) {
    for (const p of [a, b]) {
      if (vistos.has(p)) continue;
      vistos.add(p);
      const lista = hijosDe.get(p) ?? [];
      lista.push(m);
      hijosDe.set(p, lista);
    }
  }
}
export const hijos = (id: string) => hijosDe.get(id) ?? [];

/** ¿Este ejemplar del establo es de esta raza? */
export const esDeLaRaza = (m: UserMount, def: MountDefinition) =>
  m.species === def.species &&
  (m.definitionId === def.id || normalizeBreedParts(m.breed) === normalizeBreedParts(def.name));

export const ejemplaresDe = (mounts: UserMount[], def: MountDefinition) => mounts.filter((m) => esDeLaRaza(m, def));

export const esNivel200 = (m: UserMount) => m.currentLevel >= 200 || m.currentXp >= MAX_MOUNT_XP;

/** Búsqueda sin tildes ni mayúsculas */
export const coincide = (def: MountDefinition, consulta: string) => {
  const q = normalizeBreedName(consulta);
  return !q || normalizeBreedName(def.name).includes(q);
};

export const generacionesDe = (catalogo: MountDefinition[]) =>
  Array.from(new Set(catalogo.map((m) => m.generation))).sort((a, b) => a - b);
