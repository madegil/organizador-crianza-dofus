/** Bonus de crianza del Almanax. Fuente única para la tabla de la guía, el calendario .ics y el aviso en la página. */

export type AlmanaxKind = 'medidor' | 'capacidad' | 'oficio' | 'cruce';

export interface AlmanaxBonus {
  id: string;
  month: number; // 1-12
  day: number;
  /** Solo para bonus de fecha variable: el año al que corresponde la fecha */
  year?: number;
  bonus: string;
  kind: AlmanaxKind;
}

export const ALMANAX_BONUSES: AlmanaxBonus[] = [
  { id: 'trom', month: 1, day: 10, bonus: 'Medidor de madurez al doble', kind: 'medidor' },
  { id: 'meash', month: 2, day: 10, bonus: 'Los bebés nacen Resistentes', kind: 'capacidad' },
  { id: 'inndo', month: 3, day: 10, bonus: 'Medidor de aguante al doble', kind: 'medidor' },
  { id: 'nunu', month: 4, day: 10, bonus: 'Medidor de pérdida de serenidad al doble', kind: 'medidor' },
  { id: 'loumi', month: 5, day: 10, bonus: 'Los ganaderos ahorran un 15 % de ingredientes', kind: 'oficio' },
  { id: 'jibejan', month: 6, day: 10, bonus: 'Medidor de experiencia al doble', kind: 'medidor' },
  { id: 'jihelair', month: 7, day: 10, bonus: 'Los bebés nacen Enamoradizos', kind: 'capacidad' },
  { id: 'rigamix', month: 8, day: 10, bonus: '25 % de probabilidad de fabricar un objeto extra', kind: 'oficio' },
  { id: 'mau', month: 9, day: 10, bonus: 'Medidor de aumento de serenidad al doble', kind: 'medidor' },
  { id: 'benjo', month: 10, day: 10, bonus: 'Los bebés nacen Sabios', kind: 'capacidad' },
  { id: 'takeza-2026', month: 10, day: 12, year: 2026, bonus: '+20 % de generación objetivo', kind: 'cruce' },
  { id: 'otoul', month: 11, day: 10, bonus: 'Los bebés nacen Precoces', kind: 'capacidad' },
  { id: 'foya', month: 12, day: 10, bonus: 'Medidor de amor al doble', kind: 'medidor' },
];

/** Qué conviene preparar para aprovechar cada tipo de bonus */
export const ALMANAX_TIPS: Record<AlmanaxKind, string> = {
  medidor: 'Recarga ese medidor antes para aprovechar el día.',
  capacidad: 'Ten parejas fecundas listas para cruzarlas ese día.',
  oficio: 'Buen día para fabricar redes, carburantes y mákinas.',
  cruce: 'Buen día para tus cruces de generaciones altas.',
};

export const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const almanaxDateLabel = (b: AlmanaxBonus) =>
  b.year ? `${b.day} de ${MONTH_NAMES[b.month - 1]} de ${b.year} (fecha variable)` : `${b.day} de ${MONTH_NAMES[b.month - 1]}`;

/** Bonus que caen en una fecha concreta (año, mes 1-12, día) */
export const bonusesOn = (y: number, m: number, d: number) =>
  ALMANAX_BONUSES.filter((b) => b.month === m && b.day === d && (!b.year || b.year === y));
