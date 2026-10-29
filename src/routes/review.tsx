import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
const SCREENS:{key:ReviewScreen;label:string}[] = [{key:'1',label:'1 · Introduction'},{key:'2',label:'2 · Your vibe'},{key:'3',label:'3 · Fine print'},{key:'thank-you',label:'Thank you · On the list'},{key:'waitlist',label:'Thank you · Not this time'}];
function RegistrationReview() {
 const [screen,setScreen] = useState<ReviewScreen>('1');
 const [revision,setRevision] = useState(0);
 const [payload,setPayload] = useState<unknown>();
 const [copied,setCopied] = useState(false);
 const [copyError,setCopyError] = useState(false);
 const [privacy,setPrivacy] = useState(false);
 return <main className="review-page section-shell">
  <header className="review-header"><div><p className="eyebrow">SOAR OCEAN CLUB</p><h1>Registration review</h1><p className="review-disclaimer">Sample details only. This is not a CMS; nothing is saved or sent.</p></div><Button asChild variant="outline"><a href="/">Public page<ArrowUpRight/></a></Button></header>
  <nav aria-label="Registration screen review" className="review-toolbar">{SCREENS.map(item => <Button key={item.key} variant={screen===item.key ? 'default' : 'outline'} aria-pressed={screen===item.key} onClick={() => {setScreen(item.key);setRevision(value => value+1);setPayload(undefined);}}>{item.label}</Button>)}<Button variant="ghost" size="icon" aria-label="Reset sample screen" title="Reset sample screen" onClick={() => {setRevision(value => value+1);setPayload(undefined);}}><RotateCcw/></Button></nav>
  <section className="review-stage"><RegistrationForm key={`${screen}-${revision}`} reviewScreen={screen} onReviewPayload={setPayload} openPrivacy={() => setPrivacy(true)}/></section>
  <Dialog open={privacy} onOpenChange={setPrivacy}><DialogContent className="privacy-dialog"><DialogTitle className="privacy-title">Privacy Notice</DialogTitle><DialogDescription>Pre-registration at SOAR Ocean Club</DialogDescription><p className="review-disclaimer">Draft for internal review — to be approved before registrations open.</p><div className="privacy-copy"><h3>Your details, treated with care.</h3><p>Afloat Company Limited uses your name, nationality, contact details and preferences to manage pre-registration, opening invitations and boat boarding. Nationality is required for our passenger manifest.</p><h3>Your choices.</h3><p>Invitations, events and offers are optional. You may withdraw marketing consent without affecting your pre-registration. Access to registration details will be restricted to authorised SOAR team members and service providers supporting these purposes.</p><h3>Your rights.</h3><p>Under Thailand’s PDPA, you may request access, correction or deletion of your personal information and withdraw consent, subject to applicable legal obligations.</p><p>The privacy contact, retention period and service-provider details must be confirmed by Afloat Company Limited before this notice goes live. This internal preview does not store or transmit registration details.</p></div></DialogContent></Dialog>
  {payload !== undefined && <section className="review-payload"><div className="flex items-center justify-between gap-4"><h2>Submission payload</h2><Button variant="outline" aria-label="Copy submission payload" onClick={async () => {try {await navigator.clipboard.writeText(JSON.stringify(payload,null,2));setCopied(true);setCopyError(false);} catch {setCopyError(true);}}}>{copied ? <Check/> : <Copy/>}{copied ? 'Copied' : 'Copy JSON'}</Button></div><p className="review-disclaimer">Sample preview only. Reloading clears this payload.</p>{copyError && <p role="alert">Copy unavailable. Select the JSON below.</p>}<pre>{JSON.stringify(payload,null,2)}</pre></section>}
 </main>;
}