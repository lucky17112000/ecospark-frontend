"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  LeafIcon,
  LightbulbIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ZapIcon,
  TreePineIcon,
  StarIcon,
  MailIcon,
  SearchIcon,
  PencilLineIcon,
  RocketIcon,
  HeartIcon,
  GlobeIcon,
  RecycleIcon,
  CloudIcon,
  DropletIcon,
  SunIcon,
  BikeIcon,
  SparklesIcon,
  ChevronRightIcon,
  QuoteIcon,
} from "lucide-react";
import { Footer2 } from "../footer2";
import { useQuery } from "@tanstack/react-query";
import { getLimitedIdea } from "@/services/idea.services";
import { IdeaInfiniteSlider } from "./IdeaInfiniteSlider";
import { getBlogs, GetBlogResponse } from "@/services/blog.service";

// ── hero slider ──────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  { src: "/f229b094-ef88-457d-8c4f-cebe1dd64d7a.jpg", alt: "EcoSpark poster" },
  { src: "/pic2.jpg", alt: "Nature and sustainability" },
  { src: "/pic3.jpg", alt: "Community impact" },
] as const;

// ── existing data ────────────────────────────────────────────────────────────

type MarqueeItem = {
  label: string;
  src?: string;
};

const MARQUEE_ITEMS: MarqueeItem[] = [
  { label: "Clean Energy", src: "/globe.svg" },
  { label: "Plastic-Free", src: "/file.svg" },
  { label: "Recycling", src: "/window.svg" },
  { label: "Tree Planting", src: "/globe.svg" },
  { label: "Water Saving", src: "/file.svg" },
  { label: "Green Transport", src: "/window.svg" },
  { label: "Urban Gardening", src: "/globe.svg" },
  { label: "Community Projects", src: "/file.svg" },
  { label: "Carbon Tracking", src: "/window.svg" },
  { label: "Eco Innovation", src: "/globe.svg" },
];

const getInitial = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : "?";
};

// ── static section data ──────────────────────────────────────────────────────

const STATS = [
  {
    label: "Active Users",
    countTo: 24,
    format: (n: number) => `${n}K+`,
    icon: UsersIcon,
  },
  {
    label: "Projects Funded",
    countTo: 12,
    format: (n: number) => `${(n / 10).toFixed(1)}K+`,
    icon: RocketIcon,
  },
  {
    label: "Satisfaction Rate",
    countTo: 99,
    format: (n: number) => `${n}%`,
    icon: StarIcon,
  },
  {
    label: "Global Clients",
    countTo: 50,
    format: (n: number) => `${n}+`,
    icon: GlobeIcon,
  },
];

// ── count-up hook ─────────────────────────────────────────────────────────────

export function useCountUp(
  target: number,
  duration: number,
  started: boolean,
): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const startMs = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startMs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return count;
}

// ── animated stat card ────────────────────────────────────────────────────────
// Slides in from top (top→bottom) when scrolled into view.
// Numbers count up from 0. Cards appear left→right via JS delay.

function AnimatedStatCard({
  label,
  countTo,
  format,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  countTo: number;
  format: (n: number) => string;
  icon: ComponentType<{ className?: string }>;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(countTo, 2000, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          if (delay > 0) setTimeout(() => setVisible(true), delay);
          else setVisible(true);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center",
        "transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800",
        visible ? "animate-eco-fade-down" : "opacity-0",
      )}
    >
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-heading text-4xl font-bold tabular-nums tracking-tight">
          {format(count)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: LightbulbIcon,
    title: "Share Your Ideas",
    description:
      "Submit your sustainability ideas and let the community vote for the most impactful ones.",
  },
  {
    icon: UsersIcon,
    title: "Community-Powered",
    description:
      "Ideas are curated and ranked by real people who genuinely care about the planet.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Impact",
    description:
      "See how your ideas grow from a simple suggestion to a fully-funded project.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified Projects",
    description:
      "Every funded project is reviewed by our team to ensure real-world impact.",
  },
  {
    icon: ZapIcon,
    title: "Instant Feedback",
    description:
      "Get comments, votes, and engagement from the community within hours of posting.",
  },
  {
    icon: LeafIcon,
    title: "Green Categories",
    description:
      "Browse ideas by category — energy, water, transport, urban farming, and more.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: SearchIcon,
    title: "Discover Ideas",
    description:
      "Browse hundreds of community-submitted sustainability ideas across all categories.",
  },
  {
    step: "2",
    icon: PencilLineIcon,
    title: "Submit Your Idea",
    description:
      "Have a green idea? Share it with the world. Add details, images, and impact goals.",
  },
  {
    step: "3",
    icon: RocketIcon,
    title: "Make an Impact",
    description:
      "Gain community votes, get reviewed, and turn your idea into a funded initiative.",
  },
];

const CATEGORIES = [
  { icon: SunIcon, label: "Clean Energy", count: 128 },
  { icon: RecycleIcon, label: "Recycling", count: 94 },
  { icon: DropletIcon, label: "Water Saving", count: 76 },
  { icon: BikeIcon, label: "Green Transport", count: 112 },
  { icon: TreePineIcon, label: "Tree Planting", count: 85 },
  { icon: CloudIcon, label: "Carbon Tracking", count: 67 },
  { icon: GlobeIcon, label: "Community Projects", count: 143 },
  { icon: LeafIcon, label: "Urban Gardening", count: 91 },
];

const HIGHLIGHTS = [
  {
    title: "Solar-Powered Community Gardens",
    category: "Clean Energy",
    votes: 342,
    author: "Rahim K.",
    description:
      "Install small solar panels at community garden plots to power irrigation pumps and night lighting.",
  },
  {
    title: "Plastic-Free School Lunch Program",
    category: "Recycling",
    votes: 289,
    author: "Sara M.",
    description:
      "Replace single-use plastic in school cafeterias with compostable materials and reusable containers.",
  },
  {
    title: "Urban Rainwater Harvesting",
    category: "Water Saving",
    votes: 214,
    author: "Karim A.",
    description:
      "Install rooftop rainwater collectors in urban apartment blocks to reduce municipal water consumption.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "EcoSpark gave my idea the audience it needed. Within a week, 200 people had voted for my rainwater proposal.",
    name: "Farida Hossain",
    role: "Environmental Engineer",
    rating: 5,
  },
  {
    quote:
      "I love how easy it is to find and support green ideas. The platform is clean, fast, and genuinely motivating.",
    name: "James Nguyen",
    role: "Urban Planner",
    rating: 5,
  },
  {
    quote:
      "Our community group used EcoSpark to gather support for a local tree-planting drive. Amazing tool!",
    name: "Amira Patel",
    role: "Community Activist",
    rating: 5,
  },
];

const ARTICLES = [
  {
    category: "Clean Energy",
    title: "How Solar Microgrids Are Changing Rural Communities",
    date: "Apr 18, 2025",
    description:
      "Small-scale solar installations are enabling off-grid communities to access clean power for the first time.",
  },
  {
    category: "Urban Planning",
    title: "The Rise of Car-Free City Districts",
    date: "Apr 10, 2025",
    description:
      "Cities worldwide are experimenting with pedestrian-only zones — and the results are transformative.",
  },
  {
    category: "Recycling",
    title: "Turning Ocean Plastic Into Building Materials",
    date: "Apr 3, 2025",
    description:
      "Innovative startups are collecting ocean plastic and processing it into low-cost construction blocks.",
  },
];

const FAQS = [
  {
    q: "What is EcoSpark?",
    a: "EcoSpark is a community platform where anyone can share, discover, and support environmental ideas — from small daily habits to large community projects.",
  },
  {
    q: "How do I submit an idea?",
    a: "Create a free account, click 'Create Idea' in your dashboard, and fill in the details. Your idea will be visible to the community after a brief review.",
  },
  {
    q: "Is EcoSpark free to use?",
    a: "Browsing and voting are completely free. Creating an account is also free. Some premium features for project organizers may require a subscription in the future.",
  },
  {
    q: "How are ideas selected for funding?",
    a: "Ideas go through a community voting phase, then an admin review. Ideas with the highest community support and clearest real-world impact are selected.",
  },
  {
    q: "Can I buy or invest in ideas?",
    a: "Yes — once an idea is approved by admins, it can be purchased or funded by community members who want to see it executed.",
  },
  {
    q: "How do I contact the team?",
    a: "You can reach us via the Contact page or email us directly. We aim to respond within 1–2 business days.",
  },
];

// ── page component ───────────────────────────────────────────────────────────

const LandingPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["ideaLimit"],
    queryFn: () => getLimitedIdea(),
  });

  const { data: blogData, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogShow"],
    queryFn: () => getBlogs(),
  });

  const liveIdeas = Array.isArray(data?.data) ? data.data : [];

  const rawBlogData = blogData?.data;
  const allBlogs: GetBlogResponse[] = Array.isArray(rawBlogData)
    ? rawBlogData
    : Array.isArray((rawBlogData as unknown as { data: GetBlogResponse[] })?.data)
      ? (rawBlogData as unknown as { data: GetBlogResponse[] }).data
      : [];
  const featuredBlogs = allBlogs.slice(0, 3);

  // Hero image slider
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setActiveSlide((s) => (s + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* <LandingNavbar /> */}

      <main>
        {/* ── 1. Hero ── */}
        <section className="relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute inset-0 select-none">
            <div className="absolute -top-40 -right-40 size-125 animate-pulse rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/25 animation-duration-[6s]" />
            <div className="absolute bottom-0 -left-20 size-80 animate-pulse rounded-full bg-teal-50/90 blur-2xl dark:bg-teal-900/15 animation-duration-[9s] delay-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 animate-pulse rounded-full bg-emerald-50/30 blur-3xl dark:bg-emerald-900/10 animation-duration-[12s] delay-700 hidden lg:block" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:min-h-[65vh] lg:items-center">
            <div className="grid w-full items-center gap-12 lg:grid-cols-2">
              {/* Left: copy */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 animate-eco-fade-up animate-delay-100">
                  <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <SparklesIcon className="mr-1.5 size-3" />
                    Sustainable ideas, shared
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Community-powered
                  </Badge>
                </div>

                <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-eco-fade-up animate-delay-200">
                  Spark eco-friendly ideas that turn into{" "}
                  <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
                    real impact.
                  </span>
                </h1>

                <p className="max-w-lg text-lg text-muted-foreground animate-eco-fade-up animate-delay-300">
                  Discover, share, and support environmental ideas — from small
                  daily habits to community projects that change the world.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row animate-eco-fade-up animate-delay-400">
                  <Link
                    href="/idea"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
                    )}
                  >
                    Explore Ideas
                    <ArrowRightIcon
                      className="ml-2 size-4"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href="/register"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Create an Account
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-muted-foreground animate-eco-fade-up animate-delay-500">
                  <span className="flex items-center gap-1.5">
                    <UsersIcon className="size-4 text-emerald-600" />
                    18,000+ members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LightbulbIcon className="size-4 text-emerald-600" />
                    2,400+ ideas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <StarIcon className="size-4 text-emerald-600" />
                    Free to join
                  </span>
                </div>
              </div>

              {/* Right: card (existing) */}
              <div className="relative animate-eco-fade-in animate-delay-400">
                <div className="pointer-events-none absolute -inset-6 hidden md:block">
                  <div className="absolute top-6 left-10 size-28 rounded-full border border-emerald-200 bg-emerald-50/40 animate-spin animation-duration-[18s]" />
                  <div className="absolute bottom-8 right-10 size-24 rounded-full border border-emerald-200 bg-emerald-50/40 animate-pulse" />
                </div>

                <Card className="relative overflow-hidden shadow-xl shadow-emerald-600/5 ring-emerald-100 dark:ring-emerald-900/30">
                  <div className="relative grid gap-4 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Featured poster
                        </p>
                        <p className="font-heading text-lg font-semibold">
                          Start your green journey
                        </p>
                      </div>
                      <Badge className="animate-eco-float bg-emerald-600 text-white">
                        New
                      </Badge>
                    </div>

                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border bg-muted/30">
                      {/* React-controlled crossfade slider with Ken Burns zoom */}
                      {HERO_SLIDES.map((slide, idx) => (
                        <Image
                          key={slide.src}
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={cn(
                            "object-cover animate-eco-ken-burns",
                            "transition-opacity duration-1000 ease-in-out",
                            idx === activeSlide ? "opacity-100" : "opacity-0",
                          )}
                          priority={idx === 0}
                        />
                      ))}

                      {/* Gradient overlay + badges + dot indicators */}
                      <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/50 via-black/10 to-transparent p-3">
                        <div className="flex items-end justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm">
                              Ideas
                            </Badge>
                            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm">
                              Community
                            </Badge>
                            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm">
                              Impact
                            </Badge>
                          </div>
                          {/* Dot indicators */}
                          <div className="flex shrink-0 items-center gap-1.5">
                            {HERO_SLIDES.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-300 ease-out",
                                  i === activeSlide
                                    ? "w-5 bg-white shadow-sm"
                                    : "w-1.5 bg-white/50 hover:bg-white/75",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Marquee ── */}
        <section className="border-y bg-muted/20">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Trending topics
                </p>
                <p className="font-heading text-lg font-semibold">
                  Change your nature, change the world.
                </p>
              </div>
              <Badge variant="outline" className="self-start sm:self-auto">
                Live feed
              </Badge>
            </div>

            <div className="eco-marquee mt-4 overflow-hidden rounded-2xl border bg-background shadow-sm">
              <div className="eco-marquee-track flex w-max items-center gap-2 p-3">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                  <span
                    key={`${item.label}-${idx}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground",
                      "cursor-default transition-transform will-change-transform hover:-translate-y-0.5 hover:scale-[1.02]",
                    )}
                  >
                    {item.src ? (
                      <img
                        src={item.src}
                        alt={item.label}
                        className="size-7 shrink-0 rounded-full border bg-muted object-cover sm:size-8"
                        loading="lazy"
                      />
                    ) : (
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted text-[0.7rem] font-semibold text-muted-foreground sm:size-8">
                        {getInitial(item.label)}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Stats ── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {STATS.map(({ label, countTo, format, icon }, idx) => (
                <AnimatedStatCard
                  key={label}
                  label={label}
                  countTo={countTo}
                  format={format}
                  icon={icon}
                  delay={idx * 150}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Features ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                Why EcoSpark?
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Everything you need to drive change
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-200">
                A powerful platform built for anyone who wants to contribute to
                a more sustainable future.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800"
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-heading mb-2 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. How It Works ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 animate-eco-fade-up animate-delay-200">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                How it works
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                From idea to impact in 3 steps
              </h2>
            </div>

            <div className="relative grid gap-10 sm:grid-cols-3">
              {/* Connector line */}
              <div className="absolute top-10 left-[25%] right-[25%] hidden h-px bg-linear-to-r from-transparent via-emerald-300 to-transparent sm:block" />

              {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
                <div
                  key={step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 inline-flex size-20 items-center justify-center rounded-2xl border-2 border-emerald-100 bg-background shadow-md dark:border-emerald-900">
                    <Icon className="size-8 text-emerald-600 dark:text-emerald-400" />
                    <span className="absolute -top-2.5 -right-2.5 inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-sm">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
                )}
              >
                Get Started Free
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. Categories ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                Categories
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Explore by topic
              </h2>
              <p className="mt-4 text-muted-foreground">
                Find ideas in the area you care about most.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {CATEGORIES.map(({ icon: Icon, label, count }) => (
                <Link
                  key={label}
                  href="/idea"
                  className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {count} ideas
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Live Ideas Slider ── */}
        <section className="border-t py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-3 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                  {/* Pulsing live indicator */}
                  <span className="relative mr-2 inline-flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Live from the community
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Ideas flowing in right now
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real submissions from the community · 
                </p>
              </div>
              <Link
                href="/idea"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "shrink-0 gap-1.5",
                )}
              >
                Browse all ideas
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <IdeaInfiniteSlider
              ideas={liveIdeas}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* ── 8. Community Highlights (static top-voted) ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-3 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                  Community highlights
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Top-voted ideas this week
                </h2>
              </div>
              <Link
                href="/idea"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "shrink-0 gap-1.5",
                )}
              >
                View all ideas
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHTS.map(
                ({ title, category, votes, author, description }) => (
                  <Card
                    key={title}
                    className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-emerald-200 dark:hover:ring-emerald-800"
                  >
                    <CardContent className="flex flex-1 flex-col gap-3 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <HeartIcon className="size-3.5 fill-emerald-100 stroke-emerald-600 dark:fill-emerald-900 dark:stroke-emerald-400" />
                          {votes}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold leading-snug transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {title}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                      <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-[0.65rem] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                          {getInitial(author)}
                        </span>
                        {author}
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── 8. Testimonials ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                Testimonials
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by eco-changemakers
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map(({ quote, name, role, rating }) => (
                <div
                  key={name}
                  className="flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <QuoteIcon className="mb-4 size-8 text-emerald-200 dark:text-emerald-800" />
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="mt-5 border-t pt-4">
                    <div className="mb-2 flex items-center gap-0.5">
                      {Array.from({ length: rating }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className="size-3.5 fill-emerald-400 stroke-emerald-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. Blog / Articles ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-3 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                  Latest articles
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  From the EcoSpark blog
                </h2>
              </div>
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "shrink-0 gap-1.5",
                )}
              >
                View all posts
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogsLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-card overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                      <div className="h-px bg-border mt-2" />
                      <div className="flex items-center gap-2 pt-1">
                        <div className="size-6 rounded-full bg-muted" />
                        <div className="h-3 bg-muted rounded w-24" />
                      </div>
                    </div>
                  </div>
                ))}

              {!blogsLoading &&
                (featuredBlogs.length > 0 ? featuredBlogs : ARTICLES.map((a) => ({
                  id: a.title,
                  title: a.title,
                  content: a.description,
                  authorName: "EcoSpark Team",
                } as GetBlogResponse))).map((blog, i) => {
                  const authorName =
                    blog.authorName ?? blog.author?.name ?? "EcoSpark Team";
                  const preview =
                    blog.content?.length > 130
                      ? blog.content.slice(0, 130) + "…"
                      : blog.content;
                  return (
                    <Card
                      key={blog.id ?? i}
                      className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-800"
                    >
                      <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100 transition-all duration-300 group-hover:from-emerald-100 group-hover:to-emerald-200 dark:from-emerald-950/50 dark:to-emerald-900/30 dark:group-hover:from-emerald-900/60 dark:group-hover:to-emerald-800/40">
                        <LeafIcon className="size-16 text-emerald-300 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-400 dark:text-emerald-700 dark:group-hover:text-emerald-600" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-emerald-600/90 text-white backdrop-blur-sm border-0 text-xs">
                            Blog
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="font-heading font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {blog.title}
                        </h3>
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {preview}
                        </p>
                        <div className="flex items-center justify-between border-t pt-3">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.65rem] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                              {authorName.slice(0, 1).toUpperCase()}
                            </span>
                            <span className="truncate max-w-[120px]">{authorName}</span>
                          </span>
                          <Link
                            href="/blog"
                            className="flex items-center gap-1 text-xs font-medium text-emerald-600 transition-all hover:gap-2 dark:text-emerald-400"
                          >
                            Read more <ArrowRightIcon className="size-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ── 10. Newsletter ── */}
        <section className="border-t bg-emerald-50/60 py-20 dark:bg-emerald-950/20 sm:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
            <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <MailIcon className="mr-1.5 size-3" />
              Stay updated
            </Badge>
            <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Get the best eco ideas in your inbox
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join 18,000+ readers who get our weekly digest of the top
              sustainability ideas and news.
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:max-w-xs"
              />
              <button
                type="submit"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "h-11 bg-emerald-600 px-6 text-white hover:bg-emerald-700",
                )}
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* ── 11. FAQ ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                FAQ
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Common questions
              </h2>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm">
              <Accordion multiple={false}>
                {FAQS.map(({ q, a }, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="px-5">
                    <AccordionTrigger className="text-sm font-semibold hover:text-emerald-600 hover:no-underline dark:hover:text-emerald-400">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── 12. CTA ── */}
        <section className="border-t">
          <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-700 py-20 sm:py-28">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
              <LeafIcon className="mx-auto mb-4 size-12 text-emerald-200" />
              <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to make a difference?
              </h2>
              <p className="mb-8 text-lg text-emerald-100">
                Join thousands of changemakers already sharing ideas on
                EcoSpark.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
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
      </main>

      <Footer2
        logo={{
          src: "/globe.svg",
          alt: "EcoSpark",
          title: "EcoSpark",
          url: "/",
        }}
        tagline="Community-driven sustainability, one idea at a time."
        copyright="© 2025 EcoSpark. All rights reserved."
        menuItems={[
          {
            title: "Platform",
            links: [
              { text: "Browse Ideas", url: "/idea" },
              { text: "Submit an Idea", url: "/dashboard/create-idea" },
              { text: "Dashboard", url: "/dashboard" },
              { text: "Categories", url: "/idea" },
            ],
          },
          {
            title: "Company",
            links: [
              { text: "About", url: "/about" },
              { text: "Contact", url: "/contact" },
              { text: "Blog", url: "/about" },
              { text: "Careers", url: "#" },
            ],
          },
          {
            title: "Account",
            links: [
              { text: "Login", url: "/login" },
              { text: "Register", url: "/register" },
              { text: "My Profile", url: "/my-profile" },
            ],
          },
          {
            title: "Social",
            links: [
              { text: "Twitter", url: "#" },
              { text: "Instagram", url: "#" },
              { text: "LinkedIn", url: "#" },
              { text: "GitHub", url: "#" },
            ],
          },
        ]}
        bottomLinks={[
          { text: "Terms of Service", url: "#" },
          { text: "Privacy Policy", url: "#" },
        ]}
      />
    </div>
  );
};

export default LandingPage;
