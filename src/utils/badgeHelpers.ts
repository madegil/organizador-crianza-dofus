export function getFertilityLabel(fertility?: string): string {
  if (!fertility) return 'Fértil';
  const f = fertility.toLowerCase().trim();
  if (f.includes('fecond') || f.includes('fecund')) return 'Fecunda';
  if (f.includes('steril') || f.includes('esteril')) return 'Estéril';
  if (f.includes('senil')) return 'Senil';
  return 'Fértil';
}

export function getFertilityBadgeClasses(fertility?: string): string {
  const label = getFertilityLabel(fertility);
  switch (label) {
    case 'Fecunda':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'Estéril':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    case 'Senil':
      return 'bg-slate-700/60 text-slate-300 border border-slate-600';
    case 'Fértil':
    default:
      return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
  }
}

export function getCapacityLabel(capacity?: string): string | null {
  if (!capacity) return null;
  const c = capacity.toLowerCase().trim();
  if (c === 'none' || c === 'ninguna' || c === '' || c === 'null') return null;
  if (c.includes('sage') || c.includes('sabia') || c.includes('sabio')) return '✨ Sabia • XP x2';
  if (c.includes('amour') || c.includes('enamoradiza') || c.includes('amorosa')) return 'Enamoradiza • Amor x2';
  if (c.includes('endur') || c.includes('resistente')) return 'Resistente • Resistencia x2';
  if (c.includes('prec') || c.includes('precoz')) return 'Precoz • Madurez x2';
  if (c.includes('reprod') || c.includes('reproductora')) return 'Reproductora • +1 Cría';
  if (c.includes('camele') || c.includes('camaleon') || c.includes('camaleón')) return 'Camaleón';
  return capacity;
}
