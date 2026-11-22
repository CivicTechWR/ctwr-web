// Upcoming hacknights from the public Luma iCal feed, fetched once at build time.
// Port of _plugins/fetch_luma_event.rb. If the feed can't be reached, the
// fallback list below is used, so a build never fails because of Luma.
// Rebuild the site on a schedule (see .github/workflows/deploy.yml) to keep it fresh.

const LUMA_ICAL_URL = 'https://api2.luma.com/ics/get?entity=calendar&id=cal-BVpgpDCgYaCqcPx';
import { site } from './data';
export const LUMA_CALENDAR = site().luma_calendar;

export type HackNight = {
  title: string;
  start: Date;
  end?: Date;
  location: string;
  url: string;
};

const FALLBACK: HackNight[] = [
  { title: 'CivicTechWR Hacknight', start: new Date('2026-11-25T18:00:00-05:00'), end: new Date('2026-11-25T20:00:00-05:00'), location: '165 King St W, Kitchener', url: 'https://luma.com/1b6nuekm' },
  { title: 'CivicTechWR Hacknight', start: new Date('2026-12-02T18:00:00-05:00'), end: new Date('2026-12-02T20:00:00-05:00'), location: '165 King St W, Kitchener', url: 'https://luma.com/831us592' },
  { title: 'CivicTechWR Hacknight', start: new Date('2026-12-09T18:00:00-05:00'), end: new Date('2026-12-09T20:00:00-05:00'), location: '165 King St W, Kitchener', url: 'https://luma.com/t5upy7ig' },
  { title: 'Season 9 Project Showcase', start: new Date('2026-12-16T18:00:00-05:00'), end: new Date('2026-12-16T20:00:00-05:00'), location: '165 King St W, Kitchener', url: 'https://luma.com/g2mjtlxp' },
];

function unfold(ics: string) {
  return ics.replace(/\r?\n[ \t]/g, '');
}

function parseDate(v: string): Date | undefined {
  const m = v.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)/);
  if (!m) return undefined;
  const [, y, mo, d, h, mi, s, z] = m;
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}${z ? 'Z' : '-05:00'}`;
  return new Date(iso);
}

function unescape(v = '') {
  return v.replace(/\\n/g, ' ').replace(/\\,/g, ',').replace(/\;/g, ';').trim();
}

export function parseIcal(ics: string): HackNight[] {
  const events: HackNight[] = [];
  for (const block of unfold(ics).split('BEGIN:VEVENT').slice(1)) {
    const field = (name: string) => block.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, 'm'))?.[1];
    const start = parseDate(field('DTSTART') ?? '');
    if (!start) continue;
    const loc = unescape(field('LOCATION'));
    events.push({
      title: unescape(field('SUMMARY')) || 'CivicTechWR Hacknight',
      start,
      end: parseDate(field('DTEND') ?? ''),
      location: loc.startsWith('http') || !loc ? '165 King St W, Kitchener' : loc.split(',').slice(0, 2).join(','),
      url: field('URL')?.trim() || unescape(field('DESCRIPTION')).match(/https:\/\/(?:lu\.ma|luma\.com)\/\S+/)?.[0] || LUMA_CALENDAR,
    });
  }
  return events;
}

let cache: Promise<HackNight[]> | undefined;

export function upcomingHackNights(count = 4, now = new Date()): Promise<HackNight[]> {
  cache ??= (async () => {
    try {
      const res = await fetch(LUMA_ICAL_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const events = parseIcal(await res.text());
      if (!events.length) throw new Error('no events in feed');
      return events;
    } catch (e) {
      console.warn(`[luma] Using fallback events (${(e as Error).message})`);
      return FALLBACK;
    }
  })();
  return cache.then((all) =>
    all.filter((e) => e.start > now).sort((a, b) => +a.start - +b.start).slice(0, count),
  );
}

const TZ = 'America/Toronto';
export const fmt = {
  long: (d: Date) => d.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ }),
  short: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ }),
  time: (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ }),
};
