import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsRow } from './registration-analytics';

// Called only by the client-only authenticated route; existing admin RLS applies.
export async function loadAnalyticsRows(): Promise<AnalyticsRow[]> {
 const rows: AnalyticsRow[] = [];
 for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase.from('preregistrations')
   .select('status,consent_marketing,consent_adult,consent_policy,consent_privacy,nationality,residence,channel,moment,music,move,party,occasion,occasion_date,created_at')
   .order('created_at', { ascending: true }).order('id', { ascending: true }).range(from, from + 999);
  if (error) throw new Error('Could not load registration analytics. Please try again.');
  rows.push(...(data ?? []));
  if (!data || data.length < 1000) return rows;
 }
}