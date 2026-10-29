import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/s0ar-logo-terracotta.svg';
import hero from '@/assets/soar-hero-sunset-v3.webp.asset.json';
import sunset from '@/assets/soar-party-stage-sunset.webp.asset.json';
import day from '@/assets/soar-pool-deck-day.webp.asset.json';
import night from '@/assets/soar-twilight-night.webp.asset.json';

const slides = [
 { src: hero.url, caption: 'Where the tide sets the tempo' },
 { src: day.url, caption: 'Sun-soaked escapes, by invitation' },
 { src: sunset.url, caption: 'Golden hour, amplified' },
 { src: night.url, caption: 'A new rhythm after dark' },
];

export const Route = createFileRoute('/auth')({
 validateSearch: (s: Record<string, unknown>): { next?: string } => ({ next: typeof s.next === 'string' ? s.next : undefined }),
 head: () => ({ meta: [
  { title: 'SOAR Ocean Club | Admin Access' },
  { name: 'description', content: 'Sign in to the SOAR pre-registration hub.' },
  { property: 'og:title', content: 'SOAR Ocean Club | Admin Access' },
  { property: 'og:description', content: 'Sign in to the SOAR pre-registration hub.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
 ] }),
 component: AuthPage,
});

function AuthPage() {
 const navigate = useNavigate();
 const { next } = Route.useSearch();
 const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/admin';
 const [mode, setMode] = useState<'signin' | 'signup'>('signin');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [show, setShow] = useState(false);
 const [busy, setBusy] = useState(false);
 const [sent, setSent] = useState<null | { internal: boolean }>(null);
 const [index, setIndex] = useState(0);

 useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: target, replace: true }); }); }, [navigate, target]);
 useEffect(() => { const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000); return () => clearInterval(id); }, []);

 async function submit(e: FormEvent) {
  e.preventDefault(); setBusy(true);
  if (mode === 'signup') {
   const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
   setBusy(false);
   if (error) { toast.error(error.message); return; }
   setSent({ internal: email.trim().toLowerCase().endsWith('@soaroceanclub.com') });
   return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setBusy(false);
  if (error) { toast.error(error.message); return; }
  navigate({ to: target, replace: true });
 }

 return <div className="auth-page">
  <div className="auth-panel">
   <img src={logo} alt="S0AR" className="auth-logo"/>
   <div>
    <p className="auth-eyebrow">/ Admin Access</p>
    {sent ? <>
     <h1 className="auth-title">Check your inbox</h1>
     <p className="auth-note">We sent a confirmation link to <strong>{email}</strong>. {sent.internal ? 'Confirm your email and you’ll have full access to the hub.' : 'After you confirm, an existing admin will review your request — you’ll have access once it’s approved.'}</p>
     <button type="button" className="auth-switch" onClick={() => { setSent(null); setMode('signin'); setPassword(''); }}>Back to sign in</button>
    </> : <>
     <h1 className="auth-title">{mode === 'signin' ? 'Welcome Back' : 'Request Access'}</h1>
     {mode === 'signup' && <p className="auth-note">@soaroceanclub.com addresses get access once their email is confirmed. Other addresses need approval from an admin.</p>}
     <form onSubmit={submit} className="auth-form">
      <Field label="Email"><input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/></Field>
      <Field label="Password"><span className="auth-password">
       <input type={show ? 'text' : 'password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}/>
       <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff strokeWidth={1.5}/> : <Eye strokeWidth={1.5}/>}</button>
      </span></Field>
      <button type="submit" disabled={busy} className="auth-submit">{busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
     </form>
     <button type="button" className="auth-switch" onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
    </>}
   </div>
   <div/>
  </div>
  <div className="auth-media">
   {slides.map((s, i) => <img key={s.src} src={s.src} alt={s.caption} style={{ opacity: i === index ? 1 : 0 }}/>)}
   <div className="auth-media-shade"/>
   <div className="auth-dots">{slides.map((_, i) => <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)}><span data-active={i === index}/></button>)}</div>
  </div>
 </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
 return <label className="auth-field"><span>{label}</span>{children}</label>;
}
