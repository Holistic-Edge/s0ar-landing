import { test, expect } from 'bun:test';
import { buildRegistrationPayload, registrationSchema, submitRegistration } from './registration-submission';
import { REVIEW_CONTACT, REVIEW_CONSENT, REVIEW_VIBE } from './registration-review';
const input = () => ({contact:{...REVIEW_CONTACT}, consent:{...REVIEW_CONSENT}, vibe:{moment:REVIEW_VIBE.moment[0],music:[...REVIEW_VIBE.music],move:REVIEW_VIBE.move[0],group:REVIEW_VIBE.group[0],occasion:'',occasionDate:''}, submissionId:'9a0ea1c7-7972-4cd3-9bdd-22546fb6e0ae',submittedAt:'2026-10-29T05:04:00.000Z',attribution:{utm_source:'',utm_medium:'',utm_campaign:'',referrer:'',landing_path:'/'}});
test('Preview submission never calls a production destination', async () => {
 expect(await submitRegistration(buildRegistrationPayload(input()))).toEqual({status:'preview'});
});
test('All three required acknowledgements reject false, marketing remains optional', () => {
 for (const key of ['adult','policy','privacy']) {const value=input();value.consent[key]=false;expect(() => buildRegistrationPayload(value)).toThrow();}
 expect(buildRegistrationPayload(input()).consent.marketing).toBe(false);
});
test('Payload enforces at most two distinct music choices', () => {
 const value=input();value.vibe.music=['Deep and soulful house','Melodic and progressive','Surprise me'];expect(() => buildRegistrationPayload(value)).toThrow();
 value.vibe.music=['Deep and soulful house','Deep and soulful house'];expect(() => buildRegistrationPayload(value)).toThrow();
});
test('Contact and vibe validation reject manipulated inputs', () => {
 const value=input();value.contact.residence='Not a country';expect(() => buildRegistrationPayload(value)).toThrow();
 value.contact.residence='';value.contact.instagram='<script>';expect(() => buildRegistrationPayload(value)).toThrow();
 value.contact.instagram='';value.vibe.group='unlisted';expect(() => buildRegistrationPayload(value)).toThrow();
});
test('Occasion date is optional but must be a real calendar date', () => {
 const value=input();expect(buildRegistrationPayload(value).vibe.occasionDate).toBe('');
 value.vibe.occasionDate='2026-02-30';expect(() => buildRegistrationPayload(value)).toThrow();
 value.vibe.occasionDate='2026-11-27';expect(buildRegistrationPayload(value).vibe.occasionDate).toBe('2026-11-27');
});
test('Transport accepts only explicit durable-capture receipt and preserves submission id', async () => {
 const payload=buildRegistrationPayload(input());let received;
 expect(await submitRegistration(payload,async value => {received=value;return {status:'accepted',registrationId:'test-123'};})).toEqual({status:'accepted',registrationId:'test-123'});
 expect(received.submissionId).toBe(payload.submissionId);
 await expect(submitRegistration(payload,async () => ({ok:true}))).rejects.toThrow();
 await expect(submitRegistration(payload,async () => {throw new Error('offline');})).rejects.toThrow();
});
test('Invalid payload is rejected before reaching the transport', async () => {
 let calls=0;const payload=buildRegistrationPayload(input());payload.contact.firstName='';
 expect(registrationSchema.safeParse(payload).success).toBe(false);
 await expect(submitRegistration(payload,async () => {calls++;return {status:'accepted',registrationId:'test'};})).rejects.toThrow();
 expect(calls).toBe(0);
});