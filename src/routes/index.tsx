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

function TeaserPage() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
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
    if (!EMAIL_RE.test(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  }

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
            className="rizz-fade-up italic text-[var(--cream)]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              animationDelay: "0.4s",
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
            }}
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Something Playfully Luxurious
            </span>
            <span className="mt-2 block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              is coming.
            </span>
          </h1>

          {/* Email capture */}
          <div
            className="rizz-fade-up w-full max-w-lg"
            style={{ animationDelay: "1s" }}
          >
            {submitted ? (
              <div
                className="border bg-black/30 p-6 backdrop-blur-md sm:p-8"
                style={{ borderColor: "rgba(249,247,239,0.4)" }}
              >
                <p
                  className="italic text-[var(--cream)]"
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
              <div
                className="border bg-black/30 p-6 backdrop-blur-md sm:p-8"
                style={{ borderColor: "rgba(249,247,239,0.4)" }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-0"
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
                    className="h-14 flex-1 border bg-white/15 px-4 text-sm text-[var(--cream)] backdrop-blur-md outline-none transition-colors placeholder:text-[color:rgba(249,247,239,0.65)] focus:bg-white/20"
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                      borderColor: error
                        ? "var(--copper-rose)"
                        : "rgba(249,247,239,0.6)",
                    }}
                  />
                  <button
                    type="submit"
                    className="h-14 border border-[var(--cream)] bg-[var(--cream)] px-8 text-xs uppercase text-[var(--rizz-bg)] transition-all duration-300 hover:border-[var(--copper-rose)] hover:bg-[var(--copper-rose)] hover:text-[var(--cream)] sm:border-l-0"
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
                  className="mt-4 text-[color:rgba(249,247,239,0.75)]"
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
