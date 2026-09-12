// Tabla oficial de experiencia acumulada para monturas en Dofus 3.5 (Niveles 1 a 200)
// Fuente: Ankama Games / Dofus 3.5 Beta

export const MAX_MOUNT_XP = 867582;

/**
 * Array indexado donde index 0 = Nivel 1 (0 XP), index 1 = Nivel 2 (19 XP), ..., index 199 = Nivel 200 (867582 XP).
 */
export const MOUNT_LEVEL_XP_THRESHOLDS: number[] = [
  0, // Nivel 1
  19, // Nivel 2
  49, // Nivel 3
  96, // Nivel 4
  161, // Nivel 5
  246, // Nivel 6
  353, // Nivel 7
  481, // Nivel 8
  633, // Nivel 9
  809, // Nivel 10
  1011, // Nivel 11
  1238, // Nivel 12
  1491, // Nivel 13
  1772, // Nivel 14
  2081, // Nivel 15
  2419, // Nivel 16
  2786, // Nivel 17
  3182, // Nivel 18
  3609, // Nivel 19
  4067, // Nivel 20
  4557, // Nivel 21
  5078, // Nivel 22
  5632, // Nivel 23
  6219, // Nivel 24
  6839, // Nivel 25
  7493, // Nivel 26
  8182, // Nivel 27
  8905, // Nivel 28
  9664, // Nivel 29
  10457, // Nivel 30
  11287, // Nivel 31
  12154, // Nivel 32
  13057, // Nivel 33
  13997, // Nivel 34
  14974, // Nivel 35
  15990, // Nivel 36
  17043, // Nivel 37
  18135, // Nivel 38
  19266, // Nivel 39
  20437, // Nivel 40
  21646, // Nivel 41
  22896, // Nivel 42
  24186, // Nivel 43
  25516, // Nivel 44
  26887, // Nivel 45
  28299, // Nivel 46
  29753, // Nivel 47
  31248, // Nivel 48
  32785, // Nivel 49
  34365, // Nivel 50
  35987, // Nivel 51
  37652, // Nivel 52
  39360, // Nivel 53
  41111, // Nivel 54
  42906, // Nivel 55
  44745, // Nivel 56
  46628, // Nivel 57
  48555, // Nivel 58
  50527, // Nivel 59
  52544, // Nivel 60
  54607, // Nivel 61
  56714, // Nivel 62
  58868, // Nivel 63
  61067, // Nivel 64
  63312, // Nivel 65
  65604, // Nivel 66
  67942, // Nivel 67
  70327, // Nivel 68
  72760, // Nivel 69
  75239, // Nivel 70
  77766, // Nivel 71
  80341, // Nivel 72
  82964, // Nivel 73
  85635, // Nivel 74
  88355, // Nivel 75
  91123, // Nivel 76
  93940, // Nivel 77
  96806, // Nivel 78
  99721, // Nivel 79
  102685, // Nivel 80
  105700, // Nivel 81
  108764, // Nivel 82
  111878, // Nivel 83
  115042, // Nivel 84
  118257, // Nivel 85
  121523, // Nivel 86
  124840, // Nivel 87
  128207, // Nivel 88
  131626, // Nivel 89
  135096, // Nivel 90
  138618, // Nivel 91
  142191, // Nivel 92
  145817, // Nivel 93
  149495, // Nivel 94
  153225, // Nivel 95
  157008, // Nivel 96
  160843, // Nivel 97
  164732, // Nivel 98
  168673, // Nivel 99
  172668, // Nivel 100
  176716, // Nivel 101
  180818, // Nivel 102
  184974, // Nivel 103
  189183, // Nivel 104
  193447, // Nivel 105
  197765, // Nivel 106
  202137, // Nivel 107
  206565, // Nivel 108
  211046, // Nivel 109
  215583, // Nivel 110
  220176, // Nivel 111
  224823, // Nivel 112
  229526, // Nivel 113
  234284, // Nivel 114
  239099, // Nivel 115
  243969, // Nivel 116
  248895, // Nivel 117
  253878, // Nivel 118
  258917, // Nivel 119
  264013, // Nivel 120
  269165, // Nivel 121
  274375, // Nivel 122
  279641, // Nivel 123
  284965, // Nivel 124
  290346, // Nivel 125
  295784, // Nivel 126
  301280, // Nivel 127
  306834, // Nivel 128
  312446, // Nivel 129
  318116, // Nivel 130
  323845, // Nivel 131
  329631, // Nivel 132
  335477, // Nivel 133
  341381, // Nivel 134
  347343, // Nivel 135
  353365, // Nivel 136
  359446, // Nivel 137
  365587, // Nivel 138
  371786, // Nivel 139
  378045, // Nivel 140
  384364, // Nivel 141
  390743, // Nivel 142
  397182, // Nivel 143
  403681, // Nivel 144
  410240, // Nivel 145
  416859, // Nivel 146
  423539, // Nivel 147
  430280, // Nivel 148
  437082, // Nivel 149
  443944, // Nivel 150
  450868, // Nivel 151
  457852, // Nivel 152
  464898, // Nivel 153
  472006, // Nivel 154
  479175, // Nivel 155
  486406, // Nivel 156
  493699, // Nivel 157
  501054, // Nivel 158
  508470, // Nivel 159
  515950, // Nivel 160
  523491, // Nivel 161
  531095, // Nivel 162
  538762, // Nivel 163
  546491, // Nivel 164
  554283, // Nivel 165
  562139, // Nivel 166
  570057, // Nivel 167
  578039, // Nivel 168
  586084, // Nivel 169
  594193, // Nivel 170
  602365, // Nivel 171
  610601, // Nivel 172
  618901, // Nivel 173
  627265, // Nivel 174
  635693, // Nivel 175
  644185, // Nivel 176
  652742, // Nivel 177
  661363, // Nivel 178
  670049, // Nivel 179
  678799, // Nivel 180
  687615, // Nivel 181
  696495, // Nivel 182
  705440, // Nivel 183
  714451, // Nivel 184
  723527, // Nivel 185
  732668, // Nivel 186
  741875, // Nivel 187
  751148, // Nivel 188
  760486, // Nivel 189
  769890, // Nivel 190
  779361, // Nivel 191
  788897, // Nivel 192
  798500, // Nivel 193
  808169, // Nivel 194
  817904, // Nivel 195
  827706, // Nivel 196
  837575, // Nivel 197
  847510, // Nivel 198
  857513, // Nivel 199
  867582, // Nivel 200
];

/**
 * Calcula el nivel exacto de una montura según sus puntos de experiencia acumulados.
 * @param xp Puntos de experiencia (0 a 867.582)
 * @returns Nivel de la montura (1 a 200)
 */
export function calculateLevelFromXp(xp: number): number {
  if (!xp || xp <= 0) return 1;
  if (xp >= MAX_MOUNT_XP) return 200;

  // Búsqueda binaria para O(log N) de alto rendimiento
  let low = 0;
  let high = MOUNT_LEVEL_XP_THRESHOLDS.length - 1;
  let level = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (MOUNT_LEVEL_XP_THRESHOLDS[mid] <= xp) {
      level = mid + 1; // los niveles son 1-indexados
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return Math.min(200, Math.max(1, level));
}

/**
 * Obtiene la experiencia base mínima necesaria para alcanzar un nivel determinado.
 * @param level Nivel objetivo (1 a 200)
 * @returns Experiencia requerida
 */
export function calculateXpForLevel(level: number): number {
  const targetLevel = Math.min(200, Math.max(1, Math.round(level)));
  return MOUNT_LEVEL_XP_THRESHOLDS[targetLevel - 1] ?? 0;
}
