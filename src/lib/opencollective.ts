// Public figures from Open Collective, fetched once at build time.
import { site } from './data';

export const OPEN_COLLECTIVE = site().open_collective;

export type Ledger = { balance: number; raised: number; backers: number; currency: string };

let cached: Promise<Ledger | null> | undefined;
export function ledger(): Promise<Ledger | null> {
  cached ??= fetch(`${OPEN_COLLECTIVE.replace(/\/$/, '')}.json`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => d && { balance: d.balance / 100, raised: d.yearlyIncome / 100, backers: d.backersCount, currency: d.currency ?? 'CAD' })
    .catch(() => null);
  return cached;
}

export const money = (n: number, currency = 'CAD') =>
  n.toLocaleString('en-CA', { style: 'currency', currency, maximumFractionDigits: 0 });
