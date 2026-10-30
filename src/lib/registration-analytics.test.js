import { test, expect } from 'bun:test';
import { summarizeRegistrations } from './registration-analytics';
const guest = { status:'new', consent_marketing:false, consent_adult:true, consent_policy:true, consent_privacy:true, nationality:'Thailand', residence:'', channel:'Email', moment:'After dark', music:['Disco'], move:'Dancing', party:'Friends', occasion:'', occasion_date:null, created_at:'2026-10-30T10:00:00Z' };
test('Curation totals reflect stored status, not an inferred acceptance algorithm', () => {
 const result = summarizeRegistrations([guest, {...guest,status:'confirmed'}, {...guest,status:'waitlist'}]);
 expect([result.total,result.pending,result.confirmed,result.waitlist]).toEqual([3,1,1,1]);
});
test('Music percentages count guests per answer, not total music selections', () => {
 const result = summarizeRegistrations([{...guest,music:['Disco','House']},guest]);
 expect(result.music).toEqual([{label:'Disco',count:2,percent:100},{label:'House',count:1,percent:50}]);
});
test('Optional dates group by month and do not silently include unspecified dates', () => {
 const result = summarizeRegistrations([guest,{...guest,occasion_date:'2026-12-01'},{...guest,occasion_date:'2026-12-20'}]);
 expect(result.datesProvided).toBe(2);
 expect(result.timeline[0].label).toBe('2026-12'); expect(result.timeline[0].count).toBe(2);
});
test('Marketing rate is separate from mandatory consent and zero totals are safe', () => {
 expect(summarizeRegistrations([guest,{...guest,consent_marketing:true}]).marketing).toBe(1);
 expect(summarizeRegistrations([]).total).toBe(0); expect(summarizeRegistrations([]).music).toEqual([]);
});