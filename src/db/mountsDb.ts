import Dexie, { type EntityTable } from 'dexie';
import type { UserMount } from '../types/mount';
import { getFertilityLabel } from '../utils/badgeHelpers';

export class BreedingDatabase extends Dexie {
  mounts!: EntityTable<UserMount, 'id'>;

  constructor() {
    super('DofusBreedingDB');
    this.version(1).stores({
      mounts: 'id, definitionId, species, breed, generation, gender, currentLevel, currentXp, fertility, capacity, updatedAt',
    });
  }
}

export const db = new BreedingDatabase();

export async function initSeedDataIfEmpty() {
  const count = await db.mounts.count();
  if (count === 0) {
    const sampleMounts: UserMount[] = [
      {
        id: 'sample-vueloceronte-made',
        nickname: 'Made',
        definitionId: 'volkorne_ivoire',
        species: 'vueloceronte',
        breed: 'Marfil',
        generation: 3,
        gender: 'F',
        currentLevel: 96,
        currentXp: 157620,
        fertility: 'esteril',
        capacity: 'ninguna',
        serenity: 1918,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        notes: 'Vueloceronte hembra nivel 96',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'sample-dragopavo-sinnombre',
        nickname: 'SinNombre',
        definitionId: 'dd_amande_doree',
        species: 'dragopavo',
        breed: 'Almendrada y Dorada',
        generation: 2,
        gender: 'M',
        currentLevel: 1,
        currentXp: 0,
        fertility: 'fertil',
        capacity: 'sabia',
        serenity: 1918,
        love: 0,
        maturity: 0,
        stamina: 0,
        notes: 'Dragopavo nivel 1 con capacidad Sabia',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];
    await db.mounts.bulkAdd(sampleMounts);
  } else {
    // Normalizar registros existentes con nombres antiguos
    const all = await db.mounts.toArray();
    for (const m of all) {
      let changed = false;
      const cleanFert = getFertilityLabel(m.fertility).toLowerCase().replace('é', 'e');
      const actualFert = cleanFert === 'fecunda' ? 'fecunda' : cleanFert === 'esteril' ? 'esteril' : cleanFert === 'senil' ? 'senil' : 'fertil';
      if (m.fertility !== actualFert) {
        m.fertility = actualFert as any;
        changed = true;
      }
      if (m.capacity === 'none' as any || !m.capacity) {
        m.capacity = 'ninguna';
        changed = true;
      }
      if (changed) {
        await db.mounts.put(m);
      }
    }
  }
}
