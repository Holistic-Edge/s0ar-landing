import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowDown, Instagram, Waves, Users, Ticket, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { RegistrationForm } from '@/components/soar/registration-form';
import logo from '@/assets/s0ar-logo-white.svg';
import horizontalLogo from '@/assets/s0ar-horizontal-sand.svg';
import hero from '@/assets/soar-sunset.webp.asset.json';
import day from '@/assets/soar-pool-deck-day.webp.asset.json';
import sunset from '@/assets/soar-party-stage-sunset.webp.asset.json';
import night from '@/assets/soar-dusk-led-bar.webp.asset.json';

export const Route = createFileRoute('/')({
 head: () => ({meta:[
  {title:'SOAR Ocean Club — Be First On Board'},
  {name:'description',content:'Something rare is rising on The Eastern Riviera. Discover SOAR Ocean Club and join the first list for opening invitations.'},
  {property:'og:title',content:'SOAR Ocean Club — Be First On Board'},
  {property:'og:description',content:'Sun by day. Paradise at sunset. A new rhythm after dark. Be among the first on board SOAR Ocean Club.'},
  {property:'og:type',content:'website'},
  {name:'twitter:card',content:'summary_large_image'},
 ]}), component: SOARPage,
});
const MOMENTS = [
 {name:'Day',number:'01',time:'11:00 — 16:00',description:'Sun, sea and slow house by the pool.',image:day.url,alt:'SOAR pool deck with sun loungers and the open sea'},
 {name:'Horadiso',number:'02',time:'17:00 — 20:30',description:'The paradise hour. A musician rises from the water as the sky turns.',image:sunset.url,alt:'SOAR stage and ocean deck at sunset'},
 {name:'Night',number:'03',time:'21:00 — MIDNIGHT',description:'Headline DJs, a full deck and the bay lit up around you.',image:night.url,alt:'SOAR illuminated bar and deck after dark'},
];
const POLICIES = [
 {icon:Ticket,title:'Every guest is expected.',text:'Entry is by reservation and registration only, and every guest boards with a wristband.'},
 {icon:Waves,title:'A beautifully balanced crowd.',text:"Our hosts shape each session’s guest list so it reflects a lively mix of guests from Thailand, across Asia and around the world."},
 {icon:Users,title:'Good company, good energy.',text:'Couples and mixed groups are always welcome. Larger groups are welcomed by advance reservation so we can host you properly.'},
 {icon:Sparkles,title:'Adults only.',text:'All guests must be 20 or over.'},
 {icon:ShieldCheck,title:"At our hosts’ discretion.",text:'Pre-registration gives you first access to invitations. Boarding is confirmed by our hosts and is never guaranteed.'},
 {icon:Globe,title:'Why we ask for your nationality',text:'Every journey to SOAR is by boat. As a licensed passenger operation, we keep a full manifest of everyone on board, so we ask for your name and nationality exactly as they appear on your passport or ID. It keeps you safe at sea and makes boarding seamless on the day.'},
];
function SOARPage() {
 const [privacy,setPrivacy] = useState(false);
 return <main>
  <section className="soar-hero" aria-labelledby="hero-title">
   <img className="hero-photo" src={hero.url} alt="SOAR Ocean Club floating on the open water at sunset" fetchPriority="high"/>
   <div className="hero-scrim"/>
   <header className="hero-header"><img src={logo} alt="SOAR Ocean Club"/></header>
   <div className="hero-copy"><h1 id="hero-title">Something rare is rising on<br/><em>The Eastern Riviera.</em></h1></div>
   <div className="hero-invitation"><p className="hero-subline">SOAR Ocean Club opens this November.<br/>Be among the first on board.</p><Button asChild className="soar-button hero-button"><a href="#first-list">Request an invitation<ArrowDown/></a></Button></div>
  </section>
  <section id="idea" className="idea-section section-shell"><p className="eyebrow">A WORLD OF ITS OWN</p><h2>A little further from ordinary.<br/><em>A little closer to the sea.</em></h2><p>A floating ocean club shaped like a manta ray, out on the open water off Na Jomtien. Sun by day, the paradise hour at sunset, the deck alive after dark.</p><p>Pre-register for first access to opening sessions, private invitations and the first word on our headline nights.</p><span className="editorial-line"/></section>
  <section className="moments-section section-shell" aria-labelledby="moments-title"><div className="section-heading"><div><p className="eyebrow">ONE OCEAN. THREE RHYTHMS.</p><h2 id="moments-title">Find your moment.</h2></div><p>However you arrive,<br/>there is a rhythm for you.</p></div><div className="moments-grid">{MOMENTS.map(m => <article className="moment" key={m.name}><div className="moment-image"><img src={m.image} alt={m.alt} loading="lazy"/><span className="moment-number">{m.number}</span><p className="eyebrow">{m.time}</p></div><div className="moment-caption"><h3>{m.name}</h3><p>{m.description}</p></div></article>)}</div></section>
  <section id="first-list" className="registration-section section-shell"><div className="registration-intro"><p className="eyebrow">YOUR FIRST SOAR STARTS HERE</p><h2>Be first <em>on board.</em></h2><p>Some things are worth being early for.</p><p>Tell us a little about yourself. We’ll take care of the invitation.</p><p className="review-disclaimer">Internal design preview. Registration and messages are not connected yet.</p></div><RegistrationForm openPrivacy={() => setPrivacy(true)}/></section>
  <section id="policy" className="policy-section section-shell"><div className="policy-heading"><p className="eyebrow">GOOD COMPANY. GOOD ENERGY.</p><h2>Our Onboard Policy</h2><p>SOAR is a world of its own, out on the open water, and the energy on deck is something we curate with care. To keep every session balanced, vibrant and Playfully Luxurious for all our guests, we keep a considered guest policy from day one.</p></div><div className="policy-grid">{POLICIES.map(p => <article key={p.title}><p.icon strokeWidth={1}/><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></section>
  <footer className="soar-footer section-shell"><div className="footer-top"><img src={horizontalLogo} alt="SOAR Ocean Club"/><Button asChild variant="ghost" size="icon" className="footer-instagram"><a href="https://www.instagram.com/soaroceanclub/" target="_blank" rel="noreferrer" aria-label="Follow SOAR on Instagram" title="Follow SOAR on Instagram"><Instagram strokeWidth={1.5}/></a></Button></div><div className="footer-bottom"><div><span>© 2026 Afloat Company Limited</span><Button variant="link" onClick={() => setPrivacy(true)}>Privacy Notice</Button></div></div></footer>
  <Dialog open={privacy} onOpenChange={setPrivacy}><DialogContent className="privacy-dialog"><p className="eyebrow">AFLOAT COMPANY LIMITED</p><DialogTitle className="privacy-title">Privacy Notice</DialogTitle><DialogDescription>Pre-registration at SOAR Ocean Club</DialogDescription><div className="privacy-copy"><p className="review-disclaimer">Draft for internal review — to be approved before registrations open.</p><h3>Your details, treated with care.</h3><p>Afloat Company Limited uses your name, nationality, contact details and preferences to manage pre-registration, opening invitations and boat boarding. Nationality is required for our passenger manifest.</p><h3>Your choices.</h3><p>Invitations, events and offers are optional. You may withdraw marketing consent without affecting your pre-registration. Access to registration details will be restricted to authorised SOAR team members and service providers supporting these purposes.</p><h3>Your rights.</h3><p>Under Thailand’s PDPA, you may request access, correction or deletion of your personal information and withdraw consent, subject to applicable legal obligations.</p><p>The privacy contact, retention period and service-provider details must be confirmed by Afloat Company Limited before this notice goes live. This internal preview does not store or transmit registration details.</p></div></DialogContent></Dialog>
 </main>;
}
