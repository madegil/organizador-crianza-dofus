import * as XLSX from 'xlsx';
import type { UserMount, SpeciesType, FertilityStatus, SpecialCapacity } from '../types/mount';
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';
import { MAX_MOUNT_XP, calculateLevelFromXp, calculateXpForLevel } from '../data/fuelData';

export const EXCEL_TEMPLATE_COLUMNS = [
  'Apodo (Opcional)',
  'Especie (dragopavo, muluaga, vueloceronte)',
  'Raza / Color',
  'Generación (1-10)',
  'Sexo (M/F)',
  'Nivel Actual (1-200)',
  'XP Actual (0 - 867.582)',
  'Fertilidad (fertil, fecunda, esteril, senil)',
  'Capacidad (ninguna, sabia, enamoradiza, resistente, precoz, reproductora, camaleon)',
  'Serenidad (-5000 a +5000)',
  'Amor (0 - 20000)',
  'Madurez (0 - 20000)',
  'Energía (0 - 20000)',
  'Notas / Observaciones',
];

export function downloadExcelTemplate() {
  const sampleRows = [
    [
      'AquaDrak',
      'muluaga',
      'Índigo',
      1,
      'M',
      200,
      867582,
      'fertil',
      'ninguna',
      2000,
      20000,
      20000,
      20000,
      'Muluaga de muestra nivel 200',
    ],
    [
      'Flamita',
      'dragopavo',
      'Pelirroja',
      1,
      'F',
      8,
      633,
      'fertil',
      'ninguna',
      2000,
      20000,
      20000,
      20000,
      'Dragopavo nivel 8',
    ],
    [
      'Made',
      'vueloceronte',
      'Marfil',
      3,
      'F',
      96,
      157620,
      'esteril',
      'ninguna',
      0,
      0,
      0,
      0,
      'Vueloceronte estéril',
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet([EXCEL_TEMPLATE_COLUMNS, ...sampleRows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla_Monturas');
  XLSX.writeFile(wb, 'plantilla_crianza_dofus.xlsx');
}

export function exportMountsToExcel(mounts: UserMount[]) {
  const rows = mounts.map((m) => ({
    ID: m.id,
    Apodo: m.nickname,
    Especie: m.species,
    Raza: m.breed,
    Generación: m.generation,
    Sexo: m.gender,
    'Nivel Actual': m.currentXp >= 867582 ? 200 : (m.currentLevel || calculateLevelFromXp(m.currentXp)),
    'XP Actual': m.currentXp,
    'XP Faltante (Nivel 200)': Math.max(0, 867582 - m.currentXp),
    Fertilidad: m.fertility,
    Capacidad: m.capacity,
    Serenidad: m.serenity,
    Amor: m.love,
    Madurez: m.maturity,
    Energía: m.stamina,
    Notas: m.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mis_Monturas');
  XLSX.writeFile(wb, `mis_monturas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportMountsToJson(mounts: UserMount[]) {
  const jsonStr = JSON.stringify(mounts, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_monturas_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseExcelFile(file: File): Promise<UserMount[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  if (jsonData.length <= 1) {
    throw new Error('El archivo está vacío o no contiene filas de datos.');
  }

  // Omitimos la fila 0 de encabezados
  const dataRows = jsonData.slice(1);
  const parsedMounts: UserMount[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || row.length === 0) continue;

    const nickname = row[0] ? String(row[0]).trim() : `Montura ${i + 1}`;
    let rawSpecies = String(row[1] || 'dragopavo').toLowerCase().trim();
    let species: SpeciesType = 'dragopavo';
    if (rawSpecies.includes('muldo') || rawSpecies.includes('muluaga')) species = 'muluaga';
    else if (rawSpecies.includes('volk') || rawSpecies.includes('vuelo') || rawSpecies.includes('ceronte')) species = 'vueloceronte';

    const breed = row[2] ? String(row[2]).trim() : 'Almendrada';
    const matchedDef = findMountByBreedAndSpecies(breed, species);
    const definitionId = matchedDef ? matchedDef.id : `${species}_custom_${i}`;
    const generation = Number(row[3]) || (matchedDef ? matchedDef.generation : 1);
    const rawGender = String(row[4] || 'M').toUpperCase().trim();
    const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('H') ? 'F' : 'M';

    let currentLevel = Math.min(200, Math.max(1, Number(row[5]) || 1));
    let currentXp = Math.min(867582, Math.max(0, Number(row[6]) || 0));

    // Sincronizar nivel y XP automáticamente
    if (currentXp >= 867582) {
      currentLevel = 200;
    } else if (currentXp > 0) {
      currentLevel = calculateLevelFromXp(currentXp);
    } else if (currentLevel > 1 && currentXp === 0) {
      currentXp = calculateXpForLevel(currentLevel);
    }

    let rawFertility = String(row[7] || 'fertil').toLowerCase().trim();
    let fertility: FertilityStatus = 'fertil';
    if (rawFertility.includes('fecond') || rawFertility.includes('fecund')) fertility = 'fecunda';
    else if (rawFertility.includes('steril') || rawFertility.includes('esteril') || rawFertility.includes('estéril')) fertility = 'esteril';
    else if (rawFertility.includes('senil')) fertility = 'senil';

    let rawCapacity = String(row[8] || 'ninguna').toLowerCase().trim();
    let capacity: SpecialCapacity = 'ninguna';
    if (rawCapacity.includes('sage') || rawCapacity.includes('sabia') || rawCapacity.includes('sabio')) capacity = 'sabia';
    else if (rawCapacity.includes('amour') || rawCapacity.includes('enamoradiza') || rawCapacity.includes('amorosa')) capacity = 'enamoradiza';
    else if (rawCapacity.includes('endur') || rawCapacity.includes('resistent')) capacity = 'resistente';
    else if (rawCapacity.includes('prec') || rawCapacity.includes('precoz')) capacity = 'precoz';
    else if (rawCapacity.includes('reprod')) capacity = 'reproductora';
    else if (rawCapacity.includes('camele') || rawCapacity.includes('camale')) capacity = 'camaleon';

    const isEsterilOrSenil = fertility === 'esteril' || fertility === 'senil';
    const serenity = isEsterilOrSenil ? 0 : (Number(row[9]) || 0);
    const love = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[10]) || 0));
    const maturity = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[11]) || 0));
    const stamina = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[12]) || 0));
    const notes = row[13] ? String(row[13]).trim() : '';

    parsedMounts.push({
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname,
      definitionId,
      species,
      breed,
      generation,
      gender,
      currentLevel,
      currentXp,
      fertility,
      capacity,
      serenity,
      love,
      maturity,
      stamina,
      imageUrl: matchedDef?.imageUrl || '',
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return parsedMounts;
}
