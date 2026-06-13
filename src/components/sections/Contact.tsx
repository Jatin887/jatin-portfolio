"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { person, socials } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

type Status = "idle" | "sending" | "sent" | "error";

// Replace with your real Cal.com / Calendly link.
const BOOKING_URL = "https://cal.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Fully client-side so the site stays static (host anywhere, no server).
  // Delivers via Web3Forms when a public key is set, else opens the mail client.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    try {
      if (key) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: key,
            subject: `Portfolio message from ${form.name}`,
            from_name: form.name,
            email: form.email,
            message: form.message,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to send");
      } else {
        const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
        const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
        window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="section">
      <SectionHeading
        eyebrow="Command Center"
        title={<>Let&apos;s build something <span className="text-gradient-neon">great</span></>}
        subtitle="Open to senior and staff engineering roles. Drop a message, book a call, or grab the resume."
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* Console / form */}
        <div className="relative overflow-hidden rounded-3xl holo-border p-7">
          {/* radar backdrop */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-20">
            <div className="absolute inset-0 rounded-full border border-neon-blue/40" />
            <div className="absolute inset-6 rounded-full border border-neon-blue/30" />
            <div className="absolute inset-12 rounded-full border border-neon-blue/20" />
            <div className="absolute inset-0 origin-center animate-spin-slow" style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(56,189,248,0.4))", borderRadius: "9999px" }} />
          </div>

          <div className="relative">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">channel open</span>
            </div>

            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/15 text-3xl text-neon-green">
                  ✓
                </div>
                <p className="font-display text-xl text-foreground">Message transmitted</p>
                <p className="mt-2 text-sm text-muted">Jatin will get back to you shortly.</p>
                <button onClick={() => setStatus("idle")} className="mt-5 rounded-full glass px-4 py-2 text-sm text-muted hover:text-neon-cyan">
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" htmlFor="name">
                    <input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      placeholder="you@company.com"
                    />
                  </Field>
                </div>
                <Field label="Message" htmlFor="message">
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input resize-none"
                    placeholder="What are you building?"
                  />
                </Field>

                {status === "error" && <p className="text-sm text-neon-pink">{error}</p>}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 text-sm font-semibold text-white shadow-glow-purple disabled:opacity-60"
                  >
                    <span className="relative z-10">{status === "sending" ? "Transmitting…" : "Send Message"}</span>
                  </button>
                  <a
                    href={`mailto:${person.email}`}
                    className="rounded-full glass px-5 py-3 text-sm text-foreground transition hover:bg-white/10"
                  >
                    Or email directly
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Side: links + actions */}
        <div className="space-y-4">
          <div className="rounded-3xl glass p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neon-cyan">Direct channels</h3>
            <div className="space-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-xs text-muted">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl holo-border p-6">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-neon-cyan">Take the next step</h3>
            <div className="flex flex-col gap-2">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white"
              >
                📅 Book a 15-min call
              </a>
              <a
                href={person.resume}
                download
                className="flex items-center justify-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
              >
                ⬇ Download Resume
              </a>
            </div>
            <p className="mt-3 text-center text-xs text-faint">{person.location} · open to remote</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: box-shadow 0.2s;
        }
        :global(.input:focus) {
          box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.6);
        }
        :global(.input::placeholder) {
          color: var(--color-faint);
        }
      `}</style>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
