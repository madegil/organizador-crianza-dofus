import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const headers = [
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
  'Notas / Observaciones'
];

const sampleRows = [
  [
    'AquaDrak',
    'Mulagua',
    'Índigo',
    1,
    'Macho',
    200,
    867582,
    'Fertil',
    'Ninguna',
    2000,
    20000,
    20000,
    20000,
    'Ejemplo: Nivel 200 con XP máxima'
  ],
  [
    'Flamito',
    'Dragopavo',
    'Pelirroja',
    1,
    'Hembra',
    8,
    633,
    'Fertil',
    'Ninguna',
    2000,
    20000,
    20000,
    20000,
    'Ejemplo: Nivel 8'
  ],
  [
    'Titanio',
    'Vueloceronte',
    'Marfil',
    3,
    'Hembra',
    96,
    157620,
    'Esteril',
    'Ninguna',
    0,
    0,
    0,
    0,
    'Ejemplo: Estéril (medidores en 0)'
  ]
];

const wb = XLSX.utils.book_new();
const ws1 = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
ws1['!cols'] = [
  { wch: 22 },
  { wch: 16 },
  { wch: 25 },
  { wch: 14 },
  { wch: 12 },
  { wch: 18 },
  { wch: 18 },
  { wch: 14 },
  { wch: 18 },
  { wch: 14 },
  { wch: 14 },
  { wch: 14 },
  { wch: 14 },
  { wch: 35 }
];
XLSX.utils.book_append_sheet(wb, ws1, 'Registro_Monturas');

const outDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Write .xlsx
const xlsxBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync(path.join(outDir, 'plantilla_crianza_dofus.xlsx'), xlsxBuf);

// Write .csv with UTF-8 BOM
const csvContent = '\uFEFF' + [
  headers.join(','),
  ...sampleRows.map(r => r.join(','))
].join('\r\n');
fs.writeFileSync(path.join(outDir, 'plantilla_crianza_dofus.csv'), csvContent, 'utf8');

console.log('Prebuild: generated plantilla_crianza_dofus.xlsx and .csv cleanly via SheetJS');
