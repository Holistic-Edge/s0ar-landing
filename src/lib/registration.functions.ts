import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { registrationSchema, toPreregistrationRow } from './registration-submission';

// Public endpoint: validates the shared contract server-side, then inserts with the
// publishable key. RLS only allows inserting new rows; anon can never read them back.
export const captureRegistration = createServerFn({ method: 'POST' })
 .inputValidator((input: unknown) => registrationSchema.parse(input))
 .handler(async ({ data }) => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const supabase = createClient<Database>(process.env['SUPABASE_URL']!, key, {
   auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
   global: { fetch: (input, init) => {
    const h = new Headers(init?.headers);
    if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization');
    h.set('apikey', key);
    return fetch(input, { ...init, headers: h });
   } },
  });
  const { error } = await supabase.from('preregistrations').insert(toPreregistrationRow(data));
  // A repeated submission id means this exact registration was already stored.
  if (error && error.code !== '23505') {
   console.error('preregistration insert failed', error.code, error.message);
   throw new Error('Registration could not be saved');
  }
  return { status: 'accepted' as const, registrationId: data.submissionId };
 });
