import type { Contact } from './preregistration';
export type ReviewScreen = '1' | '2' | '3' | 'thank-you' | 'waitlist';
export const REVIEW_CONTACT:Contact = { firstName:'Sample', lastName:'Guest', nationality:'Thailand', residence:'Thailand', dialCode:'+66', phone:'000000000', email:'guest@example.com', channel:'Email', instagram:'' };
export const REVIEW_VIBE = { moment:['Horadiso, the sunset hour'], music:['Deep and soulful house'], move:['A little of everything'], group:['A mixed group of friends'], occasion:[] };
export const REVIEW_CONSENT = { adult:true, policy:true, privacy:true, marketing:false };