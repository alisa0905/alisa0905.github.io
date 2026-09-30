"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT_EMAIL } from "@/lib/projects";
import { Flower } from "./Flower";

const SERVICES = ["Brand identity", "Social media", "UI/UX & web", "Print & packaging", "Ad campaign", "Something else"];
const TIMELINES = ["As soon as possible", "Within a month", "In 1–3 months", "Just exploring"];

const field =
  "w-full rounded-2xl border-2 border-ink/10 bg-white px-5 py-4 text-lg text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink";

/**
 * Project enquiry form. There's no server involved: on send it opens the
 * visitor's email app with everything filled in, addressed to Alisa.
 */
export function ContactForm() {
  const [services, setServices] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const subject = `New project enquiry${company ? ` from ${company}` : name ? ` from ${name}` : ""}`;
    const body = [
      `Hi Alisa,`,
      ``,
      String(data.get("message") || "").trim(),
      ``,
      `—`,
      `Name: ${name}`,
      `Email: ${data.get("email")}`,
      company ? `Company: ${company}` : null,
      services.length ? `Looking for: ${services.join(", ")}` : null,
      `Timeline: ${data.get("timeline")}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-5 rounded-[28px] bg-white p-8 sm:p-12"
          >
            <Flower color="#e173ae" className="h-20 w-20" />
            <h2 className="font-display text-5xl leading-none">Almost there!</h2>
            <p className="max-w-md text-lg text-ink/70">
              Your email app should have opened with your message ready to go. Just hit send. If nothing happened, you
              can email me directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <button type="button" onClick={() => setSent(false)} className="font-semibold underline underline-offset-4">
              ← Back to the form
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="grid gap-5 rounded-[28px] bg-white/60 p-5 ring-1 ring-ink/5 backdrop-blur sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold">Your name *</span>
                <input name="name" required autoComplete="name" placeholder="Jane Doe" className={field} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold">Email *</span>
                <input name="email" type="email" required autoComplete="email" placeholder="jane@company.com" className={field} />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Company or brand</span>
              <input name="company" autoComplete="organization" placeholder="Optional" className={field} />
            </label>

            <fieldset className="grid gap-3">
              <legend className="mb-2 text-sm font-bold">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const on = services.includes(s);
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s)}
                      whileTap={{ scale: 0.94 }}
                      className={`rounded-full border-2 px-4 py-2 font-semibold transition-colors ${
                        on ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white text-ink hover:border-ink/40"
                      }`}
                    >
                      {on ? "✓ " : "+ "}
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Timeline</span>
              <select name="timeline" className={`${field} appearance-none`} defaultValue={TIMELINES[1]}>
                {TIMELINES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Tell me about the project *</span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project"
                className={`${field} resize-y`}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, rotate: -1 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-ink px-8 py-4 text-lg font-bold text-cream shadow-[0_6px_0_#e173ae]"
              >
                Send enquiry →
              </motion.button>
              <button type="button" onClick={copy} className="text-sm font-semibold text-ink/60 hover:text-ink">
                {copied ? "Copied!" : `Or copy ${CONTACT_EMAIL}`}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
