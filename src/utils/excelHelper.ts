import * as XLSX from 'xlsx';
import type { FertilityStatus, SpecialCapacity, SpeciesType, UserMount } from '../types/mount';
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';

export function downloadExcelTemplate() {
  const headers = [
    'Apodo / Nombre',
    'Especie (dragopavo / muldo / volkorne)',
    'Raza / Color',
    'Generación (1-10)',
    'Sexo (M / F)',
    'Nivel Actual (1-200)',
    'XP Actual',
    'Fertilidad (fertile / feconde / sterile / senile)',
    'Capacidad (none / sage / amoureuse / endurante / precoce / reproducteur / cameleone)',
    'Serenidad (-5000 a 5000)',
    'Amor (0-20000)',
    'Madurez (0-20000)',
    'Resistencia (0-20000)',
    'Notas',
  ];

  const exampleRows = [
    [
      'Made',
      'volkorne',
      'Marfil (Ivoire)',
      3,
      'F',
      96,
      157620,
      'sterile',
      'none',
      1918,
      20000,
      20000,
      20000,
      'Vueloceronte hembra nivel 96',
    ],
    [
      'SinNombre',
      'dragopavo',
      'Almendrada y Dorada',
      2,
      'M',
      1,
      0,
      'fertile',
      'sage',
      1918,
      0,
      0,
      0,
      'Dragopavo nivel 1 con capacidad Sabia',
    ],
    [
      'MuldoAgil',
      'muldo',
      'Ébano (Ébène)',
      1,
      'F',
      150,
      450000,
      'feconde',
      'none',
      0,
      20000,
      20000,
      20000,
      'Muldo listo para cruzar',
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla_Monturas');

  XLSX.writeFile(wb, 'plantilla_crianza_dofus_3_5.xlsx');
}

export function exportMountsToExcel(mounts: UserMount[]) {
  const data = mounts.map((m) => ({
    'ID': m.id,
    'Apodo': m.nickname,
    'Especie': m.species,
    'Raza / Color': m.breed,
    'Generación': m.generation,
    'Sexo': m.gender,
    'Nivel Actual': m.currentLevel,
    'XP Actual': m.currentXp,
    'XP Faltante (Nivel 200)': Math.max(0, 867582 - m.currentXp),
    'Fertilidad': m.fertility,
    'Capacidad': m.capacity,
    'Serenidad': m.serenity,
    'Amor': m.love,
    'Madurez': m.maturity,
    'Resistencia': m.stamina,
    'Notas': m.notes || '',
    'Fecha de Registro': new Date(m.createdAt).toLocaleDateString(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mis_Monturas');

  XLSX.writeFile(wb, `inventario_crianza_dofus_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportMountsToJson(mounts: UserMount[]) {
  const jsonStr = JSON.stringify(mounts, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_crianza_dofus_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseExcelFile(file: File): Promise<UserMount[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (rawRows.length < 2) {
    throw new Error('El archivo Excel está vacío o no contiene datos válidos.');
  }

  // Detect header row or start at index 1
  const rows = rawRows.slice(1);
  const parsedMounts: UserMount[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[0]) continue;

    const nickname = String(row[0] || `Montura-${i + 1}`).trim();
    let rawSpecies = String(row[1] || 'dragodinde').toLowerCase().trim();
    let species: SpeciesType = 'dragodinde';
    if (rawSpecies.includes('muldo')) species = 'muldo';
    else if (rawSpecies.includes('volkorne') || rawSpecies.includes('vueloceronte')) species = 'volkorne';

    const breed = String(row[2] || 'Sin especificar').trim();
    const matchedDef = findMountByBreedAndSpecies(breed, species);
    const definitionId = matchedDef ? matchedDef.id : `${species}_custom_${i}`;
    const generation = Number(row[3]) || (matchedDef ? matchedDef.generation : 1);
    const rawGender = String(row[4] || 'M').toUpperCase().trim();
    const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('H') ? 'F' : 'M';

    const currentLevel = Math.min(200, Math.max(1, Number(row[5]) || 1));
    const currentXp = Math.min(867582, Math.max(0, Number(row[6]) || 0));

    let rawFertility = String(row[7] || 'fertile').toLowerCase().trim();
    let fertility: FertilityStatus = 'fertile';
    if (rawFertility.includes('fecond') || rawFertility.includes('fecund')) fertility = 'feconde';
    else if (rawFertility.includes('steril') || rawFertility.includes('estéril')) fertility = 'sterile';
    else if (rawFertility.includes('senil')) fertility = 'senile';

    let rawCapacity = String(row[8] || 'none').toLowerCase().trim();
    let capacity: SpecialCapacity = 'none';
    if (rawCapacity.includes('sage') || rawCapacity.includes('sabia')) capacity = 'sage';
    else if (rawCapacity.includes('amour') || rawCapacity.includes('amor')) capacity = 'amoureuse';
    else if (rawCapacity.includes('endur') || rawCapacity.includes('resisten')) capacity = 'endurante';
    else if (rawCapacity.includes('prec') || rawCapacity.includes('precoz')) capacity = 'precoce';
    else if (rawCapacity.includes('reprod')) capacity = 'reproducteur';
    else if (rawCapacity.includes('camele') || rawCapacity.includes('camale')) capacity = 'cameleone';

    const serenity = Number(row[9]) || 0;
    const love = Math.min(20000, Math.max(0, Number(row[10]) || 0));
    const maturity = Math.min(20000, Math.max(0, Number(row[11]) || 0));
    const stamina = Math.min(20000, Math.max(0, Number(row[12]) || 0));
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
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return parsedMounts;
}
