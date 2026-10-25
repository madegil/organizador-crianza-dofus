import type { APIRoute } from 'astro';
import { ALMANAX_BONUSES, ALMANAX_TIPS } from '../data/almanax';

/**
 * Calendario de los bonus de crianza del Almanax (/almanax-crianza.ics).
 * Eventos de día completo que se repiten cada año, con dos avisos:
 * la víspera a las 20:00 y el mismo día a las 08:00 (hora local de quien lo usa).
 */
const pad = (n: number) => String(n).padStart(2, '0');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const BASE_YEAR = 2026;
// RFC 5545: líneas de 75 octetos como máximo; las siguientes empiezan con un espacio
const fold = (line: string) => {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  for (const ch of line) {
    const limit = out.length === 0 ? 75 : 74;
    if (enc.encode(cur + ch).length > limit) {
      out.push(cur);
      cur = ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join('\r\n ');
};
const SITE = 'https://organizador-crianza-dofus.vercel.app';

export const GET: APIRoute = () => {
  const stamp = '20261025T000000Z';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gestor de monturas//Almanax de crianza//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Almanax de crianza (Dofus)',
    'X-WR-CALDESC:Bonus de crianza del Almanax de Dofus. Gestor de monturas.',
    'REFRESH-INTERVAL;VALUE=DURATION:P1W',
    'X-PUBLISHED-TTL:P1W',
  ];

  for (const b of ALMANAX_BONUSES) {
    const year = b.year ?? BASE_YEAR;
    const start = `${year}${pad(b.month)}${pad(b.day)}`;
    const next = new Date(Date.UTC(year, b.month - 1, b.day + 1));
    const end = `${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`;
    const summary = `Almanax: ${b.bonus}`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:almanax-${b.id}@organizador-crianza-dofus`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      ...(b.year ? [] : ['RRULE:FREQ=YEARLY']),
      `SUMMARY:${esc(summary)}`,
      `DESCRIPTION:${esc(`${ALMANAX_TIPS[b.kind]} ${SITE}/#recompensas`)}`,
      `URL:${SITE}/#recompensas`,
      'TRANSP:TRANSPARENT',
      // Víspera a las 20:00
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(`Mañana: ${b.bonus}`)}`,
      'TRIGGER:-PT4H',
      'END:VALARM',
      // Mismo día a las 08:00
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(`Hoy: ${b.bonus}`)}`,
      'TRIGGER:PT8H',
      'END:VALARM',
      'END:VEVENT'
    );
  }
  lines.push('END:VCALENDAR');

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
