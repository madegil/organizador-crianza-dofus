import type { MountDefinition } from '../types/mount';

// Generaciones y cruces: dofuspourlesnoobs.com. Nombres, bonos (nivel 100) e imágenes: api.dofusdu.de (es).
export const VOLKORNES_DATA: MountDefinition[] = [
  {
    "id": "volkorne_ebene",
    "species": "vueloceronte",
    "generation": 1,
    "name": "Ébano",
    "bonuses": [
      "1 PA",
      "90 Agilidad"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97177-128.png"
  },
  {
    "id": "volkorne_indigo",
    "species": "vueloceronte",
    "generation": 1,
    "name": "Índigo",
    "bonuses": [
      "1 PA",
      "90 Suerte"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97176-128.png"
  },
  {
    "id": "volkorne_pourpre",
    "species": "vueloceronte",
    "generation": 1,
    "name": "Púrpura",
    "bonuses": [
      "1 PA",
      "90 Fuerza"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97178-128.png"
  },
  {
    "id": "volkorne_orchidee",
    "species": "vueloceronte",
    "generation": 1,
    "name": "Orquídeo",
    "bonuses": [
      "1 PA",
      "90 Inteligencia"
    ],
    "parents": null,
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97179-128.png"
  },
  {
    "id": "volkorne_pourpre_orchidee",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Púrpura y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_pourpre",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97191-128.png"
  },
  {
    "id": "volkorne_indigo_pourpre",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Púrpura e Índigo",
    "bonuses": [
      "1 PA",
      "70 Fuerza",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_pourpre",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97192-128.png"
  },
  {
    "id": "volkorne_ebene_pourpre",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Púrpura y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_pourpre",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97193-128.png"
  },
  {
    "id": "volkorne_indigo_orchidee",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Orquídeo e Índigo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_orchidee",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97194-128.png"
  },
  {
    "id": "volkorne_ebene_orchidee",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Orquídeo y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_orchidee",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97195-128.png"
  },
  {
    "id": "volkorne_ebene_indigo",
    "species": "vueloceronte",
    "generation": 2,
    "name": "Índigo y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_indigo",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97196-128.png"
  },
  {
    "id": "volkorne_roux",
    "species": "vueloceronte",
    "generation": 3,
    "name": "Pelirrojo",
    "bonuses": [
      "1 PA",
      "70 Daños de empuje"
    ],
    "parents": [
      "volkorne_pourpre_orchidee",
      "volkorne_indigo_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97180-128.png"
  },
  {
    "id": "volkorne_amande",
    "species": "vueloceronte",
    "generation": 3,
    "name": "Almendrado",
    "bonuses": [
      "1 PA",
      "90 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_ebene_pourpre",
      "volkorne_ebene_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97181-128.png"
  },
  {
    "id": "volkorne_ivoire",
    "species": "vueloceronte",
    "generation": 3,
    "name": "Marfil",
    "bonuses": [
      "1 PA",
      "40 Retiro de PA"
    ],
    "parents": [
      "volkorne_indigo_pourpre",
      "volkorne_ebene_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97182-128.png"
  },
  {
    "id": "volkorne_turquoise",
    "species": "vueloceronte",
    "generation": 3,
    "name": "Turquesa",
    "bonuses": [
      "1 PA",
      "40 Retiro de PM"
    ],
    "parents": [
      "volkorne_pourpre_orchidee",
      "volkorne_ebene_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97183-128.png"
  },
  {
    "id": "volkorne_amande_pourpre",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Púrpura",
    "bonuses": [
      "1 PA",
      "70 Fuerza",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97197-128.png"
  },
  {
    "id": "volkorne_amande_orchidee",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97198-128.png"
  },
  {
    "id": "volkorne_amande_indigo",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado e Índigo",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97199-128.png"
  },
  {
    "id": "volkorne_amande_ebene",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Ébano",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97200-128.png"
  },
  {
    "id": "volkorne_amande_roux",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Pelirrojo",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "50 Daños de empuje"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97201-128.png"
  },
  {
    "id": "volkorne_amande_ivoire",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Marfil",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97202-128.png"
  },
  {
    "id": "volkorne_amande_turquoise",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Almendrado y Turquesa",
    "bonuses": [
      "1 PA",
      "30 Retiro de PM",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_amande",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97203-128.png"
  },
  {
    "id": "volkorne_roux_pourpre",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo y Púrpura",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97204-128.png"
  },
  {
    "id": "volkorne_roux_orchidee",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo y Orquídeo",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97205-128.png"
  },
  {
    "id": "volkorne_roux_indigo",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo e Índigo",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97206-128.png"
  },
  {
    "id": "volkorne_roux_ebene",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo y Ébano",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97207-128.png"
  },
  {
    "id": "volkorne_roux_ivoire",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo y Marfil",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97208-128.png"
  },
  {
    "id": "volkorne_roux_turquoise",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Pelirrojo y Turquesa",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_roux",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97209-128.png"
  },
  {
    "id": "volkorne_ivoire_pourpre",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Marfil y Púrpura",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_ivoire",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97210-128.png"
  },
  {
    "id": "volkorne_ivoire_orchidee",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Marfil y Orquídeo",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_ivoire",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97211-128.png"
  },
  {
    "id": "volkorne_ivoire_indigo",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Marfil e Índigo",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_ivoire",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97212-128.png"
  },
  {
    "id": "volkorne_ivoire_ebene",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Marfil y Ébano",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_ivoire",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97213-128.png"
  },
  {
    "id": "volkorne_ivoire_turquoise",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Marfil y Turquesa",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_ivoire",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97214-128.png"
  },
  {
    "id": "volkorne_turquoise_pourpre",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Turquesa y Púrpura",
    "bonuses": [
      "1 PA",
      "70 Fuerza",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_turquoise",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97215-128.png"
  },
  {
    "id": "volkorne_turquoise_orchidee",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Turquesa y Orquídeo",
    "bonuses": [
      "1 PA",
      "30 Retiro de PM",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_turquoise",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97216-128.png"
  },
  {
    "id": "volkorne_turquoise_indigo",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Turquesa e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_turquoise",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97217-128.png"
  },
  {
    "id": "volkorne_turquoise_ebene",
    "species": "vueloceronte",
    "generation": 4,
    "name": "Turquesa y Ébano",
    "bonuses": [
      "1 PA",
      "30 Retiro de PM",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_turquoise",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97218-128.png"
  },
  {
    "id": "volkorne_prune",
    "species": "vueloceronte",
    "generation": 5,
    "name": "Ciruela",
    "bonuses": [
      "1 PA",
      "60 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_amande_roux",
      "volkorne_amande_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97184-128.png"
  },
  {
    "id": "volkorne_emeraude",
    "species": "vueloceronte",
    "generation": 5,
    "name": "Esmeralda",
    "bonuses": [
      "1 PA",
      "9% Crítico"
    ],
    "parents": [
      "volkorne_ivoire_turquoise",
      "volkorne_ivoire_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97185-128.png"
  },
  {
    "id": "volkorne_prune_pourpre",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Púrpura",
    "bonuses": [
      "1 PA",
      "70 Fuerza",
      "45 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97219-128.png"
  },
  {
    "id": "volkorne_prune_orchidee",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Orquídeo",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97220-128.png"
  },
  {
    "id": "volkorne_prune_indigo",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "45 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97221-128.png"
  },
  {
    "id": "volkorne_prune_ebene",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Ébano",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97222-128.png"
  },
  {
    "id": "volkorne_prune_amande",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Almendrado",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "45 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97223-128.png"
  },
  {
    "id": "volkorne_prune_roux",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Pelirrojo",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "50 Daños de empuje"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97287-128.png"
  },
  {
    "id": "volkorne_prune_ivoire",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Marfil",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97288-128.png"
  },
  {
    "id": "volkorne_prune_turquoise",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Turquesa",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97224-128.png"
  },
  {
    "id": "volkorne_prune_emeraude",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Ciruela y Esmeralda",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "45 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_prune",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97225-128.png"
  },
  {
    "id": "volkorne_emeraude_pourpre",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Púrpura",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97226-128.png"
  },
  {
    "id": "volkorne_emeraude_orchidee",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Orquídeo",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97227-128.png"
  },
  {
    "id": "volkorne_emeraude_indigo",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97228-128.png"
  },
  {
    "id": "volkorne_emeraude_ebene",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97229-128.png"
  },
  {
    "id": "volkorne_emeraude_amande",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Almendrado",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97230-128.png"
  },
  {
    "id": "volkorne_emeraude_roux",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Pelirrojo",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "50 Daños de empuje"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97231-128.png"
  },
  {
    "id": "volkorne_emeraude_ivoire",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Marfil",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97233-128.png"
  },
  {
    "id": "volkorne_emeraude_turquoise",
    "species": "vueloceronte",
    "generation": 6,
    "name": "Esmeralda y Turquesa",
    "bonuses": [
      "1 PA",
      "30 Retiro de PM",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_emeraude",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97234-128.png"
  },
  {
    "id": "volkorne_dore",
    "species": "vueloceronte",
    "generation": 7,
    "name": "Dorado",
    "bonuses": [
      "1 PA",
      "250 Vitalidad"
    ],
    "parents": [
      "volkorne_prune_pourpre",
      "volkorne_emeraude_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97186-128.png"
  },
  {
    "id": "volkorne_dore_pourpre",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Púrpura",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97235-128.png"
  },
  {
    "id": "volkorne_dore_orchidee",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97236-128.png"
  },
  {
    "id": "volkorne_dore_indigo",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado e Índigo",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "70 Suerte"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97237-128.png"
  },
  {
    "id": "volkorne_dore_ebene",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97238-128.png"
  },
  {
    "id": "volkorne_dore_roux",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Pelirrojo",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97291-128.png"
  },
  {
    "id": "volkorne_dore_amande",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Almendrado",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97292-128.png"
  },
  {
    "id": "volkorne_dore_ivoire",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Marfil",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97293-128.png"
  },
  {
    "id": "volkorne_dore_turquoise",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Turquesa",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97294-128.png"
  },
  {
    "id": "volkorne_dore_prune",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Ciruela",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97295-128.png"
  },
  {
    "id": "volkorne_dore_emeraude",
    "species": "vueloceronte",
    "generation": 8,
    "name": "Dorado y Esmeralda",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "7% Crítico"
    ],
    "parents": [
      "volkorne_dore",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97296-128.png"
  },
  {
    "id": "volkorne_jade",
    "species": "vueloceronte",
    "generation": 9,
    "name": "Jade",
    "bonuses": [
      "1 PA",
      "14% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_dore_pourpre",
      "volkorne_prune_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97187-128.png"
  },
  {
    "id": "volkorne_rubis",
    "species": "vueloceronte",
    "generation": 9,
    "name": "Rubí",
    "bonuses": [
      "1 PA",
      "14% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_dore_orchidee",
      "volkorne_prune_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97188-128.png"
  },
  {
    "id": "volkorne_saphir",
    "species": "vueloceronte",
    "generation": 9,
    "name": "Zafiro",
    "bonuses": [
      "1 PA",
      "14% Resistencia al agua"
    ],
    "parents": [
      "volkorne_dore_indigo",
      "volkorne_prune_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97189-128.png"
  },
  {
    "id": "volkorne_amethyste",
    "species": "vueloceronte",
    "generation": 9,
    "name": "Amatista",
    "bonuses": [
      "1 PA",
      "14% Resistencia al aire"
    ],
    "parents": [
      "volkorne_dore_ebene",
      "volkorne_prune_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97190-128.png"
  },
  {
    "id": "volkorne_jade_pourpre",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Púrpura",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97239-128.png"
  },
  {
    "id": "volkorne_jade_orchidee",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97240-128.png"
  },
  {
    "id": "volkorne_jade_indigo",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97241-128.png"
  },
  {
    "id": "volkorne_jade_ebene",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Ébano",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97242-128.png"
  },
  {
    "id": "volkorne_jade_amande",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Almendrado",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97243-128.png"
  },
  {
    "id": "volkorne_jade_roux",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Pelirrojo",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "50 Daños de empuje"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97244-128.png"
  },
  {
    "id": "volkorne_jade_ivoire",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Marfil",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97245-128.png"
  },
  {
    "id": "volkorne_jade_turquoise",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Turquesa",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97246-128.png"
  },
  {
    "id": "volkorne_jade_prune",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Ciruela",
    "bonuses": [
      "1 PA",
      "8% Resistencia a la tierra",
      "45 Resistencia a los críticos"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97247-128.png"
  },
  {
    "id": "volkorne_jade_emeraude",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Esmeralda",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97248-128.png"
  },
  {
    "id": "volkorne_jade_dore",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Dorado",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97249-128.png"
  },
  {
    "id": "volkorne_jade_rubis",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Rubí",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_rubis"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97250-128.png"
  },
  {
    "id": "volkorne_jade_saphir",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Zafiro",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_saphir"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97251-128.png"
  },
  {
    "id": "volkorne_jade_amethyste",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Jade y Amatista",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "8% Resistencia a la tierra"
    ],
    "parents": [
      "volkorne_jade",
      "volkorne_amethyste"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97252-128.png"
  },
  {
    "id": "volkorne_rubis_pourpre",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Púrpura",
    "bonuses": [
      "1 PA",
      "70 Fuerza",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97253-128.png"
  },
  {
    "id": "volkorne_rubis_orchidee",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Orquídeo",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "70 Inteligencia"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97254-128.png"
  },
  {
    "id": "volkorne_rubis_indigo",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97255-128.png"
  },
  {
    "id": "volkorne_rubis_ebene",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97256-128.png"
  },
  {
    "id": "volkorne_rubis_amande",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Almendrado",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97257-128.png"
  },
  {
    "id": "volkorne_rubis_roux",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Pelirrojo",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97258-128.png"
  },
  {
    "id": "volkorne_rubis_ivoire",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Marfil",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97259-128.png"
  },
  {
    "id": "volkorne_rubis_turquoise",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Turquesa",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97260-128.png"
  },
  {
    "id": "volkorne_rubis_prune",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Ciruela",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97261-128.png"
  },
  {
    "id": "volkorne_rubis_emeraude",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Esmeralda",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97262-128.png"
  },
  {
    "id": "volkorne_rubis_dore",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Dorado",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97263-128.png"
  },
  {
    "id": "volkorne_rubis_saphir",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Zafiro",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "8% Resistencia al fuego"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_saphir"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97289-128.png"
  },
  {
    "id": "volkorne_rubis_amethyste",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Rubí y Amatista",
    "bonuses": [
      "1 PA",
      "8% Resistencia al fuego",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_rubis",
      "volkorne_amethyste"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97290-128.png"
  },
  {
    "id": "volkorne_saphir_pourpre",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Púrpura",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97264-128.png"
  },
  {
    "id": "volkorne_saphir_orchidee",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97265-128.png"
  },
  {
    "id": "volkorne_saphir_indigo",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97266-128.png"
  },
  {
    "id": "volkorne_saphir_ebene",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Ébano",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "70 Agilidad"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97267-128.png"
  },
  {
    "id": "volkorne_saphir_amande",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Almendrado",
    "bonuses": [
      "1 PA",
      "70 Resistencia al empuje",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97268-128.png"
  },
  {
    "id": "volkorne_saphir_roux",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Pelirrojo",
    "bonuses": [
      "1 PA",
      "50 Daños de empuje",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97269-128.png"
  },
  {
    "id": "volkorne_saphir_ivoire",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Marfil",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "30 Retiro de PA"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97270-128.png"
  },
  {
    "id": "volkorne_saphir_turquoise",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Turquesa",
    "bonuses": [
      "1 PA",
      "8% Resistencia al agua",
      "30 Retiro de PM"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97271-128.png"
  },
  {
    "id": "volkorne_saphir_prune",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Ciruela",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97272-128.png"
  },
  {
    "id": "volkorne_saphir_emeraude",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Esmeralda",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97273-128.png"
  },
  {
    "id": "volkorne_saphir_dore",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Dorado",
    "bonuses": [
      "1 PA",
      "200 Vitalidad",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97274-128.png"
  },
  {
    "id": "volkorne_saphir_amethyste",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Zafiro y Amatista",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "8% Resistencia al agua"
    ],
    "parents": [
      "volkorne_saphir",
      "volkorne_amethyste"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97275-128.png"
  },
  {
    "id": "volkorne_amethyste_pourpre",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Púrpura",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "70 Fuerza"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_pourpre"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97276-128.png"
  },
  {
    "id": "volkorne_amethyste_orchidee",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Orquídeo",
    "bonuses": [
      "1 PA",
      "70 Inteligencia",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_orchidee"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97277-128.png"
  },
  {
    "id": "volkorne_amethyste_indigo",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista e Índigo",
    "bonuses": [
      "1 PA",
      "70 Suerte",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_indigo"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97278-128.png"
  },
  {
    "id": "volkorne_amethyste_ebene",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Ébano",
    "bonuses": [
      "1 PA",
      "70 Agilidad",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_ebene"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97279-128.png"
  },
  {
    "id": "volkorne_amethyste_amande",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Almendrado",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "70 Resistencia al empuje"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_amande"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97280-128.png"
  },
  {
    "id": "volkorne_amethyste_roux",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Pelirrojo",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "50 Daños de empuje"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_roux"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97281-128.png"
  },
  {
    "id": "volkorne_amethyste_ivoire",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Marfil",
    "bonuses": [
      "1 PA",
      "30 Retiro de PA",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_ivoire"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97282-128.png"
  },
  {
    "id": "volkorne_amethyste_turquoise",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Turquesa",
    "bonuses": [
      "1 PA",
      "30 Retiro de PM",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_turquoise"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97283-128.png"
  },
  {
    "id": "volkorne_amethyste_prune",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Ciruela",
    "bonuses": [
      "1 PA",
      "45 Resistencia a los críticos",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_prune"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97284-128.png"
  },
  {
    "id": "volkorne_amethyste_emeraude",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Esmeralda",
    "bonuses": [
      "1 PA",
      "7% Crítico",
      "8% Resistencia al aire"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_emeraude"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97285-128.png"
  },
  {
    "id": "volkorne_amethyste_dore",
    "species": "vueloceronte",
    "generation": 10,
    "name": "Amatista y Dorado",
    "bonuses": [
      "1 PA",
      "8% Resistencia al aire",
      "200 Vitalidad"
    ],
    "parents": [
      "volkorne_amethyste",
      "volkorne_dore"
    ],
    "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/item/97286-128.png"
  }
];
