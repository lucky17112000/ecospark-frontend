"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── static data ───────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    icon: MailIcon,
    label: "Email",
    value: "hello@ecospark.com",
    href: "mailto:hello@ecospark.com",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPinIcon,
    label: "Location",
    value: "123 Green Street, San Francisco, CA 94102",
    href: undefined,
  },
  {
    icon: GlobeIcon,
    label: "Website",
    value: "www.ecospark.com",
    href: "#",
  },
];

const BUSINESS_HOURS = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 24 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputBase =
    "h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b ">
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute -top-40 -right-32 size-96 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20" />
          <div className="absolute bottom-0 -left-24 size-72 rounded-full bg-teal-50/80 blur-2xl dark:bg-teal-900/10" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:min-h-[40vh] lg:flex lg:items-center">
          <div className="max-w-2xl space-y-5">
            <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
              <SparklesIcon className="mr-1.5 size-3" />
              Get in touch
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-eco-fade-up animate-delay-200">
              We&apos;d love to{" "}
              <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
                hear from you.
              </span>
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground animate-eco-fade-up animate-delay-300">
              Have a question, a great eco idea, or just want to say hello? Drop
              us a message and we&apos;ll get back to you within 1–2 business
              days.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground animate-eco-fade-up animate-delay-400">
              <span className="flex items-center gap-1.5">
                <MailIcon className="size-4 text-emerald-600" />
                hello@ecospark.com
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4 text-emerald-600" />
                Mon–Fri, 9 AM – 6 PM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* ── Contact Form ── */}
            <div className="lg:col-span-2 animate-eco-fade-up animate-delay-200">
              <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="font-heading mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                  Send us a message
                </h2>

                {submitted ? (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
                    <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <SendIcon className="size-5" />
                    </div>
                    <p className="font-heading text-lg font-semibold">
                      Message sent!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Thanks for reaching out. We&apos;ll be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={inputBase}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={inputBase}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell us more about your question or idea..."
                        className={cn(
                          inputBase,
                          "h-auto resize-none py-3 leading-relaxed",
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
                      )}
                    >
                      <SendIcon className="mr-2 size-4" />
                      Send Message
                      <ArrowRightIcon className="ml-2 size-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              {/* Contact info */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm animate-eco-fade-up animate-delay-300">
                <h2 className="font-heading mb-5 text-lg font-semibold">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-0.5 text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business hours */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm animate-eco-fade-up animate-delay-400">
                <h2 className="font-heading mb-4 text-lg font-semibold">
                  Business Hours
                </h2>
                <div className="space-y-2.5">
                  {BUSINESS_HOURS.map(({ day, hours }) => (
                    <div
                      key={day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{day}</span>
                      <span
                        className={cn(
                          "font-medium",
                          hours === "Closed" && "text-destructive/70",
                        )}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm animate-eco-fade-up animate-delay-500">
                <h2 className="font-heading mb-4 text-lg font-semibold">
                  Follow Us
                </h2>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                    >
                      {icon}
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t">
        <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-700 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-heading mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl animate-eco-fade-up animate-delay-100">
              Have a green idea to share?
            </h2>
            <p className="mb-6 text-emerald-100 animate-eco-fade-up animate-delay-200">
              Don&apos;t just contact us — join EcoSpark and post your idea to
              the community.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center animate-eco-fade-up animate-delay-300">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-emerald-700 shadow-lg hover:bg-emerald-50",
                )}
              >
                Get Started Free
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
              <Link
                href="/idea"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/40 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Browse Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
