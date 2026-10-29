import { test, expect } from 'bun:test';
import { csvCell, toCsv } from './preregistration-csv';

test('CSV export neutralises formulas and escapes quotes', () => {
 expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
 expect(csvCell(['Deep house', 'Surprise me'])).toBe('"Deep house | Surprise me"');
});
test('CSV export has one header row plus one row per guest', () => {
 expect(toCsv([{ first_name: 'A' }, { first_name: 'B' }]).split('\r\n')).toHaveLength(3);
});
