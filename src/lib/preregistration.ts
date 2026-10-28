export const OPENING_DATE = '2026-11-27T00:00:00+07:00';
export const MINIMUM_AGE = 23;
export const MAX_MUSIC_CHOICES = 2;
export const DEFAULT_DIAL_CODE = '+66';
export const CHANNELS = ['WhatsApp', 'LINE', 'WeChat', 'Instagram DM', 'Email'];
export type Contact = { firstName: string; lastName: string; nationality: string; residence: string; dialCode: string; phone: string; email: string; channel: string; instagram: string };
export function validateContact(c: Contact) {
  const errors: Partial<Record<keyof Contact, string>> = {};
  if (!c.firstName.trim()) errors.firstName = 'Please enter your first name.';
  if (!c.lastName.trim()) errors.lastName = 'Please enter your last name.';
  if (!c.nationality.trim()) errors.nationality = 'Please choose your nationality.';
  if (!/^[\d\s()+-]{6,25}$/.test(c.phone) || c.phone.replace(/\D/g, '').length < 6) errors.phone = 'Please enter a valid mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!CHANNELS.includes(c.channel)) errors.channel = 'Choose how we should reach you.';
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
