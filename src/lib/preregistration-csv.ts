export const CSV_COLUMNS = ['created_at','status','first_name','last_name','email','dial_code','phone','channel','instagram','nationality','residence','moment','music','move','party','occasion','occasion_date','consent_marketing','utm_source','utm_medium','utm_campaign','referrer','notes'] as const;

// Quotes every cell and neutralises spreadsheet formulas so guest text can't execute in Excel/Sheets.
export function csvCell(value: unknown): string {
 let text = Array.isArray(value) ? value.join(' | ') : value == null ? '' : String(value);
 if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
 return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[]): string {
 return [CSV_COLUMNS.join(','), ...rows.map(row => CSV_COLUMNS.map(c => csvCell(row[c])).join(','))].join('\r\n');
}
