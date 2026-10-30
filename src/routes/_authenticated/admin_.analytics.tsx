import { createFileRoute, useRouter } from '@tanstack/react-router';
import { RefreshCw, BarChart3 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { loadAnalyticsRows } from '@/lib/registration-analytics-query';
import { summarizeRegistrations, type Breakdown } from '@/lib/registration-analytics';

export const Route = createFileRoute('/_authenticated/admin_/analytics')({
 validateSearch: (search: Record<string, unknown>): { segment: 'all' | 'confirmed' | 'waitlist' | 'new' } => ({
  segment: search.segment === 'confirmed' || search.segment === 'waitlist' || search.segment === 'new' ? search.segment : 'all',
 }),
 loader: () => loadAnalyticsRows(),
 head: () => ({ meta: [
  { title: 'SOAR Ocean Club | Registration Analytics' },
  { name: 'description', content: 'SOAR guest preferences, demographics, experience demand and curation results.' },
  { property: 'og:title', content: 'SOAR Ocean Club | Registration Analytics' },
  { property: 'og:description', content: 'Guest preferences and curation insights for the SOAR team.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
 ] }),
 pendingComponent: () => <AdminShell><div className="admin-page"><p className="admin-label text-muted-foreground" role="status">Loading analytics…</p></div></AdminShell>,
 errorComponent: ({ error }) => <AdminShell><AnalyticsError message={error.message}/></AdminShell>,
 notFoundComponent: () => <AdminShell><div className="admin-page">Analytics unavailable.</div></AdminShell>,
 component: AnalyticsPage,
});

function AnalyticsError({ message }: { message: string }) {
 const router = useRouter();
 return <div className="admin-page space-y-4" role="alert"><h1>Analytics unavailable</h1><p>{message}</p><Button variant="outline" onClick={() => router.invalidate()}><RefreshCw/>Try again</Button></div>;
}

function BreakdownPanel({ title, data, note, tone = 'primary' }: { title: string; data: Breakdown; note?: string; tone?: 'primary' | 'secondary' }) {
 return <article className={`analytics-panel analytics-tone-${tone}`}><header><h3>{title}</h3>{note && <span>{note}</span>}</header>
  {data.length ? <ul className="analytics-breakdown">{data.map(item => <li key={item.label}>
   <div><span>{item.label}</span><span className="analytics-value"><strong>{item.count.toLocaleString()}</strong><small>{item.percent.toFixed(1)}%</small></span></div>
   <progress max={100} value={item.percent} aria-label={`${item.label}: ${item.count} guests, ${item.percent.toFixed(1)} percent`}/>
  </li>)}</ul> : <p className="analytics-no-data">No responses in this group.</p>}
 </article>;
}

function AnalyticsPage() {
 const rows = Route.useLoaderData();
 const { segment } = Route.useSearch();
 const navigate = Route.useNavigate();
 const router = useRouter();
 const all = summarizeRegistrations(rows);
 const selected = summarizeRegistrations(segment === 'all' ? rows : rows.filter(row => row.status === segment));
 const percent = (count: number) => `${(all.total ? count / all.total * 100 : 0).toFixed(1)}%`;
 const consentPercent = (count: number) => `${(selected.total ? count / selected.total * 100 : 0).toFixed(1)}%`;
 const timeline = selected.timeline.map(item => ({...item, label: new Date(`${item.label}-01T12:00:00Z`).toLocaleDateString('en', {month:'short', year:'numeric', timeZone:'UTC'})}));
 return <AdminShell><div className="admin-page analytics-page">
  <div className="admin-page-head"><div><p className="admin-label text-primary">/ Guest intelligence</p><h1>Analytics</h1></div><Button variant="outline" onClick={() => router.invalidate()}><RefreshCw/>Refresh</Button></div>
  <div className="admin-stats">
   {([
    ['Total registrations', all.total.toLocaleString(), 'Completed submissions'],
    ['On the list', percent(all.confirmed), `${all.confirmed.toLocaleString()} guests`],
    ['Not this time', percent(all.waitlist), `${all.waitlist.toLocaleString()} guests`],
    ['Pending review', percent(all.pending), `${all.pending.toLocaleString()} guests`],
    ['Marketing opt-in', percent(all.marketing), `${all.marketing.toLocaleString()} guests`],
   ] as const).map(([label,value,detail]) => <div className="adm-glass admin-stat" key={label}><span className="admin-label text-muted-foreground">{label}</span><strong>{value}</strong><small>{detail}</small></div>)}
  </div>
  <div className="analytics-section-head"><h2>Guest profile</h2><div className="admin-tabs" aria-label="Curation group">{(['all','confirmed','waitlist','new'] as const).map(value => <Button variant="ghost" size="sm" key={value} aria-pressed={segment === value} onClick={() => navigate({ search: { segment: value } })}>{value === 'all' ? 'All registrants' : value === 'confirmed' ? 'On the list' : value === 'waitlist' ? 'Not this time' : 'Pending'}</Button>)}</div><span className="admin-label text-muted-foreground">{selected.total.toLocaleString()} guests</span></div>
  {selected.total === 0 ? <div className="admin-empty analytics-empty"><BarChart3 strokeWidth={1.2}/><h2>No responses in this group yet</h2></div> : <>
   <div className="analytics-trend"><div className="analytics-section-head"><h2>Registration activity</h2><span className="admin-label text-muted-foreground">Daily submissions · UTC</span></div>
    <div className="analytics-chart" role="img" aria-label={`Daily registration activity across ${selected.daily.length} days`}><ResponsiveContainer width="100%" height="100%"><AreaChart data={selected.daily} margin={{top:12,right:12,bottom:0,left:-24}}>
     <CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="label" tickFormatter={value => value.slice(5)} tick={{fill:'var(--muted-foreground)',fontSize:12}} minTickGap={28}/><YAxis allowDecimals={false} tick={{fill:'var(--muted-foreground)',fontSize:12}}/>
     <Tooltip contentStyle={{background:'var(--background)',borderColor:'var(--border)',color:'var(--foreground)'}}/><Area type="monotone" dataKey="count" name="Registrations" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.12} strokeWidth={2} dot={{r:3}}/>
    </AreaChart></ResponsiveContainer></div>
   </div>
   <section className="analytics-section"><div className="analytics-section-head"><h2>Rhythm & company</h2><span className="admin-label text-muted-foreground">Step 2</span></div><div className="analytics-grid">
    <BreakdownPanel title="Preferred moment" data={selected.moment}/><BreakdownPanel title="Music preferences" data={selected.music} note="Up to two answers per guest" tone="secondary"/>
    <BreakdownPanel title="Movement & energy" data={selected.move}/><BreakdownPanel title="Group dynamics" data={selected.party} tone="secondary"/>
   </div></section>
   <section className="analytics-section"><div className="analytics-section-head"><h2>Demographics & contact</h2><span className="admin-label text-muted-foreground">Step 1</span></div><div className="analytics-grid analytics-grid-three">
    <BreakdownPanel title="Nationalities" data={selected.nationality.slice(0,5)} note="Top 5"/>
    <BreakdownPanel title="Countries of residence" data={selected.residence.slice(0,5)} note="Top 5 · optional" tone="secondary"/>
    <BreakdownPanel title="Preferred contact channel" data={selected.channel}/>
   </div></section>
   <section className="analytics-section"><div className="analytics-section-head"><h2>Experience demand</h2><span className="admin-label text-muted-foreground">Step 2</span></div><div className="analytics-grid">
    <BreakdownPanel title="Experience dates" data={timeline} note={`${selected.datesProvided} provided · ${selected.total - selected.datesProvided} unspecified`} tone="secondary"/>
    <BreakdownPanel title="Occasions" data={selected.occasion} note="Optional"/>
   </div></section>
   <section className="analytics-section"><div className="analytics-section-head"><h2>Consent</h2><span className="admin-label text-muted-foreground">Step 3</span></div><div className="analytics-consent">{([
    ['23 or over',selected.adult],['Onboard policy',selected.policy],['Privacy consent',selected.privacy],['Marketing opt-in',selected.marketing],
   ] as const).map(([label,count]) => <div key={label}><span>{label}</span><strong>{consentPercent(count)}</strong><small>{count} of {selected.total} guests</small></div>)}</div></section>
  </>}
 </div></AdminShell>;
}