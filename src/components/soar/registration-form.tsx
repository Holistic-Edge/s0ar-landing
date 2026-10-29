import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { SoarDatePicker } from './soar-date-picker';
import { Button } from '@/components/ui/button';
import { ChannelMark } from './channel-marks';
import { CountryPicker } from './country-picker';
import { CHANNELS, COUNTRIES, DIAL_CODES, QUESTIONS, DEFAULT_DIAL_CODE, canRegister, toggleMusic, validateContact, type Contact } from '@/lib/preregistration';
import { buildRegistrationPayload, readRegistrationAttribution, submitRegistration, vibeSchema } from '@/lib/registration-submission';
import { REVIEW_CONTACT, REVIEW_VIBE, REVIEW_CONSENT, type ReviewScreen } from '@/lib/registration-review';
import manta from '@/assets/sand-manta-ray.svg';

export function RegistrationForm({ openPrivacy, reviewScreen, onReviewPayload }: {openPrivacy: () => void; reviewScreen?:ReviewScreen; onReviewPayload?:(payload:unknown) => void}) {
 const [step, setStep] = useState(reviewScreen === '2' ? 2 : reviewScreen === '3' ? 3 : 1);
 const [contact, setContact] = useState<Contact>(reviewScreen ? {...REVIEW_CONTACT} : {firstName:'',lastName:'',nationality:'',residence:'',dialCode:DEFAULT_DIAL_CODE,phone:'',email:'',channel:'',instagram:''});
 const [errors, setErrors] = useState<Partial<Record<keyof Contact,string>>>({});
 const [vibe, setVibe] = useState<Record<string,string[]>>(reviewScreen ? {...REVIEW_VIBE} : {});
 const [vibeError, setVibeError] = useState(false);
 const [consent, setConsent] = useState(reviewScreen ? {...REVIEW_CONSENT} : {adult:false,policy:false,privacy:false,marketing:false});
 const [submitted, setSubmitted] = useState(reviewScreen === 'thank-you' || reviewScreen === 'waitlist');
 const outcome: 'confirmed' | 'waitlist' = reviewScreen === 'waitlist' ? 'waitlist' : 'confirmed';
 const [submitting, setSubmitting] = useState(false);
 const [submissionError, setSubmissionError] = useState('');
 const submissionId = useRef<string | undefined>(undefined);
 const busy = useRef(false);
 const heading = useRef<HTMLHeadingElement>(null);
 const [consentError, setConsentError] = useState(false);
 const [occasionDate, setOccasionDate] = useState('');
 function field(key: keyof Contact, label: string, optional = false, type = 'text') {
  if (key === 'nationality' || key === 'residence') return <div className="form-field"><span>{label}{optional && <small>Optional</small>}</span><CountryPicker label={label} value={contact[key]} countries={COUNTRIES} invalid={Boolean(errors[key])} onChange={value => {setContact({...contact,[key]:value});setErrors({...errors,[key]:undefined});}}/>{errors[key] && <small className="field-error">{errors[key]}</small>}</div>;
  if (key === 'instagram') {
   const handle = contact.instagram.trim().replace(/^@+/, '');
   const profile = /^[A-Za-z0-9._]{1,30}$/.test(handle) ? `https://www.instagram.com/${encodeURIComponent(handle)}/` : '';
    return <label className="form-field"><span>{label}<small>Optional</small></span><div className="instagram-field"><span aria-hidden="true">@</span><input aria-label={label} value={contact.instagram} autoComplete="off" maxLength={30} aria-invalid={Boolean(errors.instagram)} onChange={e => {setContact({...contact, instagram:e.target.value.replace(/^@+/, '')});setErrors({...errors,instagram:undefined});}}/></div>{errors.instagram && <small className="field-error">{errors.instagram}</small>}{profile && <a className="instagram-profile" href={profile} target="_blank" rel="noreferrer">@{handle}<ArrowUpRight aria-hidden="true"/></a>}</label>;
  }
  return <label className="form-field"><span>{label}{optional && <small>Optional</small>}</span><input aria-label={label} type={type} value={contact[key]} autoComplete={key === 'firstName' ? 'given-name' : key === 'lastName' ? 'family-name' : key === 'email' ? 'email' : 'off'} required={!optional} maxLength={key === 'email' ? 255 : 100} aria-invalid={Boolean(errors[key])} onChange={e => {setContact({...contact,[key]:e.target.value});setErrors({...errors,[key]:undefined});}} />{errors[key] && <small className="field-error">{errors[key]}</small>}</label>;
 }
 function next() {
  if(step === 1) {
   const e = validateContact(contact);
   if(!COUNTRIES.includes(contact.nationality)) e.nationality='Choose a country from the list.';
   setErrors(e); if(Object.keys(e).length) return;
  }
  if(step === 2 && !vibeSchema.safeParse(vibeInput()).success) {setVibeError(true);return;}
  setStep(step + 1); setVibeError(false);
  requestAnimationFrame(() => {heading.current?.focus();heading.current?.scrollIntoView({block:'start'});});
 }
 function vibeInput() {return {moment:vibe.moment?.[0] || '', music:vibe.music || [], move:vibe.move?.[0] || '', group:vibe.group?.[0] || '', occasion:vibe.occasion?.[0] || '', occasionDate};}
 async function submit() {
  if(busy.current) return;
  const contactErrors = validateContact(contact);
  if(Object.keys(contactErrors).length) {setErrors(contactErrors);setStep(1);return;}
  if(!vibeSchema.safeParse(vibeInput()).success) {setVibeError(true);setStep(2);return;}
  if(!canRegister(consent)) {setConsentError(true);return;}
  busy.current=true;setSubmitting(true);setSubmissionError('');
  try {
   submissionId.current ??= crypto.randomUUID();
   const payload = buildRegistrationPayload({contact, vibe:vibeInput(), consent:consent as {adult:true;policy:true;privacy:true;marketing:boolean}, submissionId:submissionId.current, submittedAt:new Date().toISOString(), attribution:readRegistrationAttribution()});
   const result = await submitRegistration(payload);
   if(result.status === 'preview') {onReviewPayload?.(payload);setSubmitted(true);}
  } catch {setSubmissionError('We could not complete this preview. Please try again.');}
  finally {busy.current=false;setSubmitting(false);}
 }
  if(submitted) {
   const confirmed = outcome === 'confirmed';
   return <div id="first-list" className="thank-you" role="status"><span aria-hidden="true" className="thank-manta"/><p className="eyebrow">{confirmed ? 'WELCOME TO SOAR OCEAN CLUB' : 'THANK YOU FOR REACHING OUT'}</p><h3>{confirmed ? <>You’re on the list, {contact.firstName}.</> : <>Thank you, {contact.firstName}.</>}</h3>{confirmed ? <><p>Some things are worth being early for. You’ll be among the first to hear about opening sessions, private invitations and our headline nights.</p><p className="thank-note">Keep an eye on your {contact.channel || 'preferred channel'} as November approaches.</p></> : <><p>Every session at SOAR is curated to keep the deck balanced and the energy just right, so we can’t offer you a place on the first list this time.</p><p className="thank-note">We’ll keep your details close. If a session opens that suits your rhythm, the Captain will be in touch.</p></>}<div className="flex justify-center"><Button asChild className="soar-button"><a href="https://www.instagram.com/soaroceanclub/" target="_blank" rel="noreferrer"><Instagram/>Follow SOAR</a></Button></div></div>;
  }
 return <div id="first-list" className="registration-panel">
  <div className="progress-heading"><span className="eyebrow">STEP {step} OF 3</span><span>{['Introduce yourself','Your vibe','The fine print'][step-1]}</span></div>
  <div className={`manta-progress step-${step}`}><div/><img src={manta} alt=""/></div>
   <h2 ref={heading} tabIndex={-1} className="sr-only">{['Introduce yourself','Your vibe','The fine print'][step-1]}</h2>
   <form noValidate aria-busy={submitting} onSubmit={e => {e.preventDefault(); if(step < 3) next();else void submit();}}>
  {step === 1 && <div className="form-body"><h3>A little introduction.</h3><p className="form-note">Your name, as it appears on your passport or ID.</p><div className="form-grid">{field('firstName','First name')}{field('lastName','Last name')}{field('nationality','Nationality')}{field('residence','Country you live in',true)}</div><label className="form-field"><span>Mobile number</span><div className="phone-row"><CountryPicker label="Country calling code" value={contact.dialCode} countries={DIAL_CODES} invalid={false} onChange={dialCode => setContact({...contact,dialCode})}/><input aria-label="Mobile number" type="tel" maxLength={25} autoComplete="tel-national" value={contact.phone} onChange={e => setContact({...contact,phone:e.target.value})} aria-invalid={Boolean(errors.phone)}/></div>{errors.phone && <small className="field-error">{errors.phone}</small>}</label>{field('email','Email address',false,'email')}<fieldset className="chip-question"><legend>Best way to reach you</legend><div className="chip-row channel-row">{CHANNELS.map((channel, index) => {const brand = (['whatsapp','line','wechat'] as const)[index]; return <Button key={channel} type="button" variant="outline" aria-pressed={contact.channel===channel} className="choice-chip" onClick={() => setContact({...contact,channel})}><>{brand ? <ChannelMark brand={brand}/> : index === 3 ? <Instagram aria-hidden="true" strokeWidth={1.5}/> : <Mail aria-hidden="true" strokeWidth={1.5}/>}</>{channel}</Button>;})}</div>{errors.channel && <small className="field-error">{errors.channel}</small>}</fieldset>{field('instagram','Instagram handle',true)}</div>}
  {step === 2 && <div className="form-body"><h3>Find your rhythm.</h3>{QUESTIONS.map(q => <fieldset key={q.key} className="chip-question"><legend>{q.title}{q.hint && <small>{q.hint}</small>}</legend><div className="chip-row">{q.options.map(option => <Button type="button" variant="outline" className="choice-chip" key={option} aria-pressed={Boolean(vibe[q.key]?.includes(option))} disabled={q.key==='music' && vibe.music?.length===2 && !vibe.music.includes(option)} onClick={() => setVibe({...vibe,[q.key]:q.key==='music' ? toggleMusic(vibe.music||[],option) : vibe[q.key]?.includes(option) ? [] : [option]})}>{vibe[q.key]?.includes(option) && <Check/>}{option}</Button>)}</div></fieldset>)}<div className="form-field"><span>Occasion date <small>Optional</small></span><SoarDatePicker label="Occasion date" value={occasionDate} onChange={setOccasionDate}/></div>{vibeError && <p className="field-error" role="alert">Choose your moment, music, movement and company, and check any occasion date to continue.</p>}</div>}
  {step === 3 && <div className="form-body"><h3>Good energy. Clear intentions.</h3><p className="form-note">A few things before we welcome you on board.</p><div className="consent-list">{(['adult','policy','privacy','marketing'] as const).map(key => <label key={key} className="consent-row"><input type="checkbox" checked={consent[key]} onChange={e => setConsent({...consent,[key]:e.target.checked})}/><span>{key==='adult' ? 'I am 23 years of age or over.' : key==='policy' ? <>I have read the <a href="#policy">SOAR Onboard Policy</a>.</> : key==='privacy' ? <>I agree to Afloat Company Limited collecting and using my details to manage my pre-registration and boarding, as set out in the <Button variant="link" type="button" onClick={openPrivacy}>Privacy Notice</Button>.</> : <>Keep me in the loop with invitations, events and offers. <small>Optional</small></>}</span></label>)}</div><p className="form-note">Pre-registration gives you first access to invitations. Boarding is confirmed by the Captain and is never guaranteed.</p>{consentError && <p className="field-error" role="alert">Confirm the three required acknowledgements to continue.</p>}</div>}
   {submissionError && <p className="field-error" role="alert">{submissionError}</p>}
   <div className="form-actions">{step > 1 ? <Button type="button" variant="ghost" disabled={submitting} onClick={() => setStep(step-1)}><ArrowLeft/>Back</Button> : <span className="form-note">A little closer to the sea.</span>}<Button type="submit" disabled={submitting} className="soar-button">{submitting ? 'Checking…' : step===3 ? 'Count Me In' : 'Continue'}<ArrowRight/></Button></div>
  </form>
 </div>;
}
