import type { SpeciesType } from '../types/mount';

/*
  Logros de ganadería desde la actualización 3.5.
  Fuentes: dofuspourlesnoobs.com (presentación de la 3.5) y dofuspourlespros.com (guía del ganadero).
  - Por especie: capturar todas las salvajes de generación 1 y hacer nacer todas las razas de cada
    generación, de la 2 a la 10 (la 3.5 quitó los logros de generación 1 y los de apareamiento).
  - General: hacer nacer 1.000 monturas.
  Los nombres son descriptivos; los del juego pueden variar.
*/

export type CategoriaLogro = 'general' | SpeciesType;

export interface Logro {
  id: string;
  categoria: CategoriaLogro;
  nombre: string;
  requisito: string;
  /** Si se puede medir con las monturas registradas en el establo */
  medible?: { especie: SpeciesType; generacion: number };
}

export const CATEGORIAS: { id: CategoriaLogro; nombre: string; icono: string }[] = [
  { id: 'general', nombre: 'General', icono: '/guia/objetos/geneticha.webp' },
  { id: 'dragopavo', nombre: 'Dragopavos', icono: 'https://api.dofusdu.de/dofus2/img/mount/20.png' },
  { id: 'muluaga', nombre: 'Mulaguas', icono: 'https://api.dofusdu.de/dofus3/v1/img/item/97091-128.png' },
  { id: 'vueloceronte', nombre: 'Vuelocerontes', icono: 'https://api.dofusdu.de/dofus3/v1/img/item/97177-128.png' },
];

const NOMBRE: Record<SpeciesType, { uno: string; varios: string }> = {
  dragopavo: { uno: 'dragopavo', varios: 'dragopavos' },
  muluaga: { uno: 'mulagua', varios: 'mulaguas' },
  vueloceronte: { uno: 'vueloceronte', varios: 'vuelocerontes' },
};

const porEspecie = (especie: SpeciesType): Logro[] => {
  const n = NOMBRE[especie];
  return [
    {
      id: `${especie}-captura`,
      categoria: especie,
      nombre: `Captura de ${n.varios}`,
      requisito: `Captura todas las razas salvajes de ${n.uno}, las de generación 1.`,
      medible: { especie, generacion: 1 },
    },
    ...Array.from({ length: 9 }, (_, i) => {
      const generacion = i + 2;
      return {
        id: `${especie}-gen-${generacion}`,
        categoria: especie,
        nombre: `${n.varios[0].toUpperCase()}${n.varios.slice(1)} de generación ${generacion}`,
        requisito: `Haz nacer todas las razas de ${n.uno} de generación ${generacion}.`,
        medible: { especie, generacion },
      } satisfies Logro;
    }),
  ];
};

export const LOGROS: Logro[] = [
  {
    id: 'general-nacimientos-1000',
    categoria: 'general',
    nombre: 'Mil nacimientos',
    requisito: 'Haz nacer 1.000 monturas de cualquier tipo.',
  },
  ...porEspecie('dragopavo'),
  ...porEspecie('muluaga'),
  ...porEspecie('vueloceronte'),
];
