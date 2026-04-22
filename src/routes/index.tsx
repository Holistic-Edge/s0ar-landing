import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/RIZZ_Manta_Ray_logo-02.png";
import header3 from "@/assets/Header_3.jpg";
import header4 from "@/assets/Header_4.jpg";
import header5 from "@/assets/Header_5.jpg";
import header8 from "@/assets/Header_8.jpg";

const HEADERS = [header3, header4, header5, header8];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIZZ Manta Ray — Coming Soon" },
      {
        name: "description",
        content:
          "Something playfully luxurious is coming to Pattaya. Sign up for early access.",
      },
      { property: "og:title", content: "RIZZ Manta Ray — Coming Soon" },
      {
        property: "og:description",
        content:
          "Something playfully luxurious is coming to Pattaya. Sign up for early access.",
      },
      { property: "og:image", content: header5 },
      { name: "twitter:image", content: header5 },
      { name: "twitter:title", content: "RIZZ Manta Ray — Coming Soon" },
      {
        name: "twitter:description",
        content:
          "Something playfully luxurious is coming to Pattaya. Sign up for early access.",
      },
    ],
  }),
  component: TeaserPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COUNTRY_CODES = [
  { code: "+66", label: "🇹🇭 +66" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+60", label: "🇲🇾 +60" },
  { code: "+81", label: "🇯🇵 +81" },
  { code: "+86", label: "🇨🇳 +86" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
];

type FieldErrors = { name?: boolean; phone?: boolean; email?: boolean };

function TeaserPage() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+66");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Decode-aware preloading; only start rotation once all images are decoded.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      HEADERS.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            const done = () => resolve();
            if (img.decode) {
              img.decode().then(done).catch(done);
            } else {
              img.onload = done;
              img.onerror = done;
            }
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    intervalRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % HEADERS.length);
    }, 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [ready]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/[^\d]/g, "");
    const phoneValid =
      /^[\d\s-]+$/.test(trimmedPhone) &&
      phoneDigits.length >= 6 &&
      phoneDigits.length <= 20;
    const next: FieldErrors = {
      name: !(trimmedName.length > 0 && trimmedName.length <= 100),
      phone: !phoneValid,
      email: !EMAIL_RE.test(email.trim()),
    };
    setErrors(next);
    if (next.name || next.phone || next.email) return;
    setSubmitted(true);
  }

  const inputBaseClass =
    "h-14 w-full rounded-lg border bg-white/20 px-4 text-sm text-[var(--cream)] outline-none transition-colors placeholder:text-[color:rgba(249,247,239,0.8)] focus:bg-white/30";
  const inputBaseStyle: React.CSSProperties = {
    fontFamily: "'Work Sans', sans-serif",
    fontWeight: 300,
    letterSpacing: "0.02em",
  };
  const borderFor = (hasError?: boolean) =>
    hasError ? "var(--rizz-bg)" : "rgba(249,247,239,0.5)";

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--rizz-bg)" }}
    >
      {/* Image stack — all rendered persistently, cross-fade via opacity */}
      <div className="absolute inset-0">
        {HEADERS.map((src, i) => (
          <div
            key={src}
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === active ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Cinematic warm overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(20,12,6,0.4) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(218,162,143,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col items-center px-6 sm:px-10">
        {/* Logo */}
        <div
          className="rizz-fade-up flex w-full justify-center pt-[8vh]"
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src={logo}
            alt="RIZZ Manta Ray"
            className="h-auto w-[140px] sm:w-[160px] md:w-[180px]"
            draggable={false}
          />
        </div>

        {/* Headline + email — vertically centered in remaining space */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-24 text-center sm:gap-10">
          <h1
            className="rizz-fade-up text-[var(--cream)]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              animationDelay: "0.4s",
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
            }}
          >
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Something{" "}
              <span style={{ fontWeight: 500, fontStyle: "italic" }}>
                Playfully Luxurious
              </span>
            </span>
            <span className="mt-2 block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              is coming.
            </span>
          </h1>

          {/* Email capture */}
          <div
            className="rizz-fade-up w-full max-w-lg"
            style={{ animationDelay: "1s" }}
          >
            {submitted ? (
              <div className="rounded-2xl border border-white/20 bg-[#B87261]/85 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
                <p
                  className="text-[var(--cream)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                  }}
                >
                  You&apos;re on the list.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/20 bg-[#B87261]/85 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter your email for early access"
                    aria-label="Email address"
                    className="h-14 flex-1 rounded-lg border bg-white/20 px-4 text-sm text-[var(--cream)] outline-none transition-colors placeholder:text-[color:rgba(249,247,239,0.8)] focus:bg-white/30"
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                      borderColor: error
                        ? "var(--rizz-bg)"
                        : "rgba(249,247,239,0.5)",
                    }}
                  />
                  <button
                    type="submit"
                    className="h-14 rounded-lg bg-[var(--cream)] px-8 text-xs uppercase text-[var(--rizz-bg)] transition-all duration-300 hover:bg-[var(--rizz-bg)] hover:text-[var(--cream)]"
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                    }}
                  >
                    Notify Me
                  </button>
                </form>
                <p
                  className="mt-4 text-[color:rgba(249,247,239,0.9)]"
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Be the first to know when we open.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ambient bottom motion */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div
            className="rizz-ambient h-12 w-px"
            style={{ backgroundColor: "rgba(249,247,239,0.4)" }}
          />
        </div>
      </div>
    </main>
  );
}
