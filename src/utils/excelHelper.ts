import type { UserMount, SpeciesType, FertilityStatus, SpecialCapacity } from '../types/mount';
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';
import { calculateLevelFromXp, calculateXpForLevel, MAX_MOUNT_XP } from '../data/fuelData';
import { sanitizeMount, getDefaultMaxReproductions } from './mountRules';

export const CSV_TEMPLATE_COLUMNS = [
  'Nombre de la montura',
  'Especie',
  'Color / Raza',
  'Generación',
  'Sexo',
  'Nivel de la montura',
  'XP de la montura',
  'Fertilidad',
  'Capacidad',
  'Serenidad',
  'Amor',
  'Madurez',
  'Resistencia',
];

export const EXCEL_TEMPLATE_COLUMNS = CSV_TEMPLATE_COLUMNS;

/**
 * Descarga la plantilla oficial en formato CSV con BOM UTF-8 sin columna de notas.
 * Formato universal, texto plano, compatible con doble clic en Google Sheets y Microsoft Excel.
 */
export function downloadCsvTemplate() {
  const csvRows = [
    CSV_TEMPLATE_COLUMNS.join(','),
    'AquaDrak,Mulagua,Índigo,1,Macho,200,867582,Fertil,Ninguna,2000,20000,20000,20000',
    'Flamito,Dragopavo,Pelirrojo,1,Hembra,8,633,Fertil,Ninguna,2000,20000,20000,20000',
    'Titanio,Vueloceronte,Marfil,3,Hembra,96,157620,Esteril,Ninguna,0,0,0,0',
  ];

  // \uFEFF fuerza a Excel y otras suites a reconocer UTF-8 al abrir el .csv con doble clic
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_crianza_dofus.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Función auxiliar para descargar plantilla Excel si fuera requerida internamente.
 */
export async function downloadExcelTemplate(): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const sampleRows = [
    ['AquaDrak', 'Mulagua', 'Índigo', 1, 'Macho', 200, 867582, 'Fertil', 'Ninguna', 2000, 20000, 20000, 20000],
    ['Flamito', 'Dragopavo', 'Pelirrojo', 1, 'Hembra', 8, 633, 'Fertil', 'Ninguna', 2000, 20000, 20000, 20000],
    ['Titanio', 'Vueloceronte', 'Marfil', 3, 'Hembra', 96, 157620, 'Esteril', 'Ninguna', 0, 0, 0, 0],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet([CSV_TEMPLATE_COLUMNS, ...sampleRows]);
  ws1['!cols'] = [
    { wch: 22 }, // Nombre
    { wch: 14 }, // Especie
    { wch: 20 }, // Color / Raza
    { wch: 12 }, // Generación
    { wch: 10 }, // Sexo
    { wch: 18 }, // Nivel
    { wch: 16 }, // XP
    { wch: 14 }, // Fertilidad
    { wch: 16 }, // Capacidad
    { wch: 12 }, // Serenidad
    { wch: 10 }, // Amor
    { wch: 10 }, // Madurez
    { wch: 12 }, // Resistencia
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Registro_Monturas');

  const guideHeaders = ['Campo', 'Valores Permitidos', 'Descripción / Reglas'];
  const guideRows = [
    ['Nombre de la montura', 'Texto libre (ej. AquaDrak, Rayito)', 'Apodo personalizado de tu montura'],
    ['Especie', 'Dragopavo, Mulagua, Vueloceronte', 'Especie oficial de la montura'],
    ['Color / Raza', 'Cualquier color oficial (ej. Almendrado, Marfil)', 'Revisa la hoja "Catalogo_Razas" para la lista completa'],
    ['Generación', '1 al 10', 'Número de generación correspondiente a la raza'],
    ['Sexo', 'Macho, Hembra (o M, F)', 'Sexo de la montura'],
    ['Nivel de la montura', '1 al 200', 'Nivel actual en el juego (si se omite, se calcula con la XP)'],
    ['XP de la montura', `0 a ${MAX_MOUNT_XP}`, `Puntos de experiencia acumulados (${MAX_MOUNT_XP} = Nivel 200)`],
    ['Fertilidad', 'Fertil, Fecunda, Esteril, Senil', 'Estado de fecundidad actual'],
    ['Capacidad', 'Ninguna, Sabia, Enamoradiza, Resistente, Precoz, Reproductora, Camaleón', 'Capacidad genética especial'],
    ['Serenidad', '-10000 a 10000', 'Negativo = Machos/Resistencia; Positivo = Hembras/Amor'],
    ['Amor', '0 a 20000', 'Amor actual de la montura'],
    ['Madurez', '0 a 20000', 'Madurez actual de la montura'],
    ['Resistencia', '0 a 20000', 'Resistencia actual de la montura'],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet([guideHeaders, ...guideRows]);
  ws2['!cols'] = [{ wch: 22 }, { wch: 45 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Guia_Valores');

  const catHeaders = ['Especie', 'Generación', 'Raza / Color'];
  const catRows = ALL_MOUNTS_DATA.map((m) => [
    m.species === 'dragopavo' ? 'Dragopavo' : m.species === 'muluaga' ? 'Mulagua' : 'Vueloceronte',
    m.generation,
    m.breed,
  ]);
  const ws3 = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
  ws3['!cols'] = [{ wch: 16 }, { wch: 14 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Catalogo_Razas');

  XLSX.writeFile(wb, 'plantilla_crianza_dofus.xlsx');
}

export async function exportMountsToExcel(mounts: UserMount[]): Promise<void> {
  const XLSX = await import('xlsx');
  const rows = mounts.map((m) => ({
    'Nombre de la montura': m.nickname,
    Especie: m.species === 'dragopavo' ? 'Dragopavo' : m.species === 'muluaga' ? 'Mulagua' : 'Vueloceronte',
    'Color / Raza': m.breed,
    Generación: m.generation,
    Sexo: m.gender === 'M' ? 'Macho' : 'Hembra',
    'Nivel de la montura': m.currentXp >= MAX_MOUNT_XP ? 200 : (m.currentLevel || calculateLevelFromXp(m.currentXp)),
    'XP de la montura': m.currentXp,
    Fertilidad:
      m.fertility === 'fertil'
        ? 'Fértil'
        : m.fertility === 'fecunda'
        ? 'Fecunda'
        : m.fertility === 'senil'
        ? 'Senil'
        : 'Estéril',
    Capacidad: m.capacity === 'ninguna' ? 'Ninguna' : m.capacity.charAt(0).toUpperCase() + m.capacity.slice(1),
    Serenidad: m.serenity,
    Amor: m.love,
    Madurez: m.maturity,
    Resistencia: m.stamina,
    'Notas / Observaciones': m.notes || '',
    Reproducciones: m.reproductionCount ?? 0,
    'Máx. reproducciones': m.maxReproductions ?? getDefaultMaxReproductions(m.species),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registro_Monturas');
  XLSX.writeFile(wb, `mis_monturas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportMountsToJson(mounts: UserMount[]) {
  const jsonStr = JSON.stringify(mounts, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `copia_seguridad_monturas_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lee y valida un archivo de copia de seguridad JSON (.json).
 * Acepta un array directo o un objeto con la propiedad { mounts: [...] }.
 */
export async function parseBackupFile(file: File): Promise<{ mounts: UserMount[]; invalid: number }> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    throw new Error('No se pudo leer el archivo de copia de seguridad.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido');
  }

  const rawList: any[] = Array.isArray(parsed)
    ? parsed
    : (parsed && Array.isArray(parsed.mounts))
    ? parsed.mounts
    : [];

  if (!Array.isArray(rawList) || rawList.length === 0) {
    throw new Error('El archivo no contiene ninguna montura.');
  }

  const mounts: UserMount[] = [];
  let invalid = 0;

  for (const item of rawList) {
    const sanitized = sanitizeMount(item);
    if (sanitized) {
      mounts.push(sanitized);
    } else {
      invalid++;
    }
  }

  if (mounts.length === 0) {
    throw new Error('No se encontró ninguna montura válida en el archivo.');
  }

  return { mounts, invalid };
}

export async function parseExcelFile(file: File): Promise<UserMount[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  // SheetJS lee automáticamente tanto .xlsx, .xls como .csv
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  if (jsonData.length <= 1) {
    throw new Error('El archivo parece estar vacío o no contiene filas de datos válidas.');
  }

  const parsedMounts: UserMount[] = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0 || row.every((c) => c === undefined || c === '')) {
      continue;
    }

    const nickname = row[0] ? String(row[0]).trim() : '';
    const rawSpecies = row[1] ? String(row[1]).trim().toLowerCase() : '';
    const breed = row[2] ? String(row[2]).trim() : '';
    const generation = Number(row[3]) || 1;
    const rawGender = row[4] ? String(row[4]).trim().toUpperCase() : 'M';

    let species: SpeciesType = 'dragopavo';
    if (rawSpecies.includes('mula') || rawSpecies.includes('mulagua')) {
      species = 'muluaga';
    } else if (rawSpecies.includes('vuelo') || rawSpecies.includes('ceronte')) {
      species = 'vueloceronte';
    } else {
      const foundDef = findMountByBreedAndSpecies(breed, 'dragopavo') ||
                       findMountByBreedAndSpecies(breed, 'muluaga') ||
                       findMountByBreedAndSpecies(breed, 'vueloceronte');
      if (foundDef) species = foundDef.species;
    }

    const matchedDef = findMountByBreedAndSpecies(breed, species);
    const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('H') ? 'F' : 'M';

    let currentLevel = Math.min(200, Math.max(1, Number(row[5]) || 1));
    let currentXp = Math.min(MAX_MOUNT_XP, Math.max(0, Number(row[6]) || 0));

    // Sincronizar nivel y XP automáticamente
    if (currentXp >= MAX_MOUNT_XP) {
      currentLevel = 200;
    } else if (currentXp > 0) {
      currentLevel = calculateLevelFromXp(currentXp);
    } else if (currentLevel > 1) {
      currentXp = calculateXpForLevel(currentLevel);
    }

    const rawFertility = row[7] ? String(row[7]).trim().toLowerCase() : 'fertil';
    let fertility: FertilityStatus = 'fertil';
    if (rawFertility.includes('fecund')) fertility = 'fecunda';
    else if (rawFertility.includes('esteril') || rawFertility.includes('estéril')) fertility = 'esteril';
    else if (rawFertility.includes('senil')) fertility = 'senil';

    const rawCapacity = row[8] ? String(row[8]).trim().toLowerCase() : 'ninguna';
    let capacity: SpecialCapacity = 'ninguna';
    if (rawCapacity.includes('sabi')) capacity = 'sabia';
    else if (rawCapacity.includes('enamor')) capacity = 'enamoradiza';
    else if (rawCapacity.includes('resist')) capacity = 'resistente';
    else if (rawCapacity.includes('precoc') || rawCapacity.includes('precoz')) capacity = 'precoz';
    else if (rawCapacity.includes('reprod')) capacity = 'reproductora';
    else if (rawCapacity.includes('camele') || rawCapacity.includes('camale')) capacity = 'camaleon';

    const isEsterilOrSenil = fertility === 'esteril' || fertility === 'senil';
    const serenity = isEsterilOrSenil ? 0 : Math.min(10000, Math.max(-10000, Number(row[9]) || 0));
    const love = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[10]) || 0));
    const maturity = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[11]) || 0));
    const stamina = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[12]) || 0));
    const notes = row[13] ? String(row[13]).trim() : '';

    // Columnas opcionales row[14] (reproductionCount) y row[15] (maxReproductions)
    const rawRepro = Number(row[14]);
    const reproductionCount = !isNaN(rawRepro) && rawRepro >= 0 ? Math.floor(rawRepro) : 0;

    const defaultMax = getDefaultMaxReproductions(species);
    const rawMaxRepro = Number(row[15]);
    const maxReproductions = !isNaN(rawMaxRepro) && rawMaxRepro > 0 ? Math.floor(rawMaxRepro) : defaultMax;

    parsedMounts.push({
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: nickname || (matchedDef ? matchedDef.name : breed) || 'Sin Nombre',
      species,
      breed: matchedDef ? matchedDef.breed : breed,
      imageUrl: matchedDef ? matchedDef.imageUrl : '',
      generation: matchedDef ? matchedDef.generation : generation,
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
      notes,
    });
  }

  if (parsedMounts.length === 0) {
    throw new Error('No se encontraron filas con monturas válidas en el archivo importado.');
  }

  return parsedMounts;
}
