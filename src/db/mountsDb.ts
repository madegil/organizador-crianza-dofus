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
        id: 'sample-aquadrak',
        nickname: 'AquaDrak',
        definitionId: 'muldo_indigo',
        species: 'muluaga',
        breed: 'Índigo',
        generation: 1,
        gender: 'M',
        currentLevel: 12,
        currentXp: 867582,
        fertility: 'fertil',
        capacity: 'ninguna',
        serenity: 2000,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/92.png',
        notes: 'Muluaga Índigo macho nivel 12',
        createdAt: Date.now() - 500000,
        updatedAt: Date.now(),
      },
      {
        id: 'sample-flamito',
        nickname: 'Flamito',
        definitionId: 'dd_rousse',
        species: 'dragopavo',
        breed: 'Pelirroja',
        generation: 1,
        gender: 'F',
        currentLevel: 8,
        currentXp: 867582,
        fertility: 'fertil',
        capacity: 'ninguna',
        serenity: 2000,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/10.png',
        notes: 'Dragopavo Pelirroja hembra nivel 8',
        createdAt: Date.now() - 400000,
        updatedAt: Date.now(),
      },
      {
        id: 'sample-tiburonix',
        nickname: 'Tiburónix',
        definitionId: 'muldo_indigo',
        species: 'muluaga',
        breed: 'Índigo',
        generation: 1,
        gender: 'M',
        currentLevel: 15,
        currentXp: 867582,
        fertility: 'fertil',
        capacity: 'ninguna',
        serenity: 2000,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/92.png',
        notes: 'Muluaga Índigo macho nivel 15',
        createdAt: Date.now() - 300000,
        updatedAt: Date.now(),
      },
      {
        id: 'sample-rocafuego',
        nickname: 'Rocafuego',
        definitionId: 'dd_rousse',
        species: 'dragopavo',
        breed: 'Pelirroja',
        generation: 1,
        gender: 'F',
        currentLevel: 7,
        currentXp: 867582,
        fertility: 'fertil',
        capacity: 'ninguna',
        serenity: 2000,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/10.png',
        notes: 'Dragopavo Pelirroja hembra nivel 7',
        createdAt: Date.now() - 200000,
        updatedAt: Date.now(),
      },
      {
        id: 'sample-nautilux',
        nickname: 'Nautilux',
        definitionId: 'muldo_indigo',
        species: 'muluaga',
        breed: 'Índigo',
        generation: 1,
        gender: 'M',
        currentLevel: 10,
        currentXp: 867582,
        fertility: 'fertil',
        capacity: 'ninguna',
        serenity: 2000,
        love: 20000,
        maturity: 20000,
        stamina: 20000,
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/92.png',
        notes: 'Muluaga Índigo macho nivel 10',
        createdAt: Date.now() - 100000,
        updatedAt: Date.now(),
      },
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
        imageUrl: 'https://api.dofusdu.de/dofus2/img/mount/182.png',
        notes: 'Vueloceronte hembra nivel 96',
        createdAt: Date.now() - 50000,
        updatedAt: Date.now(),
      },
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
      if (m.capacity === ('none' as any) || !m.capacity) {
        m.capacity = 'ninguna';
        changed = true;
      }
      if (changed) {
        await db.mounts.put(m);
      }
    }
  }
}
