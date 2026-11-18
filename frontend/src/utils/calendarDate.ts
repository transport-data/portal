// The date picker returns local midnight of the picked day. The server turns
// dates into YYYY-MM-DD with toISOString(), which is UTC. For anyone east of
// UTC (e.g. Germany) local midnight is still the previous day in UTC, so the
// stored date drifted back by one day. Pinning to 12:00 UTC keeps the same
// calendar day for every timezone from UTC-12 to UTC+11.
export function toUtcNoon(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  );
}
