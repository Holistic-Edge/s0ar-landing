import { z } from 'zod';

export const OPENING_DATE = '2026-11-27T00:00:00+07:00';
export const MINIMUM_AGE = 23;
export const MAX_MUSIC_CHOICES = 2;
export const DEFAULT_DIAL_CODE = '+66';
export const CHANNELS = ['WhatsApp', 'LINE', 'WeChat', 'Instagram DM', 'Email'];
const REGION_CODES = 'AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI KH CM CA CV KY CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU MX FM MD MC MN ME MS MA MZ MM NA NP NL NC NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC UG UA AE GB US UY UZ VU VA VE VN VG VI YE ZM ZW'.split(' ');
const names = new Intl.DisplayNames(['en'], { type: 'region' });
export const COUNTRIES = REGION_CODES.map(code => names.of(code) || code).sort();
export const DIAL_CODES = ['+66', '+1', '+44', '+61', '+65', '+60', '+81', '+86', '+91', '+971', '+49', '+33', '+82', '+852', '+62', '+63', '+84', '+7', '+27', '+64', '+39', '+34'];
export const QUESTIONS: {key:string;title:string;hint?:string;options:string[]}[] = [
 {key:'moment', title:'When do you come alive?', options:['Daytime by the pool', 'Horadiso, the sunset hour', 'After dark']},
 {key:'music', title:'What is playing in your head right now?', hint:'Pick up to two', options:['Deep and soulful house', 'Melodic and progressive', 'Tech house and techno', 'Disco and nu disco', 'Surprise me']},
 {key:'move', title:'How do you like to move?', options:['Front of the dance floor', 'Drink in hand, gently swaying', 'Sunbed and sea views', 'A little of everything']},
 {key:'group', title:'Who would you SOAR with?', options:['My partner', 'A mixed group of friends', "A girls’ day out", "A boys’ day out", 'A celebration with my crew']},
 {key:'occasion', title:'Celebrating something?', hint:'Optional', options:['Birthday', 'Anniversary', 'Engagement', 'Business', 'Just because']},
];
const country = z.string().trim().refine(value => COUNTRIES.includes(value), 'Choose a country from the list.');
export const contactSchema = z.object({
 firstName:z.string().trim().min(1, 'Please enter your first name.').max(100),
 lastName:z.string().trim().min(1, 'Please enter your last name.').max(100),
 nationality:country,
 residence:z.union([z.literal(''),country]),
 dialCode:z.string().refine(value => DIAL_CODES.includes(value), 'Choose a calling code from the list.'),
 phone:z.string().trim().regex(/^[\d\s()+-]{6,25}$/, 'Please enter a valid mobile number.').refine(value => value.replace(/\D/g, '').length >= 6, 'Please enter a valid mobile number.'),
 email:z.string().trim().email('Please enter a valid email address.').max(255),
 channel:z.string().refine(value => CHANNELS.includes(value), 'Choose how we should reach you.'),
 instagram:z.string().trim().transform(value => value.replace(/^@+/, '')).refine(value => !value || /^[A-Za-z0-9._]{1,30}$/.test(value), 'Enter a valid Instagram handle.'),
}).strict();
export type Contact = { firstName: string; lastName: string; nationality: string; residence: string; dialCode: string; phone: string; email: string; channel: string; instagram: string };
export function validateContact(c: Contact) {
  const errors: Partial<Record<keyof Contact, string>> = {};
  const result = contactSchema.safeParse(c);
  if (!result.success) for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof Contact;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
export function toggleMusic(current: string[], option: string) {
  return current.includes(option) ? current.filter(x => x !== option) : current.length < MAX_MUSIC_CHOICES ? [...current, option] : current;
}
export function canRegister(consent: { adult: boolean; policy: boolean; privacy: boolean }) {
  return consent.adult && consent.policy && consent.privacy;
}
export function countdown(now: number) {
  const remaining = Math.max(0, Date.parse(OPENING_DATE) - now);
  return { days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24, minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60 };
}
