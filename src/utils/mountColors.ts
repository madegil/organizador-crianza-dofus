export const COLOR_PALETTE: Record<string, string> = {
  'almendrada': '#f5eccb',
  'almendrado': '#f5eccb',
  'dorada': '#f59e0b',
  'dorado': '#f59e0b',
  'pelirroja': '#e11d48',
  'pelirrojo': '#e11d48',
  'ébano': '#1e293b',
  'ebano': '#1e293b',
  'índigo': '#2563eb',
  'indigo': '#2563eb',
  'púrpura': '#9333ea',
  'purpura': '#9333ea',
  'orquídea': '#db2777',
  'orquidea': '#db2777',
  'marfil': '#fef08a',
  'turquesa': '#06b6d4',
  'esmeralda': '#10b981',
  'ciruela': '#701a75',
  'jade': '#047857',
  'rubí': '#b91c1c',
  'rubi': '#b91c1c',
};

export function getColorsFromBreedName(breedName: string): { primary: string; secondary: string } {
  const norm = breedName.toLowerCase();
  const foundColors: string[] = [];

  for (const [key, hex] of Object.entries(COLOR_PALETTE)) {
    if (norm.includes(key)) {
      if (!foundColors.includes(hex)) {
        foundColors.push(hex);
      }
    }
  }

  if (foundColors.length === 0) {
    return { primary: '#64748b', secondary: '#475569' };
  } else if (foundColors.length === 1) {
    return { primary: foundColors[0], secondary: foundColors[0] };
  } else {
    return { primary: foundColors[0], secondary: foundColors[1] };
  }
}
