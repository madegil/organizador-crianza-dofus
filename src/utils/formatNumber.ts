/** Número con punto de miles siempre, también en cifras de 4 dígitos: 2.000, 20.000, 300.000 */
export const formatNumber = (n: number): string => {
  const sign = n < 0 ? '−' : '';
  return sign + Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/** Serenidad con signo: +2.000, −3.000, 0 */
export const formatSigned = (n: number): string => (n > 0 ? `+${formatNumber(n)}` : formatNumber(n));
