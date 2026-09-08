import type { MountDefinition } from '../types/mount';

export const DRAGODINDES_DATA: MountDefinition[] = [
    {
      "id": "dd_amande",
      "species": "dragopavo",
      "generation": 1,
      "name": "Almendrada",
      "bonuses": [
        "400 Vitalidad",
        "1700 Iniciativa"
      ],
      "parents": null,
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33001-64.png"
    },
    {
      "id": "dd_doree",
      "species": "dragopavo",
      "generation": 1,
      "name": "Dorada",
      "bonuses": [
        "400 Vitalidad",
        "2 Invocaciones"
      ],
      "parents": null,
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33011-64.png"
    },
    {
      "id": "dd_rousse",
      "species": "dragopavo",
      "generation": 1,
      "name": "Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "60 Curas"
      ],
      "parents": null,
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33063-64.png"
    },
    {
      "id": "dd_amande_rousse",
      "species": "dragopavo",
      "generation": 2,
      "name": "Almendrada y Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "60 Curas",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33009-64.png"
    },
    {
      "id": "dd_doree_rousse",
      "species": "dragopavo",
      "generation": 2,
      "name": "Dorada y Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "1 Invocation",
        "45 Curas"
      ],
      "parents": [
        "dd_doree",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33018-64.png"
    },
    {
      "id": "dd_amande_doree",
      "species": "dragopavo",
      "generation": 2,
      "name": "Almendrada y Dorada",
      "bonuses": [
        "400 Vitalidad",
        "1 Invocation",
        "1000 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_doree"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33002-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33020-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33036-64.png"
    },
    {
      "id": "dd_amande_ebene",
      "species": "dragopavo",
      "generation": 4,
      "name": "Almendrada y Ébano",
      "bonuses": [
        "400 Vitalidad",
        "120 Agilidad",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_ebene"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33003-64.png"
    },
    {
      "id": "dd_amande_indigo",
      "species": "dragopavo",
      "generation": 4,
      "name": "Almendrada e Índigo",
      "bonuses": [
        "400 Vitalidad",
        "120 Suerte",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_indigo"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33005-64.png"
    },
    {
      "id": "dd_doree_ebene",
      "species": "dragopavo",
      "generation": 4,
      "name": "Dorada y Ébano",
      "bonuses": [
        "400 Vitalidad",
        "90 Agilidad",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_ebene"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33012-64.png"
    },
    {
      "id": "dd_doree_indigo",
      "species": "dragopavo",
      "generation": 4,
      "name": "Dorada e Índigo",
      "bonuses": [
        "400 Vitalidad",
        "90 Suerte",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_indigo"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33014-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33022-64.png"
    },
    {
      "id": "dd_rousse_ebene",
      "species": "dragopavo",
      "generation": 4,
      "name": "Pelirroja y Ébano",
      "bonuses": [
        "400 Vitalidad",
        "90 Agilidad",
        "45 Curas"
      ],
      "parents": [
        "dd_rousse",
        "dd_ebene"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33026-64.png"
    },
    {
      "id": "dd_rousse_indigo",
      "species": "dragopavo",
      "generation": 4,
      "name": "Pelirroja e Índigo",
      "bonuses": [
        "400 Vitalidad",
        "90 Suerte",
        "45 Curas"
      ],
      "parents": [
        "dd_rousse",
        "dd_indigo"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33040-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33050-64.png"
    },
    {
      "id": "dd_orchidee",
      "species": "dragopavo",
      "generation": 5,
      "name": "Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "120 Inteligencia"
      ],
      "parents": [
        "dd_ebene_indigo",
        "dd_doree_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33047-64.png"
    },
    {
      "id": "dd_amande_pourpre",
      "species": "dragopavo",
      "generation": 6,
      "name": "Almendrada y Púrpura",
      "bonuses": [
        "400 Vitalidad",
        "90 Fuerza",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_pourpre"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33008-64.png"
    },
    {
      "id": "dd_amande_orchidee",
      "species": "dragopavo",
      "generation": 6,
      "name": "Almendrada y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33007-64.png"
    },
    {
      "id": "dd_doree_pourpre",
      "species": "dragopavo",
      "generation": 6,
      "name": "Dorada y Púrpura",
      "bonuses": [
        "400 Vitalidad",
        "90 Fuerza",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_pourpre"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33017-64.png"
    },
    {
      "id": "dd_doree_orchidee",
      "species": "dragopavo",
      "generation": 6,
      "name": "Dorada y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33016-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33025-64.png"
    },
    {
      "id": "dd_ebene_orchidee",
      "species": "dragopavo",
      "generation": 6,
      "name": "Ébano y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Agilidad",
        "90 Inteligencia"
      ],
      "parents": [
        "dd_ebene",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33024-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33039-64.png"
    },
    {
      "id": "dd_indigo_orchidee",
      "species": "dragopavo",
      "generation": 6,
      "name": "Índigo y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Suerte",
        "90 Inteligencia"
      ],
      "parents": [
        "dd_indigo",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33038-64.png"
    },
    {
      "id": "dd_orchidee_pourpre",
      "species": "dragopavo",
      "generation": 6,
      "name": "Orquídea y Púrpura",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "90 Fuerza"
      ],
      "parents": [
        "dd_orchidee",
        "dd_pourpre"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33048-64.png"
    },
    {
      "id": "dd_pourpre_rousse",
      "species": "dragopavo",
      "generation": 6,
      "name": "Pelirroja y Púrpura",
      "bonuses": [
        "400 Vitalidad",
        "90 Fuerza",
        "45 Curas"
      ],
      "parents": [
        "dd_rousse",
        "dd_pourpre"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33051-64.png"
    },
    {
      "id": "dd_orchidee_rousse",
      "species": "dragopavo",
      "generation": 6,
      "name": "Pelirroja y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "45 Curas"
      ],
      "parents": [
        "dd_rousse",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33049-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33042-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33065-64.png"
    },
    {
      "id": "dd_amande_ivoire",
      "species": "dragopavo",
      "generation": 8,
      "name": "Almendrada y Marfil",
      "bonuses": [
        "400 Vitalidad",
        "70 Potencia",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_ivoire"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33006-64.png"
    },
    {
      "id": "dd_amande_turquoise",
      "species": "dragopavo",
      "generation": 8,
      "name": "Almendrada y Turquesa",
      "bonuses": [
        "400 Vitalidad",
        "70 Prospección",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_turquoise"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33010-64.png"
    },
    {
      "id": "dd_doree_ivoire",
      "species": "dragopavo",
      "generation": 8,
      "name": "Dorada y Marfil",
      "bonuses": [
        "400 Vitalidad",
        "70 Potencia",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_ivoire"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33015-64.png"
    },
    {
      "id": "dd_doree_turquoise",
      "species": "dragopavo",
      "generation": 8,
      "name": "Dorada y Turquesa",
      "bonuses": [
        "400 Vitalidad",
        "70 Prospección",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_turquoise"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33019-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33023-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33027-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33037-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33041-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33044-64.png"
    },
    {
      "id": "dd_ivoire_orchidee",
      "species": "dragopavo",
      "generation": 8,
      "name": "Marfil y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "70 Potencia"
      ],
      "parents": [
        "dd_ivoire",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33043-64.png"
    },
    {
      "id": "dd_ivoire_rousse",
      "species": "dragopavo",
      "generation": 8,
      "name": "Marfil y Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "70 Potencia",
        "45 Curas"
      ],
      "parents": [
        "dd_ivoire",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33045-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33046-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33067-64.png"
    },
    {
      "id": "dd_orchidee_turquoise",
      "species": "dragopavo",
      "generation": 8,
      "name": "Orquídea y Turquesa",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "70 Prospección"
      ],
      "parents": [
        "dd_orchidee",
        "dd_turquoise"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33066-64.png"
    },
    {
      "id": "dd_turquoise_rousse",
      "species": "dragopavo",
      "generation": 8,
      "name": "Pelirroja y Turquesa",
      "bonuses": [
        "400 Vitalidad",
        "70 Prospección",
        "45 Curas"
      ],
      "parents": [
        "dd_turquoise",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33068-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33028-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33052-64.png"
    },
    {
      "id": "dd_amande_emeraude",
      "species": "dragopavo",
      "generation": 10,
      "name": "Almendrada y Esmeralda",
      "bonuses": [
        "400 Vitalidad",
        "1 PM",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_emeraude"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33004-64.png"
    },
    {
      "id": "dd_amande_prune",
      "species": "dragopavo",
      "generation": 10,
      "name": "Almendrada y Ciruela",
      "bonuses": [
        "400 Vitalidad",
        "1 Alcance",
        "1200 Iniciativa"
      ],
      "parents": [
        "dd_amande",
        "dd_prune"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33053-64.png"
    },
    {
      "id": "dd_doree_emeraude",
      "species": "dragopavo",
      "generation": 10,
      "name": "Dorada y Esmeralda",
      "bonuses": [
        "400 Vitalidad",
        "1 PM",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_emeraude"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33013-64.png"
    },
    {
      "id": "dd_doree_prune",
      "species": "dragopavo",
      "generation": 10,
      "name": "Dorada y Ciruela",
      "bonuses": [
        "400 Vitalidad",
        "1 Alcance",
        "1 Invocation"
      ],
      "parents": [
        "dd_doree",
        "dd_prune"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33054-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33021-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33055-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33032-64.png"
    },
    {
      "id": "dd_emeraude_orchidee",
      "species": "dragopavo",
      "generation": 10,
      "name": "Esmeralda y Orquídea",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "1 PM"
      ],
      "parents": [
        "dd_emeraude",
        "dd_orchidee"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33031-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33029-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33030-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33034-64.png"
    },
    {
      "id": "dd_emeraude_rousse",
      "species": "dragopavo",
      "generation": 10,
      "name": "Esmeralda y Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "1 PM",
        "45 Curas"
      ],
      "parents": [
        "dd_emeraude",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33033-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33057-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33058-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33060-64.png"
    },
    {
      "id": "dd_orchidee_prune",
      "species": "dragopavo",
      "generation": 10,
      "name": "Orquídea y Ciruela",
      "bonuses": [
        "400 Vitalidad",
        "90 Inteligencia",
        "1 Alcance"
      ],
      "parents": [
        "dd_orchidee",
        "dd_prune"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33059-64.png"
    },
    {
      "id": "dd_prune_rousse",
      "species": "dragopavo",
      "generation": 10,
      "name": "Ciruela y Pelirroja",
      "bonuses": [
        "400 Vitalidad",
        "1 Alcance",
        "45 Curas"
      ],
      "parents": [
        "dd_prune",
        "dd_rousse"
      ],
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33061-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33062-64.png"
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
      "imageUrl": "https://api.dofusdu.de/dofus3/v1/img/mount/33056-64.png"
    }
  ];
