import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHANNELS, DEFAULT_DIAL_CODE, canRegister, toggleMusic, validateContact, type Contact } from '@/lib/preregistration';
import manta from '@/assets/sand-manta-ray.svg';
import whiteLogo from '@/assets/s0ar-logo-white.svg';

const REGION_CODES = 'AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI KH CM CA CV KY CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU MX FM MD MC MN ME MS MA MZ MM NA NP NL NC NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC UG UA AE GB US UY UZ VU VA VE VN VG VI YE ZM ZW'.split(' ');
const names = new Intl.DisplayNames(['en'], { type: 'region' });
const COUNTRIES = REGION_CODES.map(code => names.of(code) || code).sort();
const DIAL_CODES = ['+66', '+1', '+44', '+61', '+65', '+60', '+81', '+86', '+91', '+971', '+49', '+33', '+82', '+852', '+62', '+63', '+84', '+7', '+27', '+64', '+39', '+34'];
const QUESTIONS = [
 {key:'moment', title:'When do you come alive?', options:['Daytime by the pool', 'Horadiso, the sunset hour', 'After dark']},
 {key:'music', title:'What is playing in your head right now?', hint:'Pick up to two', options:['Deep and soulful house', 'Melodic and progressive', 'Tech house and techno', 'Disco and nu disco', 'Surprise me']},
 {key:'move', title:'How do you like to move?', options:['Front of the dance floor', 'Drink in hand, gently swaying', 'Sunbed and sea views', 'A little of everything']},
 {key:'group', title:'Who would you SOAR with?', options:['My partner', 'A mixed group of friends', "A girls’ day out", "A boys’ day out", 'A celebration with my crew']},
 {key:'occasion', title:'Celebrating something?', hint:'Optional', options:['Birthday', 'Anniversary', 'Engagement', 'Business', 'Just because']},
];
export function RegistrationForm({ openPrivacy }: {openPrivacy: () => void}) {
 const [step, setStep] = useState(1);
 const [contact, setContact] = useState<Contact>({firstName:'',lastName:'',nationality:'',residence:'',dialCode:DEFAULT_DIAL_CODE,phone:'',email:'',channel:'',instagram:''});
 const [errors, setErrors] = useState<Partial<Record<keyof Contact,string>>>({});
 const [vibe, setVibe] = useState<Record<string,string[]>>({});
 const [vibeError, setVibeError] = useState(false);
 const [consent, setConsent] = useState({adult:false,policy:false,privacy:false,marketing:false});
 const [submitted, setSubmitted] = useState(false);
 const [consentError, setConsentError] = useState(false);
 const [occasionDate, setOccasionDate] = useState('');
 function field(key: keyof Contact, label: string, optional = false, type = 'text') {
  return <label className="form-field"><span>{label}{optional && <small>Optional</small>}</span><input aria-label={label} type={type} value={contact[key]} autoComplete={key === 'firstName' ? 'given-name' : key === 'lastName' ? 'family-name' : key === 'email' ? 'email' : 'off'} required={!optional} maxLength={100} aria-invalid={Boolean(errors[key])} list={key === 'nationality' || key === 'residence' ? 'countries' : undefined} onChange={e => {setContact({...contact,[key]:e.target.value});setErrors({...errors,[key]:undefined});}} />{errors[key] && <small className="field-error">{errors[key]}</small>}</label>;
 }
 function next() {
  if(step === 1) {
   const e = validateContact(contact);
   if(!COUNTRIES.includes(contact.nationality)) e.nationality='Choose a country from the list.';
   setErrors(e); if(Object.keys(e).length) return;
  }
  if(step === 2 && QUESTIONS.slice(0,4).some(q => !vibe[q.key]?.length)) {setVibeError(true);return;}
  setStep(step + 1); setVibeError(false);
 }
 async function downloadStory() {
  const canvas = document.createElement('canvas'); canvas.width=1080;canvas.height=1920;
  const ctx=canvas.getContext('2d');if(!ctx) return;
  const styles=getComputedStyle(document.documentElement);
  ctx.fillStyle=styles.getPropertyValue('--primary').trim();ctx.fillRect(0,0,1080,1920);
  const image=new Image();image.src=whiteLogo;await image.decode();
  const width=360;ctx.drawImage(image,360,350,width,width * image.height / image.width);
  ctx.fillStyle=styles.getPropertyValue('--primary-foreground').trim();ctx.textAlign='center';ctx.font='64px Georgia';
  ctx.fillText('I am on the SOAR list.',540,1120);
  const ray=new Image();ray.src=manta;await ray.decode();ctx.drawImage(ray,440,1370,200,200 * ray.height / ray.width);ctx.font='28px sans-serif';ctx.fillText('#SOAROceanClub',540,1250);
  const a=document.createElement('a');a.download='SOAR-first-list-story.png';a.href=canvas.toDataURL('image/png');a.click();
 }
 if(submitted) return <div className="thank-you" role="status"><img src={manta} alt="" className="thank-manta"/><p className="eyebrow">FIRST ON BOARD</p><h3>You are on the list, {contact.firstName}.</h3><p>Keep an eye on your {contact.channel} for your first invitation. Until then, the sea is waiting.</p><p className="review-disclaimer">Internal preview — your details have not been saved and no invitation has been sent.</p><div className="flex flex-wrap justify-center gap-3"><Button asChild className="soar-button"><a href="https://www.instagram.com/soaroceanclub/" target="_blank" rel="noreferrer"><Instagram/>Follow SOAR</a></Button><Button variant="outline" className="soar-button" onClick={downloadStory}><Download/>Story card</Button></div></div>;
 return <div className="registration-panel">
  <datalist id="countries">{COUNTRIES.map(country => <option key={country} value={country}/>)}</datalist>
  <div className="progress-heading"><span className="eyebrow">STEP {step} OF 3</span><span>{['Introduce yourself','Your vibe','The fine print'][step-1]}</span></div>
  <div className={`manta-progress step-${step}`}><div/><img src={manta} alt=""/></div>
  <form noValidate onSubmit={e => {e.preventDefault(); if(step < 3) next();else if(canRegister(consent)) setSubmitted(true);else setConsentError(true);}}>
  {step === 1 && <div className="form-body"><h3>A little introduction.</h3><p className="form-note">Your name, as it appears on your passport or ID.</p><div className="form-grid">{field('firstName','First name')}{field('lastName','Last name')}{field('nationality','Nationality')}{field('residence','Country you live in',true)}</div><label className="form-field"><span>Mobile number</span><div className="phone-row"><select aria-label="Country calling code" value={contact.dialCode} onChange={e => setContact({...contact,dialCode:e.target.value})}>{DIAL_CODES.map(x => <option key={x}>{x}</option>)}</select><input aria-label="Mobile number" type="tel" autoComplete="tel-national" value={contact.phone} onChange={e => setContact({...contact,phone:e.target.value})} aria-invalid={Boolean(errors.phone)}/></div>{errors.phone && <small className="field-error">{errors.phone}</small>}</label>{field('email','Email address',false,'email')}<fieldset className="chip-question"><legend>Best way to reach you</legend><div className="chip-row">{CHANNELS.map(channel => <Button key={channel} type="button" variant="outline" aria-pressed={contact.channel===channel} className="choice-chip" onClick={() => setContact({...contact,channel})}>{contact.channel===channel && <Check/>}{channel}</Button>)}</div>{errors.channel && <small className="field-error">{errors.channel}</small>}</fieldset>{field('instagram','Instagram handle',true)}</div>}
  {step === 2 && <div className="form-body"><h3>Find your rhythm.</h3>{QUESTIONS.map(q => <fieldset key={q.key} className="chip-question"><legend>{q.title}{q.hint && <small>{q.hint}</small>}</legend><div className="chip-row">{q.options.map(option => <Button type="button" variant="outline" className="choice-chip" key={option} aria-pressed={Boolean(vibe[q.key]?.includes(option))} disabled={q.key==='music' && vibe.music?.length===2 && !vibe.music.includes(option)} onClick={() => setVibe({...vibe,[q.key]:q.key==='music' ? toggleMusic(vibe.music||[],option) : vibe[q.key]?.includes(option) ? [] : [option]})}>{vibe[q.key]?.includes(option) && <Check/>}{option}</Button>)}</div></fieldset>)}<label className="form-field"><span>Occasion date <small>Optional</small></span><input type="date" aria-label="Occasion date" value={occasionDate} onChange={e => setOccasionDate(e.target.value)}/></label>{vibeError && <p className="field-error" role="alert">Choose your moment, music, movement and company to continue.</p>}</div>}
  {step === 3 && <div className="form-body"><h3>Good energy. Clear intentions.</h3><p className="form-note">A few things before we welcome you on board.</p><div className="consent-list">{(['adult','policy','privacy','marketing'] as const).map(key => <label key={key} className="consent-row"><input type="checkbox" checked={consent[key]} onChange={e => setConsent({...consent,[key]:e.target.checked})}/><span>{key==='adult' ? 'I am 20 years of age or over.' : key==='policy' ? <>I have read the <a href="#policy">SOAR Onboard Policy</a>.</> : key==='privacy' ? <>I agree to Afloat Company Limited collecting and using my details to manage my pre-registration and boarding, as set out in the <Button variant="link" type="button" onClick={openPrivacy}>Privacy Notice</Button>.</> : <>Keep me in the loop with invitations, events and offers. <small>Optional</small></>}</span></label>)}</div><p className="form-note">Pre-registration gives you first access to invitations. Boarding is confirmed by our hosts and is never guaranteed.</p>{consentError && <p className="field-error" role="alert">Confirm the three required acknowledgements to continue.</p>}</div>}
  <div className="form-actions">{step > 1 ? <Button type="button" variant="ghost" onClick={() => setStep(step-1)}><ArrowLeft/>Back</Button> : <span className="form-note">A little closer to the sea.</span>}<Button type="submit" className="soar-button">{step===3 ? 'Count Me In' : 'Continue'}<ArrowRight/></Button></div>
  </form>
 </div>;
}
