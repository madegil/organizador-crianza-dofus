import type { SpeciesType } from '../types/mount';

/*
  Logros de la categoría Ganadería tal como aparecen en el juego (Dofus 3, español).
  Los identificadores son estables: no cambiarlos, porque son la clave de lo que el usuario marcó.
*/

export type CategoriaLogro = 'general' | SpeciesType;

export interface Logro {
  id: string;
  categoria: CategoriaLogro;
  nombre: string;
  descripcion: string;
  puntos: number;
  tipo: 'nacimientos' | 'captura' | 'generacion' | 'meta';
  /** Número que se dibuja en el icono (nacimientos o generación) */
  numero?: number;
  /** Razas que exige: generación de esa especie */
  medible?: { especie: SpeciesType; generacion: number };
  /** Logros que agrupa un logro meta */
  requisitos?: string[];
}

export const CATEGORIAS: { id: CategoriaLogro; nombre: string; icono: string }[] = [
  { id: 'general', nombre: 'General', icono: '/guia/objetos/geneticha.webp' },
  { id: 'dragopavo', nombre: 'Dragopavos', icono: 'https://api.dofusdu.de/dofus2/img/mount/20.png' },
  { id: 'muluaga', nombre: 'Mulaguas', icono: 'https://api.dofusdu.de/dofus3/v1/img/item/97091-128.png' },
  { id: 'vueloceronte', nombre: 'Vuelocerontes', icono: 'https://api.dofusdu.de/dofus3/v1/img/item/97177-128.png' },
];

const ORDINAL = ['', '', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena', 'décima'];
const PUNTOS_GEN = [0, 0, 10, 20, 20, 30, 30, 40, 40, 50, 50];

interface DatosEspecie {
  singular: string; // "Dragopavo"
  plural: string; // "dragopavos"
  articulo: string; // "los" | "las"
  todos: string; // "todos" | "todas"
  captura: string;
  meta: string;
}

const ESPECIES: Record<SpeciesType, DatosEspecie> = {
  dragopavo: { singular: 'Dragopavo', plural: 'dragopavos', articulo: 'los', todos: 'todos', captura: 'Cazamonturas', meta: 'De generación en generación' },
  muluaga: { singular: 'Mulagua', plural: 'mulaguas', articulo: 'las', todos: 'todas', captura: 'Muestra marina', meta: 'Generaciones acuáticas' },
  vueloceronte: { singular: 'Vueloceronte', plural: 'vuelocerontes', articulo: 'los', todos: 'todos', captura: 'Muestra cornuda', meta: 'Generación V' },
};

const porEspecie = (especie: SpeciesType): Logro[] => {
  const e = ESPECIES[especie];
  return [
    {
      id: `${especie}-captura`,
      categoria: especie,
      nombre: e.captura,
      descripcion: `Capturar ${e.articulo} ${e.plural}.`,
      puntos: 10,
      tipo: 'captura',
      medible: { especie, generacion: 1 },
    },
    ...Array.from({ length: 9 }, (_, i): Logro => {
      const g = i + 2;
      return {
        id: `${especie}-gen-${g}`,
        categoria: especie,
        nombre: `${e.singular}: ${ORDINAL[g]} generación`,
        descripcion: `Conseguir que nazcan ${e.todos} ${e.articulo} ${e.plural} de ${ORDINAL[g]} generación.`,
        puntos: PUNTOS_GEN[g],
        tipo: 'generacion',
        numero: g,
        medible: { especie, generacion: g },
      };
    }),
    {
      id: `${especie}-meta`,
      categoria: especie,
      nombre: e.meta,
      descripcion: 'Conseguir los siguientes logros.',
      puntos: 50,
      tipo: 'meta',
      // Las nueve generaciones; la captura cuenta aparte, en Señor ganadero
      requisitos: Array.from({ length: 9 }, (_, i) => `${especie}-gen-${i + 2}`),
    },
  ];
};

export const LOGROS: Logro[] = [
  { id: 'general-nacimientos-1', categoria: 'general', nombre: 'Primeriza', descripcion: 'Hacer que nazca 1 montura.', puntos: 1, tipo: 'nacimientos', numero: 1 },
  { id: 'general-nacimientos-10', categoria: 'general', nombre: 'Comadrona', descripcion: 'Hacer que nazcan 10 monturas.', puntos: 10, tipo: 'nacimientos', numero: 10 },
  { id: 'general-nacimientos-100', categoria: 'general', nombre: 'Matrona', descripcion: 'Hacer que nazcan 100 monturas.', puntos: 20, tipo: 'nacimientos', numero: 100 },
  // Conserva el id de la primera versión de esta lista
  { id: 'general-nacimientos-1000', categoria: 'general', nombre: 'Hiperfértil', descripcion: 'Hacer que nazcan 1000 monturas.', puntos: 30, tipo: 'nacimientos', numero: 1000 },
  {
    id: 'general-meta',
    categoria: 'general',
    nombre: 'Señor ganadero',
    descripcion: 'Conseguir los siguientes logros.',
    puntos: 100,
    tipo: 'meta',
    requisitos: [
      'dragopavo-captura',
      'muluaga-captura',
      'vueloceronte-captura',
      'general-nacimientos-1000',
      'dragopavo-meta',
      'muluaga-meta',
      'vueloceronte-meta',
    ],
  },
  ...porEspecie('dragopavo'),
  ...porEspecie('muluaga'),
  ...porEspecie('vueloceronte'),
];

/** Logros que agrupa un logro meta, en el orden del juego */
export const requisitosDeMeta = (meta: Logro): Logro[] =>
  (meta.requisitos ?? []).map((id) => LOGROS.find((l) => l.id === id)).filter((l): l is Logro => Boolean(l));

export const PUNTOS_TOTALES = LOGROS.reduce((s, l) => s + l.puntos, 0);
