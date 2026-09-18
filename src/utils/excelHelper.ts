import * as XLSX from 'xlsx';
import type { UserMount, SpeciesType, FertilityStatus, SpecialCapacity } from '../types/mount';
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';
import { calculateLevelFromXp, calculateXpForLevel } from '../data/fuelData';

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
    'Flamito,Dragopavo,Pelirroja,1,Hembra,8,633,Fertil,Ninguna,2000,20000,20000,20000',
    'Titanio,Vueloceronte,Marfil,3,Hembra,96,157620,Esteril,Ninguna,0,0,0,0',
  ];

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_crianza_dofus.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Función auxiliar para descargar plantilla Excel si fuera requerida internamente.
 */
export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

  const sampleRows = [
    ['AquaDrak', 'Mulagua', 'Índigo', 1, 'Macho', 200, 867582, 'Fertil', 'Ninguna', 2000, 20000, 20000, 20000],
    ['Flamito', 'Dragopavo', 'Pelirroja', 1, 'Hembra', 8, 633, 'Fertil', 'Ninguna', 2000, 20000, 20000, 20000],
    ['Titanio', 'Vueloceronte', 'Marfil', 3, 'Hembra', 96, 157620, 'Esteril', 'Ninguna', 0, 0, 0, 0],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet([CSV_TEMPLATE_COLUMNS, ...sampleRows]);
  ws1['!cols'] = [
    { wch: 22 }, // Nombre
    { wch: 16 }, // Especie
    { wch: 25 }, // Color / Raza
    { wch: 14 }, // Generación
    { wch: 12 }, // Sexo
    { wch: 18 }, // Nivel
    { wch: 18 }, // XP
    { wch: 14 }, // Fertilidad
    { wch: 18 }, // Capacidad
    { wch: 14 }, // Serenidad
    { wch: 14 }, // Amor
    { wch: 14 }, // Madurez
    { wch: 14 }, // Resistencia
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Registro_Monturas');

  const guideHeaders = ['Columna', 'Valores Aceptados', 'Reglas y Consejos'];
  const guideRows = [
    ['Nombre de la montura', 'Texto libre (ej. AquaDrak, Rayito)', 'Apodo personalizado de tu montura'],
    ['Especie', 'Dragopavo, Mulagua, Vueloceronte', 'Especie oficial de la montura'],
    ['Color / Raza', 'Cualquier color oficial (ej. Almendrada, Marfil)', 'Revisa la hoja "Catalogo_Razas" para la lista completa'],
    ['Generación', '1 al 10', 'Número de generación correspondiente a la raza'],
    ['Sexo', 'Macho, Hembra (o M, F)', 'Sexo de la montura'],
    ['Nivel de la montura', '1 al 200', 'Nivel actual en el juego (si se omite, se calcula con la XP)'],
    ['XP de la montura', '0 a 867582', 'Puntos de experiencia acumulados (867582 = Nivel 200)'],
    ['Fertilidad', 'Fertil, Fecunda, Esteril, Senil', 'Estado de fecundidad actual'],
    ['Capacidad', 'Ninguna, Sabia, Enamoradiza, Resistente, Precoz, Reproductora, Camaleón', 'Capacidad genética especial'],
    ['Serenidad', '-10000 a 10000', 'Negativo = Machos/Resistencia; Positivo = Hembras/Amor'],
    ['Amor', '0 a 20000', 'Medidor de amor para fecundación'],
    ['Madurez', '0 a 20000', 'Medidor de madurez para montar'],
    ['Resistencia', '0 a 20000', 'Medidor de resistencia para fecundación'],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet([guideHeaders, ...guideRows]);
  ws2['!cols'] = [{ wch: 24 }, { wch: 45 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Guia_Valores');

  const catHeaders = ['Especie', 'Color / Raza Oficial', 'Generación'];
  const catRows: any[][] = [];
  ALL_MOUNTS_DATA.forEach((m) => {
    catRows.push([
      m.species === 'dragopavo' ? 'Dragopavo' : m.species === 'muluaga' ? 'Mulagua' : 'Vueloceronte',
      m.name,
      m.generation,
    ]);
  });
  const ws3 = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
  ws3['!cols'] = [{ wch: 18 }, { wch: 30 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Catalogo_Razas');

  XLSX.writeFile(wb, 'plantilla_crianza_dofus.xlsx');
}

export function exportMountsToExcel(mounts: UserMount[]) {
  const rows = mounts.map((m) => ({
    'Nombre de la montura': m.nickname,
    Especie: m.species === 'dragopavo' ? 'Dragopavo' : m.species === 'muluaga' ? 'Mulagua' : 'Vueloceronte',
    'Color / Raza': m.breed,
    Generación: m.generation,
    Sexo: m.gender === 'M' ? 'Macho' : 'Hembra',
    'Nivel de la montura': m.currentXp >= 867582 ? 200 : (m.currentLevel || calculateLevelFromXp(m.currentXp)),
    'XP de la montura': m.currentXp,
    Fertilidad:
      m.fertility === 'fertil'
        ? 'Fertil'
        : m.fertility === 'fecunda'
        ? 'Fecunda'
        : m.fertility === 'esteril'
        ? 'Esteril'
        : 'Senil',
    Capacidad: m.capacity === 'ninguna' ? 'Ninguna' : m.capacity.charAt(0).toUpperCase() + m.capacity.slice(1),
    Serenidad: m.serenity,
    Amor: m.love,
    Madurez: m.maturity,
    Resistencia: m.stamina,
    'Notas / Observaciones': m.notes || '',
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
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_monturas_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseExcelFile(file: File): Promise<UserMount[]> {
  const buffer = await file.arrayBuffer();
  // SheetJS lee automáticamente tanto .xlsx, .xls como .csv
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
    let row = dataRows[i];
    if (!row || row.length === 0) continue;

    // Resiliencia para CSV delimitados por punto y coma (común en Excel en español)
    if (row.length === 1 && typeof row[0] === 'string' && row[0].includes(';')) {
      row = row[0].split(';');
    }

    const nickname = row[0] ? String(row[0]).trim() : '';
    let rawSpecies = String(row[1] || '').toLowerCase().trim();
    const breed = row[2] ? String(row[2]).trim() : '';

    // Si la fila no contiene especie ni color/raza ni nombre, la consideramos fila vacía y la saltamos
    if (!rawSpecies && !breed && !nickname) continue;

    let species: SpeciesType = 'dragopavo';
    if (rawSpecies.includes('muldo') || rawSpecies.includes('mulagua') || rawSpecies.includes('muluaga')) species = 'muluaga';
    else if (rawSpecies.includes('volk') || rawSpecies.includes('vuelo') || rawSpecies.includes('ceronte')) species = 'vueloceronte';

    const matchedDef = findMountByBreedAndSpecies(breed || 'Almendrada', species);
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
      nickname: nickname || breed || (matchedDef ? matchedDef.name : 'Sin Nombre'),
      definitionId,
      species,
      breed: breed || (matchedDef ? matchedDef.name : 'Almendrada'),
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
