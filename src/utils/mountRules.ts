import type { UserMount, SpeciesType, FertilityStatus, SpecialCapacity } from '../types/mount';
import { findMountByBreedAndSpecies } from '../data/allMounts';
import { MAX_MOUNT_XP, calculateLevelFromXp, calculateXpForLevel } from '../data/fuelData';

/**
 * Retorna las reproducciones máximas por defecto según la especie:
 * - dragopavo: 5
 * - muluaga / muldo: 4
 * - resto (vueloceronte): 2
 */
export function getDefaultMaxReproductions(species?: string | null): number {
  const sp = (species || '').toLowerCase().trim();
  if (sp === 'dragopavo' || sp === 'dragodinde') return 5;
  if (sp === 'muluaga' || sp === 'muldo' || sp === 'mulagua') return 4;
  return 2;
}

const VALID_FERTILITIES: FertilityStatus[] = ['fertil', 'fecunda', 'esteril', 'senil'];
const VALID_CAPACITIES: SpecialCapacity[] = [
  'ninguna',
  'sabia',
  'enamoradiza',
  'resistente',
  'precoz',
  'reproductora',
  'camaleon',
];

/**
 * Valida y normaliza una montura proveniente de datos externos o respaldo JSON.
 * Devuelve `UserMount` normalizado o `null` si la montura es inválida.
 */
export function sanitizeMount(raw: unknown): UserMount | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const r = raw as Record<string, any>;

  // Validar especie (acepta también 'muldo'->'muluaga' y 'volkorne'->'vueloceronte'; si no es válida, null)
  const rawSpecies = String(r.species || '').toLowerCase().trim();
  let species: SpeciesType | null = null;
  if (rawSpecies === 'dragopavo' || rawSpecies === 'dragodinde') {
    species = 'dragopavo';
  } else if (rawSpecies === 'muluaga' || rawSpecies === 'muldo' || rawSpecies === 'mulagua') {
    species = 'muluaga';
  } else if (rawSpecies === 'vueloceronte' || rawSpecies === 'volkorne') {
    species = 'vueloceronte';
  }

  if (!species) {
    return null;
  }

  // nickname y breed strings (si faltan ambos, null)
  const rawNickname = r.nickname !== undefined && r.nickname !== null ? String(r.nickname).trim() : '';
  const rawBreed = r.breed !== undefined && r.breed !== null ? String(r.breed).trim() : '';

  if (!rawNickname && !rawBreed) {
    return null;
  }

  // Generación (1–10)
  const inputGen = Number(r.generation);
  const genNum = !isNaN(inputGen) && inputGen >= 1 && inputGen <= 10 ? inputGen : undefined;

  // definitionId, breed canónico e imageUrl reparados con findMountByBreedAndSpecies
  const matchedDef = findMountByBreedAndSpecies(rawBreed || rawNickname, species, genNum);
  const canonicalBreed = (matchedDef ? matchedDef.name : rawBreed) || 'Almendrado';
  const nickname = rawNickname || (matchedDef ? matchedDef.name : rawBreed) || 'Sin Nombre';
  const definitionId = matchedDef
    ? matchedDef.id
    : typeof r.definitionId === 'string' && r.definitionId.trim()
    ? r.definitionId.trim()
    : `${species}_custom`;
  const generation = genNum || (matchedDef ? matchedDef.generation : 1);
  const imageUrl = matchedDef?.imageUrl || (typeof r.imageUrl === 'string' && r.imageUrl.startsWith('https://') ? r.imageUrl : '');

  // id (conserva si es string no vacío, si no genera uno)
  const id =
    typeof r.id === 'string' && r.id.trim().length > 0
      ? r.id.trim()
      : `mount_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  // gender solo 'M'|'F'
  const rawGender = String(r.gender || 'M').toUpperCase().trim();
  const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('H') ? 'F' : 'M';

  // fertility y capacity normalizados (trim, minúsculas, sin tildes)
  const normalizeText = (text: unknown): string =>
    String(text || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

  const cleanFert = normalizeText(r.fertility);
  const fertility: FertilityStatus = VALID_FERTILITIES.includes(cleanFert as FertilityStatus)
    ? (cleanFert as FertilityStatus)
    : 'fertil';

  const cleanCap = normalizeText(r.capacity);
  const capacity: SpecialCapacity = VALID_CAPACITIES.includes(cleanCap as SpecialCapacity)
    ? (cleanCap as SpecialCapacity)
    : 'ninguna';

  // nivel 1–200, XP 0–MAX_MOUNT_XP y sincroniza nivel/XP igual que parseExcelFile
  let currentLevel = Math.min(200, Math.max(1, Number(r.currentLevel) || 1));
  let currentXp = Math.min(MAX_MOUNT_XP, Math.max(0, Number(r.currentXp) || 0));

  if (currentXp >= MAX_MOUNT_XP) {
    currentLevel = 200;
  } else if (currentXp > 0) {
    currentLevel = calculateLevelFromXp(currentXp);
  } else if (currentLevel > 1 && currentXp === 0) {
    currentXp = calculateXpForLevel(currentLevel);
  }

  // serenidad -10000..10000; amor, madurez y resistencia 0–20000; si es estéril o senil, los cuatro medidores en 0
  const isEsterilOrSenil = fertility === 'esteril' || fertility === 'senil';
  const serenity = isEsterilOrSenil ? 0 : Math.min(10000, Math.max(-10000, Number(r.serenity) || 0));
  const love = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(r.love) || 0));
  const maturity = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(r.maturity) || 0));
  const stamina = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(r.stamina) || 0));

  // reproductionCount entero >= 0 (por defecto 0)
  const rawRepro = Number(r.reproductionCount);
  const reproductionCount = !isNaN(rawRepro) && rawRepro >= 0 ? Math.floor(rawRepro) : 0;

  // maxReproductions por defecto getDefaultMaxReproductions
  const defaultMax = getDefaultMaxReproductions(species);
  const rawMaxRepro = Number(r.maxReproductions);
  const maxReproductions = !isNaN(rawMaxRepro) && rawMaxRepro > 0 ? Math.floor(rawMaxRepro) : defaultMax;

  // notes string
  const notes = r.notes !== undefined && r.notes !== null ? String(r.notes).trim() : '';

  // createdAt/updatedAt numéricos (por defecto Date.now())
  const createdAt = typeof r.createdAt === 'number' && !isNaN(r.createdAt) ? r.createdAt : Date.now();
  const updatedAt = typeof r.updatedAt === 'number' && !isNaN(r.updatedAt) ? r.updatedAt : Date.now();

  return {
    id,
    nickname,
    definitionId,
    species,
    breed: canonicalBreed,
    generation,
    gender,
    currentLevel,
    currentXp,
    fertility,
    capacity,
    reproductionCount,
    maxReproductions,
    serenity,
    love,
    maturity,
    stamina,
    imageUrl,
    notes,
    createdAt,
    updatedAt,
  };
}
