import type { MountDefinition } from '../types/mount';

export const DRAGODINDES_DATA: MountDefinition[] = [
  {
    "id": "dd_amande",
    "species": "dragopavo",
    "generation": 1,
    "name": "Almendrado",
    "bonuses": [
      "400 Vitalidad",
      "1700 Iniciativa"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/20.png"
  },
  {
    "id": "dd_doree",
    "species": "dragopavo",
    "generation": 1,
    "name": "Dorado",
    "bonuses": [
      "400 Vitalidad",
      "2 Invocaciones"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/18.png"
  },
  {
    "id": "dd_rousse",
    "species": "dragopavo",
    "generation": 1,
    "name": "Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "60 Curas"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/10.png"
  },
  {
    "id": "dd_amande_rousse",
    "species": "dragopavo",
    "generation": 2,
    "name": "Almendrado y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "60 Curas",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/38.png"
  },
  {
    "id": "dd_doree_rousse",
    "species": "dragopavo",
    "generation": 2,
    "name": "Dorado y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "1 Invocation",
      "45 Curas"
    ],
    "parents": [
      "dd_doree",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/46.png"
  },
  {
    "id": "dd_amande_doree",
    "species": "dragopavo",
    "generation": 2,
    "name": "Almendrado y Dorado",
    "bonuses": [
      "400 Vitalidad",
      "1 Invocation",
      "1000 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_doree"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/33.png"
  },
  {
    "id": "dd_ebene",
    "species": "dragopavo",
    "generation": 3,
    "name": "Ébano",
    "bonuses": [
      "400 Vitalidad",
      "120 Agilidad"
    ],
    "parents": [
      "dd_amande_rousse",
      "dd_amande_doree"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/3.png"
  },
  {
    "id": "dd_indigo",
    "species": "dragopavo",
    "generation": 3,
    "name": "Índigo",
    "bonuses": [
      "400 Vitalidad",
      "120 Suerte"
    ],
    "parents": [
      "dd_doree_rousse",
      "dd_amande_doree"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/17.png"
  },
  {
    "id": "dd_amande_ebene",
    "species": "dragopavo",
    "generation": 4,
    "name": "Almendrado y Ébano",
    "bonuses": [
      "400 Vitalidad",
      "120 Agilidad",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/34.png"
  },
  {
    "id": "dd_amande_indigo",
    "species": "dragopavo",
    "generation": 4,
    "name": "Almendrado e Índigo",
    "bonuses": [
      "400 Vitalidad",
      "120 Suerte",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/36.png"
  },
  {
    "id": "dd_doree_ebene",
    "species": "dragopavo",
    "generation": 4,
    "name": "Dorado y Ébano",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/42.png"
  },
  {
    "id": "dd_doree_indigo",
    "species": "dragopavo",
    "generation": 4,
    "name": "Dorado e Índigo",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/44.png"
  },
  {
    "id": "dd_ebene_indigo",
    "species": "dragopavo",
    "generation": 4,
    "name": "Ébano e Índigo",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "90 Suerte"
    ],
    "parents": [
      "dd_ebene",
      "dd_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/51.png"
  },
  {
    "id": "dd_rousse_ebene",
    "species": "dragopavo",
    "generation": 4,
    "name": "Pelirrojo y Ébano",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "45 Curas"
    ],
    "parents": [
      "dd_rousse",
      "dd_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/12.png"
  },
  {
    "id": "dd_rousse_indigo",
    "species": "dragopavo",
    "generation": 4,
    "name": "Pelirrojo e Índigo",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "45 Curas"
    ],
    "parents": [
      "dd_rousse",
      "dd_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/62.png"
  },
  {
    "id": "dd_pourpre",
    "species": "dragopavo",
    "generation": 5,
    "name": "Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "120 Fuerza"
    ],
    "parents": [
      "dd_ebene_indigo",
      "dd_amande_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/19.png"
  },
  {
    "id": "dd_orchidee",
    "species": "dragopavo",
    "generation": 5,
    "name": "Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "120 Inteligencia"
    ],
    "parents": [
      "dd_ebene_indigo",
      "dd_doree_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/22.png"
  },
  {
    "id": "dd_amande_pourpre",
    "species": "dragopavo",
    "generation": 6,
    "name": "Almendrado y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/41.png"
  },
  {
    "id": "dd_amande_orchidee",
    "species": "dragopavo",
    "generation": 6,
    "name": "Almendrado y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/40.png"
  },
  {
    "id": "dd_doree_pourpre",
    "species": "dragopavo",
    "generation": 6,
    "name": "Dorado y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/49.png"
  },
  {
    "id": "dd_doree_orchidee",
    "species": "dragopavo",
    "generation": 6,
    "name": "Dorado y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/48.png"
  },
  {
    "id": "dd_ebene_pourpre",
    "species": "dragopavo",
    "generation": 6,
    "name": "Ébano y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "90 Fuerza"
    ],
    "parents": [
      "dd_ebene",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/54.png"
  },
  {
    "id": "dd_ebene_orchidee",
    "species": "dragopavo",
    "generation": 6,
    "name": "Ébano y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "90 Inteligencia"
    ],
    "parents": [
      "dd_ebene",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/53.png"
  },
  {
    "id": "dd_indigo_pourpre",
    "species": "dragopavo",
    "generation": 6,
    "name": "Índigo y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "90 Fuerza"
    ],
    "parents": [
      "dd_indigo",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/65.png"
  },
  {
    "id": "dd_indigo_orchidee",
    "species": "dragopavo",
    "generation": 6,
    "name": "Índigo y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "90 Inteligencia"
    ],
    "parents": [
      "dd_indigo",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/64.png"
  },
  {
    "id": "dd_orchidee_pourpre",
    "species": "dragopavo",
    "generation": 6,
    "name": "Orquídeo y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "90 Fuerza"
    ],
    "parents": [
      "dd_orchidee",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/76.png"
  },
  {
    "id": "dd_pourpre_rousse",
    "species": "dragopavo",
    "generation": 6,
    "name": "Pelirrojo y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "45 Curas"
    ],
    "parents": [
      "dd_rousse",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/71.png"
  },
  {
    "id": "dd_orchidee_rousse",
    "species": "dragopavo",
    "generation": 6,
    "name": "Orquídeo y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "45 Curas"
    ],
    "parents": [
      "dd_rousse",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/70.png"
  },
  {
    "id": "dd_ivoire",
    "species": "dragopavo",
    "generation": 7,
    "name": "Marfil",
    "bonuses": [
      "400 Vitalidad",
      "90 Potencia"
    ],
    "parents": [
      "dd_orchidee_pourpre",
      "dd_amande_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/16.png"
  },
  {
    "id": "dd_turquoise",
    "species": "dragopavo",
    "generation": 7,
    "name": "Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "90 Prospección"
    ],
    "parents": [
      "dd_orchidee_pourpre",
      "dd_doree_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/15.png"
  },
  {
    "id": "dd_amande_ivoire",
    "species": "dragopavo",
    "generation": 8,
    "name": "Almendrado y Marfil",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/37.png"
  },
  {
    "id": "dd_amande_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Almendrado y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Prospección",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/39.png"
  },
  {
    "id": "dd_doree_ivoire",
    "species": "dragopavo",
    "generation": 8,
    "name": "Dorado y Marfil",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/45.png"
  },
  {
    "id": "dd_doree_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Dorado y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Prospección",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/47.png"
  },
  {
    "id": "dd_ebene_ivoire",
    "species": "dragopavo",
    "generation": 8,
    "name": "Ébano y Marfil",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "70 Potencia"
    ],
    "parents": [
      "dd_ebene",
      "dd_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/9.png"
  },
  {
    "id": "dd_ebene_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Ébano y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "70 Prospección"
    ],
    "parents": [
      "dd_ebene",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/52.png"
  },
  {
    "id": "dd_indigo_ivoire",
    "species": "dragopavo",
    "generation": 8,
    "name": "Índigo y Marfil",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "70 Potencia"
    ],
    "parents": [
      "dd_indigo",
      "dd_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/61.png"
  },
  {
    "id": "dd_indigo_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Índigo y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "70 Prospección"
    ],
    "parents": [
      "dd_indigo",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/63.png"
  },
  {
    "id": "dd_ivoire_pourpre",
    "species": "dragopavo",
    "generation": 8,
    "name": "Marfil y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "70 Potencia"
    ],
    "parents": [
      "dd_ivoire",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/68.png"
  },
  {
    "id": "dd_ivoire_orchidee",
    "species": "dragopavo",
    "generation": 8,
    "name": "Marfil y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "70 Potencia"
    ],
    "parents": [
      "dd_ivoire",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/67.png"
  },
  {
    "id": "dd_ivoire_rousse",
    "species": "dragopavo",
    "generation": 8,
    "name": "Marfil y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "45 Curas"
    ],
    "parents": [
      "dd_ivoire",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/11.png"
  },
  {
    "id": "dd_ivoire_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Marfil y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "70 Prospección"
    ],
    "parents": [
      "dd_ivoire",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/66.png"
  },
  {
    "id": "dd_pourpre_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Púrpura y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "70 Prospección"
    ],
    "parents": [
      "dd_pourpre",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/73.png"
  },
  {
    "id": "dd_orchidee_turquoise",
    "species": "dragopavo",
    "generation": 8,
    "name": "Orquídeo y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "70 Prospección"
    ],
    "parents": [
      "dd_orchidee",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/72.png"
  },
  {
    "id": "dd_turquoise_rousse",
    "species": "dragopavo",
    "generation": 8,
    "name": "Pelirrojo y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Prospección",
      "45 Curas"
    ],
    "parents": [
      "dd_turquoise",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/69.png"
  },
  {
    "id": "dd_emeraude",
    "species": "dragopavo",
    "generation": 9,
    "name": "Esmeralda",
    "bonuses": [
      "400 Vitalidad",
      "1 PM"
    ],
    "parents": [
      "dd_ivoire_turquoise",
      "dd_amande_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/21.png"
  },
  {
    "id": "dd_prune",
    "species": "dragopavo",
    "generation": 9,
    "name": "Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "2 Alcance"
    ],
    "parents": [
      "dd_ivoire_turquoise",
      "dd_doree_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/23.png"
  },
  {
    "id": "dd_amande_emeraude",
    "species": "dragopavo",
    "generation": 10,
    "name": "Almendrado y Esmeralda",
    "bonuses": [
      "400 Vitalidad",
      "1 PM",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/35.png"
  },
  {
    "id": "dd_amande_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Almendrado y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "1 Alcance",
      "1200 Iniciativa"
    ],
    "parents": [
      "dd_amande",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/77.png"
  },
  {
    "id": "dd_doree_emeraude",
    "species": "dragopavo",
    "generation": 10,
    "name": "Dorado y Esmeralda",
    "bonuses": [
      "400 Vitalidad",
      "1 PM",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/43.png"
  },
  {
    "id": "dd_doree_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Dorado y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "1 Alcance",
      "1 Invocation"
    ],
    "parents": [
      "dd_doree",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/78.png"
  },
  {
    "id": "dd_ebene_emeraude",
    "species": "dragopavo",
    "generation": 10,
    "name": "Ébano y Esmeralda",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "1 PM"
    ],
    "parents": [
      "dd_ebene",
      "dd_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/50.png"
  },
  {
    "id": "dd_ebene_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Ébano y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "90 Agilidad",
      "1 Alcance"
    ],
    "parents": [
      "dd_ebene",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/79.png"
  },
  {
    "id": "dd_emeraude_pourpre",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Púrpura",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "1 PM"
    ],
    "parents": [
      "dd_emeraude",
      "dd_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/60.png"
  },
  {
    "id": "dd_emeraude_orchidee",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Orquídeo",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "1 PM"
    ],
    "parents": [
      "dd_emeraude",
      "dd_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/59.png"
  },
  {
    "id": "dd_emeraude_indigo",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda e Índigo",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "1 PM"
    ],
    "parents": [
      "dd_emeraude",
      "dd_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/55.png"
  },
  {
    "id": "dd_emeraude_ivoire",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Marfil",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "1 PM"
    ],
    "parents": [
      "dd_emeraude",
      "dd_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/56.png"
  },
  {
    "id": "dd_emeraude_turquoise",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Prospección",
      "1 PM"
    ],
    "parents": [
      "dd_emeraude",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/58.png"
  },
  {
    "id": "dd_emeraude_rousse",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "1 PM",
      "45 Curas"
    ],
    "parents": [
      "dd_emeraude",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/57.png"
  },
  {
    "id": "dd_indigo_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Índigo y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "90 Suerte",
      "1 Alcance"
    ],
    "parents": [
      "dd_indigo",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/82.png"
  },
  {
    "id": "dd_ivoire_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Marfil y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "70 Potencia",
      "1 Alcance"
    ],
    "parents": [
      "dd_ivoire",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/83.png"
  },
  {
    "id": "dd_pourpre_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Púrpura y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "90 Fuerza",
      "1 Alcance"
    ],
    "parents": [
      "dd_pourpre",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/87.png"
  },
  {
    "id": "dd_orchidee_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Orquídeo y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "90 Inteligencia",
      "1 Alcance"
    ],
    "parents": [
      "dd_orchidee",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/86.png"
  },
  {
    "id": "dd_prune_rousse",
    "species": "dragopavo",
    "generation": 10,
    "name": "Ciruela y Pelirrojo",
    "bonuses": [
      "400 Vitalidad",
      "1 Alcance",
      "45 Curas"
    ],
    "parents": [
      "dd_prune",
      "dd_rousse"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/84.png"
  },
  {
    "id": "dd_prune_turquoise",
    "species": "dragopavo",
    "generation": 10,
    "name": "Ciruela y Turquesa",
    "bonuses": [
      "400 Vitalidad",
      "70 Prospección",
      "1 Alcance"
    ],
    "parents": [
      "dd_prune",
      "dd_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/85.png"
  },
  {
    "id": "dd_emeraude_prune",
    "species": "dragopavo",
    "generation": 10,
    "name": "Esmeralda y Ciruela",
    "bonuses": [
      "400 Vitalidad",
      "1 PM",
      "1 Alcance"
    ],
    "parents": [
      "dd_emeraude",
      "dd_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus2/img/mount/80.png"
  }
];
