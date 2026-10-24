import type { MountDefinition } from '../types/mount';

// Generaciones y cruces: dofuspourlesnoobs.com. Nombres, bonos (nivel 100) e imágenes: api.dofusdu.de (es).
export const MULDOS_DATA: MountDefinition[] = [
  {
    "id": "muldo_ebene",
    "species": "muluaga",
    "generation": 1,
    "name": "Ébano",
    "bonuses": [
      "1 PM",
      "18% Resistencia al aire"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97091-128.png"
  },
  {
    "id": "muldo_indigo",
    "species": "muluaga",
    "generation": 1,
    "name": "Índigo",
    "bonuses": [
      "1 PM",
      "18% Resistencia al agua"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97092-128.png"
  },
  {
    "id": "muldo_pourpre",
    "species": "muluaga",
    "generation": 1,
    "name": "Púrpura",
    "bonuses": [
      "1 PM",
      "18% Resistencia a la tierra"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97093-128.png"
  },
  {
    "id": "muldo_orchidee",
    "species": "muluaga",
    "generation": 1,
    "name": "Orquídea",
    "bonuses": [
      "1 PM",
      "18% Resistencia al fuego"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97090-128.png"
  },
  {
    "id": "muldo_dore",
    "species": "muluaga",
    "generation": 1,
    "name": "Dorada",
    "bonuses": [
      "1 PM",
      "70 Potencia"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97094-128.png"
  },
  {
    "id": "muldo_dore_pourpre",
    "species": "muluaga",
    "generation": 2,
    "name": "Dorada y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "60 Potencia"
    ],
    "parents": [
      "muldo_dore",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97101-128.png"
  },
  {
    "id": "muldo_indigo_pourpre",
    "species": "muluaga",
    "generation": 2,
    "name": "Índigo y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "10% Resistencia al agua"
    ],
    "parents": [
      "muldo_indigo",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97102-128.png"
  },
  {
    "id": "muldo_ebene_pourpre",
    "species": "muluaga",
    "generation": 2,
    "name": "Ébano y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "10% Resistencia a la tierra"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97103-128.png"
  },
  {
    "id": "muldo_pourpre_orchidee",
    "species": "muluaga",
    "generation": 2,
    "name": "Orquídea y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "10% Resistencia al fuego"
    ],
    "parents": [
      "muldo_orchidee",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97104-128.png"
  },
  {
    "id": "muldo_dore_orchidee",
    "species": "muluaga",
    "generation": 2,
    "name": "Dorada y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "60 Potencia"
    ],
    "parents": [
      "muldo_dore",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97105-128.png"
  },
  {
    "id": "muldo_indigo_orchidee",
    "species": "muluaga",
    "generation": 2,
    "name": "Índigo y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "10% Resistencia al agua"
    ],
    "parents": [
      "muldo_indigo",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97106-128.png"
  },
  {
    "id": "muldo_ebene_orchidee",
    "species": "muluaga",
    "generation": 2,
    "name": "Ébano y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "10% Resistencia al fuego"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97107-128.png"
  },
  {
    "id": "muldo_dore_ebene",
    "species": "muluaga",
    "generation": 2,
    "name": "Dorada y Ébano",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "60 Potencia"
    ],
    "parents": [
      "muldo_dore",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97110-128.png"
  },
  {
    "id": "muldo_dore_indigo",
    "species": "muluaga",
    "generation": 2,
    "name": "Dorada e Índigo",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "10% Resistencia al agua"
    ],
    "parents": [
      "muldo_dore",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97108-128.png"
  },
  {
    "id": "muldo_ebene_indigo",
    "species": "muluaga",
    "generation": 2,
    "name": "Ébano e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "10% Resistencia al aire"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97109-128.png"
  },
  {
    "id": "muldo_roux",
    "species": "muluaga",
    "generation": 3,
    "name": "Roja",
    "bonuses": [
      "1 PM",
      "50 Placaje"
    ],
    "parents": [
      "muldo_dore_pourpre",
      "muldo_dore_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97095-128.png"
  },
  {
    "id": "muldo_amande",
    "species": "muluaga",
    "generation": 3,
    "name": "Almendrada",
    "bonuses": [
      "1 PM",
      "50 Huida"
    ],
    "parents": [
      "muldo_indigo_pourpre",
      "muldo_ebene_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97096-128.png"
  },
  {
    "id": "muldo_dore_amande",
    "species": "muluaga",
    "generation": 4,
    "name": "Dorada y Almendrada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "40 Huida"
    ],
    "parents": [
      "muldo_dore",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97121-128.png"
  },
  {
    "id": "muldo_amande_ebene",
    "species": "muluaga",
    "generation": 4,
    "name": "Ébano y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "10% Resistencia al aire"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97120-128.png"
  },
  {
    "id": "muldo_amande_indigo",
    "species": "muluaga",
    "generation": 4,
    "name": "Índigo y Almendrada",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "40 Huida"
    ],
    "parents": [
      "muldo_indigo",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97119-128.png"
  },
  {
    "id": "muldo_amande_orchidee",
    "species": "muluaga",
    "generation": 4,
    "name": "Orquídea y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "10% Resistencia al fuego"
    ],
    "parents": [
      "muldo_orchidee",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97118-128.png"
  },
  {
    "id": "muldo_amande_pourpre",
    "species": "muluaga",
    "generation": 4,
    "name": "Púrpura y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "10% Resistencia a la tierra"
    ],
    "parents": [
      "muldo_pourpre",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97117-128.png"
  },
  {
    "id": "muldo_roux_amande",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "40 Huida"
    ],
    "parents": [
      "muldo_roux",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97116-128.png"
  },
  {
    "id": "muldo_dore_roux",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "40 Placaje"
    ],
    "parents": [
      "muldo_roux",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97115-128.png"
  },
  {
    "id": "muldo_roux_ebene",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja y Ébano",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "10% Resistencia al aire"
    ],
    "parents": [
      "muldo_roux",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97114-128.png"
  },
  {
    "id": "muldo_roux_indigo",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "40 Placaje"
    ],
    "parents": [
      "muldo_roux",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97113-128.png"
  },
  {
    "id": "muldo_roux_orchidee",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja y Orquídea",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "10% Resistencia al fuego"
    ],
    "parents": [
      "muldo_roux",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97112-128.png"
  },
  {
    "id": "muldo_roux_pourpre",
    "species": "muluaga",
    "generation": 4,
    "name": "Roja y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "40 Placaje"
    ],
    "parents": [
      "muldo_roux",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97111-128.png"
  },
  {
    "id": "muldo_ivoire",
    "species": "muluaga",
    "generation": 5,
    "name": "Marfil",
    "bonuses": [
      "1 PM",
      "50 Esquiva de PA"
    ],
    "parents": [
      "muldo_dore_roux",
      "muldo_amande_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97097-128.png"
  },
  {
    "id": "muldo_turquoise",
    "species": "muluaga",
    "generation": 5,
    "name": "Turquesa",
    "bonuses": [
      "1 PM",
      "50 Esquiva de PM"
    ],
    "parents": [
      "muldo_dore_amande",
      "muldo_roux_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97098-128.png"
  },
  {
    "id": "muldo_ivoire_pourpre",
    "species": "muluaga",
    "generation": 6,
    "name": "Púrpura y Marfil",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_pourpre",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97122-128.png"
  },
  {
    "id": "muldo_ivoire_orchidee",
    "species": "muluaga",
    "generation": 6,
    "name": "Orquídea y Marfil",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_orchidee",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97123-128.png"
  },
  {
    "id": "muldo_ivoire_indigo",
    "species": "muluaga",
    "generation": 6,
    "name": "Índigo y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "10% Resistencia al agua"
    ],
    "parents": [
      "muldo_indigo",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97124-128.png"
  },
  {
    "id": "muldo_ivoire_ebene",
    "species": "muluaga",
    "generation": 6,
    "name": "Ébano y Marfil",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97125-128.png"
  },
  {
    "id": "muldo_dore_ivoire",
    "species": "muluaga",
    "generation": 6,
    "name": "Dorada y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "60 Potencia"
    ],
    "parents": [
      "muldo_dore",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97126-128.png"
  },
  {
    "id": "muldo_roux_ivoire",
    "species": "muluaga",
    "generation": 6,
    "name": "Roja y Marfil",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_roux",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97127-128.png"
  },
  {
    "id": "muldo_amande_ivoire",
    "species": "muluaga",
    "generation": 6,
    "name": "Almendrada y Marfil",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_amande",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97138-128.png"
  },
  {
    "id": "muldo_turquoise_ivoire",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "40 Esquiva de PA"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97139-128.png"
  },
  {
    "id": "muldo_turquoise_pourpre",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Púrpura",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "10% Resistencia a la tierra"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97140-128.png"
  },
  {
    "id": "muldo_turquoise_orchidee",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "40 Esquiva de PM"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97165-128.png"
  },
  {
    "id": "muldo_turquoise_indigo",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "40 Esquiva de PM"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97141-128.png"
  },
  {
    "id": "muldo_turquoise_ebene",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Ébano",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "10% Resistencia al aire"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97142-128.png"
  },
  {
    "id": "muldo_turquoise_roux",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Roja",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "40 Esquiva de PM"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97143-128.png"
  },
  {
    "id": "muldo_turquoise_amande",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "40 Huida"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97144-128.png"
  },
  {
    "id": "muldo_dore_turquoise",
    "species": "muluaga",
    "generation": 6,
    "name": "Turquesa y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "40 Esquiva de PM"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97145-128.png"
  },
  {
    "id": "muldo_prune",
    "species": "muluaga",
    "generation": 7,
    "name": "Ciruela",
    "bonuses": [
      "1 PM",
      "12% Crítico"
    ],
    "parents": [
      "muldo_ivoire_ebene",
      "muldo_turquoise_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97099-128.png"
  },
  {
    "id": "muldo_emeraude",
    "species": "muluaga",
    "generation": 7,
    "name": "Esmeralda",
    "bonuses": [
      "1 PM",
      "40 Daños críticos"
    ],
    "parents": [
      "muldo_turquoise_ivoire",
      "muldo_dore_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97100-128.png"
  },
  {
    "id": "muldo_prune_pourpre",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Púrpura",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "10% Resistencia a la tierra"
    ],
    "parents": [
      "muldo_prune",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97146-128.png"
  },
  {
    "id": "muldo_prune_orchidee",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "8% Crítico"
    ],
    "parents": [
      "muldo_prune",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97147-128.png"
  },
  {
    "id": "muldo_prune_indigo",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela e Índigo",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "10% Resistencia al agua"
    ],
    "parents": [
      "muldo_prune",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97148-128.png"
  },
  {
    "id": "muldo_prune_ebene",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Ébano",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "10% Resistencia al aire"
    ],
    "parents": [
      "muldo_prune",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97149-128.png"
  },
  {
    "id": "muldo_dore_prune",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "8% Crítico"
    ],
    "parents": [
      "muldo_prune",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97150-128.png"
  },
  {
    "id": "muldo_prune_roux",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Roja",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "40 Placaje"
    ],
    "parents": [
      "muldo_prune",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97151-128.png"
  },
  {
    "id": "muldo_prune_amande",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "8% Crítico"
    ],
    "parents": [
      "muldo_prune",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97152-128.png"
  },
  {
    "id": "muldo_prune_ivoire",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "8% Crítico"
    ],
    "parents": [
      "muldo_prune",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97153-128.png"
  },
  {
    "id": "muldo_prune_turquoise",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Turquesa",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "40 Esquiva de PM"
    ],
    "parents": [
      "muldo_prune",
      "muldo_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97154-128.png"
  },
  {
    "id": "muldo_prune_emeraude",
    "species": "muluaga",
    "generation": 8,
    "name": "Ciruela y Esmeralda",
    "bonuses": [
      "1 PM",
      "30 Daños críticos",
      "8% Crítico"
    ],
    "parents": [
      "muldo_prune",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97155-128.png"
  },
  {
    "id": "muldo_emeraude_pourpre",
    "species": "muluaga",
    "generation": 8,
    "name": "Púrpura y Esmeralda",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_pourpre",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97156-128.png"
  },
  {
    "id": "muldo_emeraude_orchidee",
    "species": "muluaga",
    "generation": 8,
    "name": "Orquídea y Esmeralda",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_orchidee",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97157-128.png"
  },
  {
    "id": "muldo_emeraude_indigo",
    "species": "muluaga",
    "generation": 8,
    "name": "Índigo y Esmeralda",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_indigo",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97158-128.png"
  },
  {
    "id": "muldo_emeraude_ebene",
    "species": "muluaga",
    "generation": 8,
    "name": "Ébano y Esmeralda",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_ebene",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97159-128.png"
  },
  {
    "id": "muldo_dore_emeraude",
    "species": "muluaga",
    "generation": 8,
    "name": "Dorada y Esmeralda",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_dore",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97160-128.png"
  },
  {
    "id": "muldo_emeraude_roux",
    "species": "muluaga",
    "generation": 8,
    "name": "Roja y Esmeralda",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_roux",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97161-128.png"
  },
  {
    "id": "muldo_emeraude_amande",
    "species": "muluaga",
    "generation": 8,
    "name": "Almendrada y Esmeralda",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_amande",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97162-128.png"
  },
  {
    "id": "muldo_emeraude_ivoire",
    "species": "muluaga",
    "generation": 8,
    "name": "Marfil y Esmeralda",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_ivoire",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97163-128.png"
  },
  {
    "id": "muldo_emeraude_turquoise",
    "species": "muluaga",
    "generation": 8,
    "name": "Turquesa y Esmeralda",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "30 Daños críticos"
    ],
    "parents": [
      "muldo_turquoise",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97164-128.png"
  },
  {
    "id": "muldo_ambre",
    "species": "muluaga",
    "generation": 9,
    "name": "Ámbar",
    "bonuses": [
      "1 PM",
      "40 Daños de tierra"
    ],
    "parents": [
      "muldo_emeraude_pourpre",
      "muldo_emeraude_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97297-128.png"
  },
  {
    "id": "muldo_corail",
    "species": "muluaga",
    "generation": 9,
    "name": "Coral",
    "bonuses": [
      "1 PM",
      "40 Daños de fuego"
    ],
    "parents": [
      "muldo_prune_pourpre",
      "muldo_prune_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97298-128.png"
  },
  {
    "id": "muldo_azur",
    "species": "muluaga",
    "generation": 9,
    "name": "Azur",
    "bonuses": [
      "1 PM",
      "40 Daños de agua"
    ],
    "parents": [
      "muldo_emeraude_pourpre",
      "muldo_prune_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97299-128.png"
  },
  {
    "id": "muldo_aiguemarine",
    "species": "muluaga",
    "generation": 9,
    "name": "Aguamarina",
    "bonuses": [
      "1 PM",
      "40 Daños de aire"
    ],
    "parents": [
      "muldo_prune_pourpre",
      "muldo_emeraude_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97300-128.png"
  },
  {
    "id": "muldo_ambre_dore",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97301-128.png"
  },
  {
    "id": "muldo_ambre_ebene",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Ébano",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97302-128.png"
  },
  {
    "id": "muldo_ambre_indigo",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97303-128.png"
  },
  {
    "id": "muldo_ambre_pourpre",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97304-128.png"
  },
  {
    "id": "muldo_ambre_orchidee",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97305-128.png"
  },
  {
    "id": "muldo_ambre_amande",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97306-128.png"
  },
  {
    "id": "muldo_ambre_roux",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Roja",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97307-128.png"
  },
  {
    "id": "muldo_ambre_ivoire",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97308-128.png"
  },
  {
    "id": "muldo_ambre_turquoise",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Turquesa",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97309-128.png"
  },
  {
    "id": "muldo_ambre_emeraude",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Esmeralda",
    "bonuses": [
      "1 PM",
      "30 Daños críticos",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97310-128.png"
  },
  {
    "id": "muldo_ambre_prune",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Ciruela",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "30 Daños de tierra"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97311-128.png"
  },
  {
    "id": "muldo_ambre_corail",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Coral",
    "bonuses": [
      "1 PM",
      "30 Daños de tierra",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_corail"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97312-128.png"
  },
  {
    "id": "muldo_ambre_azur",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Azur",
    "bonuses": [
      "1 PM",
      "30 Daños de tierra",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_azur"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97313-128.png"
  },
  {
    "id": "muldo_ambre_aiguemarine",
    "species": "muluaga",
    "generation": 10,
    "name": "Ámbar y Aguamarina",
    "bonuses": [
      "1 PM",
      "30 Daños de tierra",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_ambre",
      "muldo_aiguemarine"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97314-128.png"
  },
  {
    "id": "muldo_corail_dore",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97315-128.png"
  },
  {
    "id": "muldo_corail_ebene",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Ébano",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97316-128.png"
  },
  {
    "id": "muldo_corail_indigo",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97317-128.png"
  },
  {
    "id": "muldo_corail_pourpre",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97318-128.png"
  },
  {
    "id": "muldo_corail_orchidee",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97319-128.png"
  },
  {
    "id": "muldo_corail_amande",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97320-128.png"
  },
  {
    "id": "muldo_corail_roux",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Roja",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97321-128.png"
  },
  {
    "id": "muldo_corail_ivoire",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97322-128.png"
  },
  {
    "id": "muldo_corail_turquoise",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Turquesa",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97323-128.png"
  },
  {
    "id": "muldo_corail_emeraude",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Esmeralda",
    "bonuses": [
      "1 PM",
      "30 Daños críticos",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97324-128.png"
  },
  {
    "id": "muldo_corail_prune",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Ciruela",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "30 Daños de fuego"
    ],
    "parents": [
      "muldo_corail",
      "muldo_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97325-128.png"
  },
  {
    "id": "muldo_corail_azur",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Azur",
    "bonuses": [
      "1 PM",
      "30 Daños de fuego",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_corail",
      "muldo_azur"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97326-128.png"
  },
  {
    "id": "muldo_corail_aiguemarine",
    "species": "muluaga",
    "generation": 10,
    "name": "Coral y Aguamarina",
    "bonuses": [
      "1 PM",
      "30 Daños de fuego",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_corail",
      "muldo_aiguemarine"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97327-128.png"
  },
  {
    "id": "muldo_azur_dore",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97328-128.png"
  },
  {
    "id": "muldo_azur_ebene",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Ébano",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97329-128.png"
  },
  {
    "id": "muldo_azur_indigo",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97330-128.png"
  },
  {
    "id": "muldo_azur_pourpre",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97331-128.png"
  },
  {
    "id": "muldo_azur_orchidee",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97332-128.png"
  },
  {
    "id": "muldo_azur_amande",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97333-128.png"
  },
  {
    "id": "muldo_azur_roux",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Roja",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97334-128.png"
  },
  {
    "id": "muldo_azur_ivoire",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97335-128.png"
  },
  {
    "id": "muldo_azur_turquoise",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Turquesa",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97336-128.png"
  },
  {
    "id": "muldo_azur_emeraude",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Esmeralda",
    "bonuses": [
      "1 PM",
      "30 Daños críticos",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97337-128.png"
  },
  {
    "id": "muldo_azur_prune",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Ciruela",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "30 Daños de agua"
    ],
    "parents": [
      "muldo_azur",
      "muldo_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97338-128.png"
  },
  {
    "id": "muldo_azur_aiguemarine",
    "species": "muluaga",
    "generation": 10,
    "name": "Azur y Aguamarina",
    "bonuses": [
      "1 PM",
      "30 Daños de agua",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_azur",
      "muldo_aiguemarine"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97339-128.png"
  },
  {
    "id": "muldo_aiguemarine_dore",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Dorada",
    "bonuses": [
      "1 PM",
      "60 Potencia",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97340-128.png"
  },
  {
    "id": "muldo_aiguemarine_ebene",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Ébano",
    "bonuses": [
      "1 PM",
      "10% Resistencia al aire",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97341-128.png"
  },
  {
    "id": "muldo_aiguemarine_indigo",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina e Índigo",
    "bonuses": [
      "1 PM",
      "10% Resistencia al agua",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97342-128.png"
  },
  {
    "id": "muldo_aiguemarine_pourpre",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Púrpura",
    "bonuses": [
      "1 PM",
      "10% Resistencia a la tierra",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97343-128.png"
  },
  {
    "id": "muldo_aiguemarine_orchidee",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Orquídea",
    "bonuses": [
      "1 PM",
      "10% Resistencia al fuego",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97344-128.png"
  },
  {
    "id": "muldo_aiguemarine_amande",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Almendrada",
    "bonuses": [
      "1 PM",
      "40 Huida",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97345-128.png"
  },
  {
    "id": "muldo_aiguemarine_roux",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Roja",
    "bonuses": [
      "1 PM",
      "40 Placaje",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97346-128.png"
  },
  {
    "id": "muldo_aiguemarine_ivoire",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Marfil",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PA",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97347-128.png"
  },
  {
    "id": "muldo_aiguemarine_turquoise",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Turquesa",
    "bonuses": [
      "1 PM",
      "40 Esquiva de PM",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97348-128.png"
  },
  {
    "id": "muldo_aiguemarine_emeraude",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Esmeralda",
    "bonuses": [
      "1 PM",
      "30 Daños críticos",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97349-128.png"
  },
  {
    "id": "muldo_aiguemarine_prune",
    "species": "muluaga",
    "generation": 10,
    "name": "Aguamarina y Ciruela",
    "bonuses": [
      "1 PM",
      "8% Crítico",
      "30 Daños de aire"
    ],
    "parents": [
      "muldo_aiguemarine",
      "muldo_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97350-128.png"
  }
];
