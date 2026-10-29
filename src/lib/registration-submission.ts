import { z } from 'zod';
import { contactSchema, QUESTIONS } from './preregistration';

export const NOTICE_VERSION = '2026-10-29-draft';
function choice(key: string) {
 const options = QUESTIONS.find(question => question.key === key)?.options ?? [];
 if (!options.length) throw new Error('Unknown preference definition');
 return z.enum(options as [string, ...string[]]);
}
export const occasionDateSchema = z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Enter a valid occasion date.').refine(value => {
 if (!value) return true;
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
 const date = new Date(`${value}T00:00:00Z`);
 return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}, 'Enter a valid occasion date.').describe('Empty or a real calendar date; server must reject impossible calendar dates.');
export const vibeSchema = z.object({
 moment:choice('moment'), music:z.array(choice('music')).min(1).max(2).refine(values => new Set(values).size === values.length, 'Choose different music options.').describe('Unique music selections; server must enforce uniqueness.'),
 move:choice('move'), group:choice('group'), occasion:z.union([z.literal(''), choice('occasion')]), occasionDate:occasionDateSchema,
}).strict();
export const consentSchema = z.object({ adult:z.literal(true), policy:z.literal(true), privacy:z.literal(true), marketing:z.boolean() }).strict();
const attributionText = z.string().max(255);
export const registrationSchema = z.object({
 schemaVersion:z.literal('1.0'), submissionId:z.string().uuid(), submittedAt:z.string().datetime(),
 contact:contactSchema, vibe:vibeSchema,
 consent:consentSchema.extend({ policyVersion:z.literal(NOTICE_VERSION), privacyVersion:z.literal(NOTICE_VERSION) }),
 attribution:z.object({ utm_source:attributionText, utm_medium:attributionText, utm_campaign:attributionText, referrer:z.string().max(2048), landing_path:z.string().max(2048) }).strict(),
}).strict();
export type RegistrationPayload = z.infer<typeof registrationSchema>;
export type SubmissionResult = { status:'preview' } | { status:'accepted'; registrationId:string };
export type RegistrationTransport = (payload:RegistrationPayload) => Promise<unknown>;
const receiptSchema = z.object({ status:z.literal('accepted'), registrationId:z.string().min(1).max(100) }).strict();
export function buildRegistrationPayload(input: {
 contact:z.input<typeof contactSchema>; vibe:z.input<typeof vibeSchema>; consent:z.input<typeof consentSchema>;
 submissionId:string; submittedAt:string; attribution:RegistrationPayload['attribution'];
}):RegistrationPayload {
 return registrationSchema.parse({ ...input, schemaVersion:'1.0', consent:{...input.consent, policyVersion:NOTICE_VERSION, privacyVersion:NOTICE_VERSION} });
}
// No network, storage, or configurable public webhook is enabled in this review build.
// Phillip's integration can supply a transport after its server validates and durably stores the payload.
export async function submitRegistration(payload:RegistrationPayload, transport?:RegistrationTransport):Promise<SubmissionResult> {
 const validated = registrationSchema.parse(payload);
 if (!transport) return { status:'preview' };
 return receiptSchema.parse(await transport(validated));
}
export function readRegistrationAttribution():RegistrationPayload['attribution'] {
 if (typeof window === 'undefined') return {utm_source:'', utm_medium:'', utm_campaign:'', referrer:'', landing_path:'/'};
 const params = new URLSearchParams(window.location.search);
 let referrer = '';
 try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch { /* Ignore malformed referrers. */ }
 return { utm_source:(params.get('utm_source') || '').slice(0,255), utm_medium:(params.get('utm_medium') || '').slice(0,255), utm_campaign:(params.get('utm_campaign') || '').slice(0,255), referrer, landing_path:window.location.pathname.slice(0,2048) };
}