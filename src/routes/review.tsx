import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from '@/components/soar/registration-form';
import { type ReviewScreen } from '@/lib/registration-review';

export const Route = createFileRoute('/review')({
 head:() => ({meta:[
  {title:'SOAR Ocean Club | Registration Review'},
  {name:'description',content:'SOAR registration design review with synthetic sample details.'},
  {property:'og:title',content:'SOAR Ocean Club | Registration Review'},
  {property:'og:description',content:'Preview the SOAR registration screens with sample details.'},
  {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary'}, {name:'robots',content:'noindex, nofollow'},
 ]}), component:RegistrationReview,
});
const SCREENS:{key:ReviewScreen;label:string}[] = [{key:'1',label:'1 · Introduction'},{key:'2',label:'2 · Your vibe'},{key:'3',label:'3 · Fine print'},{key:'thank-you',label:'Thank you'}];
function RegistrationReview() {
 const [screen,setScreen] = useState<ReviewScreen>('1');
 const [revision,setRevision] = useState(0);
 const [payload,setPayload] = useState<unknown>();
 const [copied,setCopied] = useState(false);
 const [copyError,setCopyError] = useState(false);
 return <main className="review-page section-shell">
  <header className="review-header"><div><p className="eyebrow">SOAR OCEAN CLUB</p><h1>Registration review</h1><p className="review-disclaimer">Sample details only. This is not a CMS; nothing is saved or sent.</p></div><Button asChild variant="outline"><a href="/">Public page<ArrowUpRight/></a></Button></header>
  <nav aria-label="Registration screen review" className="review-toolbar">{SCREENS.map(item => <Button key={item.key} variant={screen===item.key ? 'default' : 'outline'} aria-pressed={screen===item.key} onClick={() => {setScreen(item.key);setRevision(value => value+1);setPayload(undefined);}}>{item.label}</Button>)}<Button variant="ghost" size="icon" aria-label="Reset sample screen" title="Reset sample screen" onClick={() => {setRevision(value => value+1);setPayload(undefined);}}><RotateCcw/></Button></nav>
  <section className="review-stage"><RegistrationForm key={`${screen}-${revision}`} reviewScreen={screen} onReviewPayload={setPayload} openPrivacy={() => window.open('/#policy','_blank','noopener,noreferrer')}/></section>
  {payload !== undefined && <section className="review-payload"><div className="flex items-center justify-between gap-4"><h2>Submission payload</h2><Button variant="outline" aria-label="Copy submission payload" onClick={async () => {try {await navigator.clipboard.writeText(JSON.stringify(payload,null,2));setCopied(true);setCopyError(false);} catch {setCopyError(true);}}}>{copied ? <Check/> : <Copy/>}{copied ? 'Copied' : 'Copy JSON'}</Button></div><p className="review-disclaimer">Sample preview only. Reloading clears this payload.</p>{copyError && <p role="alert">Copy unavailable. Select the JSON below.</p>}<pre>{JSON.stringify(payload,null,2)}</pre></section>}
 </main>;
}