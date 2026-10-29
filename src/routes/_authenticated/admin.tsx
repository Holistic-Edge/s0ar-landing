import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Download, Search, Inbox, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toCsv } from '@/lib/preregistration-csv';

type Row = Database['public']['Tables']['preregistrations']['Row'];
type Status = 'new' | 'confirmed' | 'waitlist';
const PAGE = 50;
const STATUS_LABEL: Record<Status, string> = { new: 'New', confirmed: 'On the list', waitlist: 'Not this time' };

export const Route = createFileRoute('/_authenticated/admin')({
 head: () => ({ meta: [
  { title: 'SOAR Ocean Club | Pre-registration Hub' },
  { name: 'description', content: 'Review SOAR pre-registrations.' },
  { property: 'og:title', content: 'SOAR Ocean Club | Pre-registration Hub' },
  { property: 'og:description', content: 'Review SOAR pre-registrations.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
 ] }),
 component: () => <AdminShell><PreregistrationsPage/></AdminShell>,
});

function PreregistrationsPage() {
 const [rows, setRows] = useState<Row[]>([]);
 const [total, setTotal] = useState(0);
 const [stats, setStats] = useState({ all: 0, new: 0, confirmed: 0, waitlist: 0, marketing: 0 });
 const [page, setPage] = useState(0);
 const [q, setQ] = useState('');
 const [search, setSearch] = useState('');
 const [status, setStatus] = useState<Status | 'all'>('all');
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState<Row | null>(null);
 const [exporting, setExporting] = useState(false);

 const applyFilters = useCallback(<T extends { or: (f: string) => T; eq: (c: 'status', v: string) => T }>(query: T) => {
  let next = query;
  if (status !== 'all') next = next.eq('status', status);
  const term = search.replace(/[%,()]/g, ' ').trim();
  if (term) next = next.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,instagram.ilike.%${term}%`);
  return next;
 }, [search, status]);

 const load = useCallback(async () => {
  setLoading(true);
  const base = supabase.from('preregistrations').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
  const { data, count, error } = await applyFilters(base);
  setLoading(false);
  if (error) { toast.error('Could not load registrations'); return; }
  setRows(data ?? []); setTotal(count ?? 0);
 }, [page, applyFilters]);

 const loadStats = useCallback(async () => {
  const c = (f?: (q: any) => any) => { const b = supabase.from('preregistrations').select('id', { count: 'exact', head: true }); return (f ? f(b) : b).then((r: { count: number | null }) => r.count ?? 0); };
  const [all, n, conf, wait, marketing] = await Promise.all([c(), c(b => b.eq('status', 'new')), c(b => b.eq('status', 'confirmed')), c(b => b.eq('status', 'waitlist')), c(b => b.eq('consent_marketing', true))]);
  setStats({ all, new: n, confirmed: conf, waitlist: wait, marketing });
 }, []);

 useEffect(() => { void load(); }, [load]);
 useEffect(() => { void loadStats(); }, [loadStats]);
 useEffect(() => { const t = setTimeout(() => { setSearch(q); setPage(0); }, 300); return () => clearTimeout(t); }, [q]);

 async function update(row: Row, patch: Partial<Pick<Row, 'status' | 'notes'>>) {
  const { error } = await supabase.from('preregistrations').update(patch).eq('id', row.id);
  if (error) { toast.error('Could not save'); return; }
  const next = { ...row, ...patch };
  setRows(rs => rs.map(r => r.id === row.id ? next : r)); setOpen(next); toast.success('Saved'); void loadStats();
 }

 async function remove(row: Row) {
  const { error } = await supabase.from('preregistrations').delete().eq('id', row.id);
  if (error) { toast.error('Could not delete'); return; }
  setOpen(null); toast.success('Registration deleted'); void load(); void loadStats();
 }

 async function exportCsv() {
  setExporting(true);
  const all: Row[] = [];
  for (let from = 0; ; from += 1000) {
   const { data, error } = await applyFilters(supabase.from('preregistrations').select('*').order('created_at', { ascending: false }).range(from, from + 999));
   if (error) { toast.error('Export failed'); setExporting(false); return; }
   all.push(...(data ?? []));
   if (!data || data.length < 1000) break;
  }
  const url = URL.createObjectURL(new Blob(['\uFEFF' + toCsv(all)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `soar-preregistrations-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  setExporting(false);
 }

 const pages = Math.max(1, Math.ceil(total / PAGE));
 return <div className="admin-page">
  <div className="admin-page-head">
   <div><p className="admin-label text-primary">/ First list</p><h1>Pre-registrations</h1></div>
   <Button onClick={exportCsv} disabled={exporting} className="soar-button"><Download/>{exporting ? 'Exporting…' : 'Export CSV'}</Button>
  </div>
  <div className="admin-stats">
   {([['Total', stats.all], ['New', stats.new], ['On the list', stats.confirmed], ['Not this time', stats.waitlist], ['Marketing opt-in', stats.marketing]] as const).map(([label, value]) =>
    <div key={label} className="adm-glass admin-stat"><span className="admin-label text-muted-foreground">{label}</span><strong>{value.toLocaleString()}</strong></div>)}
  </div>
  <div className="admin-filters">
   <label className="admin-search"><Search aria-hidden="true"/><input aria-label="Search guests" placeholder="Search name, email, phone or Instagram" value={q} onChange={e => setQ(e.target.value)}/></label>
   <div className="admin-tabs">{(['all', 'new', 'confirmed', 'waitlist'] as const).map(s => <button key={s} type="button" aria-pressed={status === s} onClick={() => { setStatus(s); setPage(0); }}>{s === 'all' ? 'All' : STATUS_LABEL[s]}</button>)}</div>
  </div>
  <div className="adm-glass admin-table-wrap">
   {!loading && rows.length === 0 ? <div className="admin-empty"><Inbox strokeWidth={1.2}/><h2>{search || status !== 'all' ? 'No matching guests' : 'No pre-registrations yet'}</h2><p>{search || status !== 'all' ? 'Try another search or filter.' : 'Guests appear here the moment they complete the form on the live page.'}</p></div> :
   <table className="admin-table">
    <thead><tr><th>Guest</th><th className="hide-sm">Contact</th><th className="hide-md">Vibe</th><th className="hide-md">Received</th><th>Status</th></tr></thead>
    <tbody>{rows.map(r => <tr key={r.id} onClick={() => setOpen(r)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') setOpen(r); }}>
     <td><strong>{r.first_name} {r.last_name}</strong><small>{r.nationality}</small></td>
     <td className="hide-sm">{r.email}<small>{r.dial_code} {r.phone} · {r.channel}</small></td>
     <td className="hide-md">{r.moment}<small>{r.music.join(', ')}</small></td>
     <td className="hide-md">{new Date(r.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
     <td><span className={`admin-status status-${r.status}`}>{STATUS_LABEL[r.status as Status]}</span></td>
    </tr>)}</tbody>
   </table>}
  </div>
  <div className="admin-pager"><span className="admin-label text-muted-foreground">{total.toLocaleString()} guests · page {page + 1} of {pages}</span>
   <div className="flex gap-2"><Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button><Button variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(p => p + 1)}>Next</Button></div></div>
  <Dialog open={Boolean(open)} onOpenChange={o => { if (!o) setOpen(null); }}>
   <DialogContent className="admin-scope admin-modal">{open && (() => { const i = rows.findIndex(r => r.id === open.id); return <GuestDetail key={open.id} row={open} position={`${i + 1} of ${rows.length}`} onPrev={i > 0 ? () => setOpen(rows[i - 1]) : undefined} onNext={i >= 0 && i < rows.length - 1 ? () => setOpen(rows[i + 1]) : undefined} onUpdate={patch => update(open, patch)} onDelete={() => remove(open)}/>; })()}</DialogContent>
  </Dialog>
 </div>;
}

function GuestDetail({ row, position, onPrev, onNext, onUpdate, onDelete }: { row: Row; position: string; onPrev?: () => void; onNext?: () => void; onUpdate: (patch: Partial<Pick<Row, 'status' | 'notes'>>) => void; onDelete: () => void }) {
 const [notes, setNotes] = useState(row.notes);
 const items: [string, string][] = [
  ['Email', row.email], ['Mobile', `${row.dial_code} ${row.phone}`], ['Best channel', row.channel], ['Instagram', row.instagram ? `@${row.instagram}` : '—'],
  ['Nationality', row.nationality], ['Lives in', row.residence || '—'],
  ['Moment', row.moment], ['Music', row.music.join(', ')], ['Movement', row.move], ['Company', row.party], ['Occasion', row.occasion || '—'], ['Occasion date', row.occasion_date ?? '—'],
  ['Marketing opt-in', row.consent_marketing ? 'Yes' : 'No'], ['Received', new Date(row.created_at).toLocaleString()],
  ['Source', [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(' / ') || row.referrer || 'Direct'],
 ];
 useEffect(() => {
  const h = (e: KeyboardEvent) => { if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return; if (e.key === 'ArrowLeft') onPrev?.(); if (e.key === 'ArrowRight') onNext?.(); };
  window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
 }, [onPrev, onNext]);
 return <>
  <DialogHeader><div className="flex items-center justify-between pr-8"><p className="admin-label text-primary">/ Guest</p>
   <div className="flex items-center gap-2"><span className="admin-label text-muted-foreground">{position}</span><Button variant="outline" size="icon" aria-label="Previous guest" disabled={!onPrev} onClick={onPrev}><ChevronLeft/></Button><Button variant="outline" size="icon" aria-label="Next guest" disabled={!onNext} onClick={onNext}><ChevronRight/></Button></div></div>
   <DialogTitle className="text-3xl">{row.first_name} {row.last_name}</DialogTitle><DialogDescription>Pre-registered guest details and answers.</DialogDescription></DialogHeader>
  <div className="admin-tabs my-2">{(['new', 'confirmed', 'waitlist'] as const).map(s => <button key={s} type="button" aria-pressed={row.status === s} onClick={() => onUpdate({ status: s })}>{STATUS_LABEL[s]}</button>)}</div>
  <dl className="admin-detail">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
  <label className="admin-notes"><span className="admin-label text-muted-foreground">Private notes</span><textarea rows={4} maxLength={2000} value={notes} onChange={e => setNotes(e.target.value)}/></label>
  <div className="flex items-center justify-between gap-3 mt-3">
  <Button className="soar-button" disabled={notes === row.notes} onClick={() => onUpdate({ notes })}>Save notes</Button>
  <AlertDialog>
   <AlertDialogTrigger asChild><Button variant="outline" className="text-destructive"><Trash2/>Delete registration</Button></AlertDialogTrigger>
   <AlertDialogContent className="admin-scope">
    <AlertDialogHeader><AlertDialogTitle>Delete {row.first_name} {row.last_name}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the registration. Use it for test entries; it can't be undone.</AlertDialogDescription></AlertDialogHeader>
    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
  </div>
  </>;
}
