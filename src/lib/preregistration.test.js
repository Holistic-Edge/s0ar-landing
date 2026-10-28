import { test, expect } from 'bun:test';
import { MINIMUM_AGE, DEFAULT_DIAL_CODE, toggleMusic, canRegister, countdown, OPENING_DATE } from './preregistration';
test('All guests must be 23 or over', () => expect(MINIMUM_AGE).toBe(23));
test('Thailand +66 is the initial mobile country code', () => expect(DEFAULT_DIAL_CODE).toBe('+66'));
test('Music choices are limited to two and can be deselected', () => {
 expect(toggleMusic(['House', 'Disco'], 'Techno')).toEqual(['House', 'Disco']);
 expect(toggleMusic(['House', 'Disco'], 'House')).toEqual(['Disco']);
});
test('Age, onboard policy and privacy consent are all mandatory', () => {
 expect(canRegister({adult:true,policy:true,privacy:true})).toBe(true);
 for (const key of ['adult','policy','privacy']) expect(canRegister({...{adult:true,policy:true,privacy:true},[key]:false})).toBe(false);
});
test('Countdown targets 27 November 2026 in Thailand and never goes negative', () => {
 expect(OPENING_DATE).toBe('2026-11-27T00:00:00+07:00');
 expect(countdown(Date.parse('2026-11-26T00:00:00+07:00')).days).toBe(1);
 expect(countdown(Date.parse('2026-12-01T00:00:00+07:00'))).toEqual({days:0,hours:0,minutes:0,seconds:0});
});
