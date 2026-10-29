import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
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
 validateSearch: (s: Record<string, unknown>) => ({ next: typeof s.next === 'string' ? s.next : undefined }),
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
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [busy, setBusy] = useState(false);
 const [index, setIndex] = useState(0);

 useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: target, replace: true }); }); }, [navigate, target]);
 useEffect(() => { const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000); return () => clearInterval(id); }, []);

 async function submit(e: FormEvent) {
  e.preventDefault(); setBusy(true);
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
    <h1 className="auth-title">Welcome Back</h1>
    <form onSubmit={submit} className="auth-form">
     <Field label="Email"><input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/></Field>
     <Field label="Password"><input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/></Field>
     <button type="submit" disabled={busy} className="auth-submit">{busy ? 'Please wait…' : 'Sign In'}</button>
    </form>
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
