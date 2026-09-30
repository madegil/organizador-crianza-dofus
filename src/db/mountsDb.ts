import Dexie, { type EntityTable } from 'dexie';
import type { UserMount } from '../types/mount';
import { getFertilityLabel } from '../utils/badgeHelpers';
import { MAX_MOUNT_XP, calculateLevelFromXp } from '../data/mountXpTable';
import { findMountByBreedAndSpecies } from '../data/allMounts';

export class BreedingDatabase extends Dexie {
  mounts!: EntityTable<UserMount, 'id'>;

  constructor() {
    super('DofusBreedingDB');
    this.version(1).stores({
      mounts: 'id, nickname, species, breed, generation, gender, currentLevel, fertility, capacity',
    });
  }
}

export const db = new BreedingDatabase();

const NORMALIZATION_KEY = 'dofus_breeding_normalized_v4';

export async function initSeedDataIfEmpty() {
  const count = await db.mounts.count();
  if (count === 0) {
    return;
  }

  let alreadyNormalized = false;
  if (typeof window !== 'undefined') {
    try {
      alreadyNormalized = localStorage.getItem(NORMALIZATION_KEY) === 'true';
    } catch {
      alreadyNormalized = false;
    }
  }

  if (alreadyNormalized) {
    return;
  }

  // Normalizar registros existentes con discrepancias de fertilidad, capacidad, nivel/XP y definición de raza
  const all = await db.mounts.toArray();
  for (const m of all) {
    let changed = false;
    const actualFert = getFertilityLabel(m.fertility).toLowerCase();
    if (actualFert !== m.fertility) {
      m.fertility = actualFert as any;
      changed = true;
    }
    if (m.capacity === ('none' as any) || !m.capacity) {
      m.capacity = 'ninguna';
      changed = true;
    }
    // Sincronizar nivel con XP: si XP >= MAX_MOUNT_XP, el nivel es 200
    if (m.currentXp >= MAX_MOUNT_XP && m.currentLevel !== 200) {
      m.currentLevel = 200;
      changed = true;
    } else if (m.currentXp > 0) {
      const expectedLevel = calculateLevelFromXp(m.currentXp);
      if (m.currentLevel !== expectedLevel) {
        m.currentLevel = expectedLevel;
        changed = true;
      }
    }
    // Si la montura es estéril o senil, limpiar serenidad, amor, madurez y energía
    if (actualFert === 'esteril' || actualFert === 'senil') {
      if (m.love !== 0 || m.maturity !== 0 || m.stamina !== 0 || m.serenity !== 0) {
        m.love = 0;
        m.maturity = 0;
        m.stamina = 0;
        m.serenity = 0;
        changed = true;
      }
    }
    // Sincronizar y reparar definitionId, breed canónico e imageUrl si estaban desalineados
    const matchedDef = findMountByBreedAndSpecies(m.breed, m.species, m.generation);
    if (matchedDef) {
      if (m.definitionId !== matchedDef.id) {
        m.definitionId = matchedDef.id;
        changed = true;
      }
      if (matchedDef.imageUrl && m.imageUrl !== matchedDef.imageUrl) {
        m.imageUrl = matchedDef.imageUrl;
        changed = true;
      }
      if (m.breed !== matchedDef.name) {
        m.breed = matchedDef.name;
        changed = true;
      }
    }
    if (changed) {
      await db.mounts.put(m);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(NORMALIZATION_KEY, 'true');
    } catch {
      // ignore
    }
  }
}
