/**
 * Objetos importantes que aparecen en la guía, con su nombre en el juego (Dofus 3, español)
 * y su imagen, descargada de la API de dofusdu.de a /public/guia/objetos.
 */
export interface GuideItem {
  /** Nombre exacto en el juego, se muestra al pasar el ratón */
  name: string;
  img: string;
}

const img = (slug: string) => `/guia/objetos/${slug}.webp`;

export const GUIDE_ITEMS = {
  'red-universal': { name: 'Red de captura universal', img: img('red-universal') },
  'red-multiplicadora': { name: 'Red multiplicadora de dragopavo', img: img('red-multiplicadora') },
  'red-reforzada': { name: 'Red para dragopavos reforzada', img: img('red-reforzada') },
  'red-multiplicadora-reforzada': { name: 'Red multiplicadora de dragopavo reforzada', img: img('red-multiplicadora-reforzada') },
  extracto: { name: 'Extracto gigantesco de experiencia de montura', img: img('extracto') },
  filtro: { name: 'Filtro gigantesco de experiencia de montura', img: img('filtro') },
  pocima: { name: 'Pócima gigantesca de experiencia de montura', img: img('pocima') },
  elixir: { name: 'Elixir gigantesco de experiencia de montura', img: img('elixir') },
  animakina: { name: 'Animákina', img: img('animakina') },
  kromakina: { name: 'Kromákina', img: img('kromakina') },
  optimakina: { name: 'Optimákina', img: img('optimakina') },
  'polvo-ganaderia': { name: 'Polvo de ganadería', img: img('polvo-ganaderia') },
  geneticha: { name: 'Geneticha', img: img('geneticha') },
  'pocima-teletransporte': { name: 'Pócima de teletransportación: Pueblo de los ganaderos', img: img('pocima-teletransporte-ganaderos') },
  'neurona-dragopavo': { name: 'Neurona de dragopavo', img: img('neurona-dragopavo') },
  'ambar-mulagua': { name: 'Ámbar de mulagua', img: img('ambar-mulagua') },
  'cuerno-vueloceronte': { name: 'Cuerno de vueloceronte', img: img('cuerno-vueloceronte') },
  'pez-gatito': { name: 'Pez gatito', img: img('pez-gatito') },
  avena: { name: 'Avena', img: img('avena') },
  'menta-salvaje': { name: 'Menta salvaje', img: img('menta-salvaje') },
} satisfies Record<string, GuideItem>;

export type GuideItemId = keyof typeof GUIDE_ITEMS;
