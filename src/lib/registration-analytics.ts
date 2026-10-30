export type AnalyticsRow = {
 status: string; consent_marketing: boolean; consent_adult: boolean; consent_policy: boolean; consent_privacy: boolean;
 nationality: string; residence: string; channel: string; moment: string; music: string[]; move: string; party: string;
 occasion: string; occasion_date: string | null; created_at: string;
};
export type Breakdown = { label: string; count: number; percent: number }[];
export function distribution(values: string[], denominator: number): Breakdown {
 const counts = new Map<string, number>();
 for (const value of values) counts.set(value || 'Not specified', (counts.get(value || 'Not specified') ?? 0) + 1);
 return [...counts].map(([label, count]) => ({ label, count, percent: denominator ? count / denominator * 100 : 0 }))
  .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
export function summarizeRegistrations(rows: AnalyticsRow[]) {
 const total = rows.length;
 const breakdown = (key: 'nationality' | 'residence' | 'channel' | 'moment' | 'move' | 'party' | 'occasion') => distribution(rows.map(row => row[key]), total);
 const monthly = rows.filter(row => row.occasion_date).map(row => row.occasion_date?.slice(0, 7) ?? '');
 return {
  total, confirmed: rows.filter(row => row.status === 'confirmed').length,
  waitlist: rows.filter(row => row.status === 'waitlist').length, pending: rows.filter(row => row.status === 'new').length,
  marketing: rows.filter(row => row.consent_marketing).length,
  adult: rows.filter(row => row.consent_adult).length, policy: rows.filter(row => row.consent_policy).length, privacy: rows.filter(row => row.consent_privacy).length,
  nationality: breakdown('nationality'), residence: breakdown('residence'), channel: breakdown('channel'), moment: breakdown('moment'),
  music: distribution(rows.flatMap(row => [...new Set(row.music)]), total), move: breakdown('move'), party: breakdown('party'), occasion: breakdown('occasion'),
  datesProvided: monthly.length, timeline: distribution(monthly, total).sort((a, b) => a.label.localeCompare(b.label)),
  daily: distribution(rows.map(row => row.created_at.slice(0, 10)), total).sort((a, b) => a.label.localeCompare(b.label)),
 };
}