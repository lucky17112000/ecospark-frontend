"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  LeafIcon,
  LightbulbIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { AnimatedStatCard } from "@/components/modules/mission/MissonPage";

// ── static data ──────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: LightbulbIcon,
    title: "Idea Platform",
    description:
      "Submit, discover, and vote on sustainability ideas from across the community.",
  },
  {
    icon: UsersIcon,
    title: "Community Hub",
    description:
      "Connect with like-minded changemakers who genuinely care about the planet.",
  },
  {
    icon: TrendingUpIcon,
    title: "Impact Tracking",
    description:
      "Follow your idea's journey from first submission to real-world execution.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified Projects",
    description:
      "Admin-reviewed projects ensure every funded idea creates genuine impact.",
  },
  {
    icon: GlobeIcon,
    title: "Global Reach",
    description:
      "Ideas from across the world, united by one mission: a greener future.",
  },
  {
    icon: HeartIcon,
    title: "Crowdfunding Support",
    description:
      "Back the projects you believe in and help turn great ideas into action.",
  },
];

const STATS = [
  { label: "Ideas Shared", value: "2,400+", icon: LightbulbIcon },
  { label: "Community Members", value: "18K+", icon: UsersIcon },
  { label: "Projects Funded", value: "320+", icon: RocketIcon },
  { label: "Countries Reached", value: "42+", icon: GlobeIcon },
];

const TEAM = [
  {
    initial: "A",
    name: "Alamin Mustafa",
    role: "Founder & CEO",
    bio: "Passionate about sustainability and technology. Building EcoSpark to make green ideas accessible to everyone.",
  },
  {
    initial: "S",
    name: "Sara Rahman",
    role: "Head of Community",
    bio: "Connecting eco-conscious individuals and helping ideas find the audience they deserve.",
  },
  {
    initial: "K",
    name: "Karim Hossain",
    role: "Lead Engineer",
    bio: "Building the infrastructure that powers thousands of sustainability conversations every day.",
  },
];

const MILESTONES = [
  {
    year: "2023",
    title: "EcoSpark Founded",
    description:
      "Started as a small platform with a big vision: make sustainability ideas shareable and actionable.",
  },
  {
    year: "2023",
    title: "1,000 Members",
    description:
      "Reached our first community milestone just three months after launch.",
  },
  {
    year: "2024",
    title: "First Funded Project",
    description:
      "Community voted and funded the first real-world eco project — an urban tree-planting drive.",
  },
  {
    year: "2025",
    title: "18,000+ Members",
    description:
      "Grew to a global community with ideas from 42+ countries and 320+ funded projects.",
  },
];

// ── page ─────────────────────────────────────────────────────────────────────

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background  animate-eco-fade-up animate-delay-1000">
      <main>
        {/* ── 1. Hero ── */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 select-none ">
            <div className="absolute -top-40 -right-32 size-125 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20" />
            <div className="absolute bottom-0 -left-24 size-80 rounded-full bg-teal-50/80 blur-2xl dark:bg-teal-900/10" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:min-h-[65vh] lg:items-center">
            <div className="grid w-full items-center gap-12 lg:grid-cols-2">
              {/* Left: copy */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 animate-eco-fade-up animate-delay-100">
                  <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <SparklesIcon className="mr-1.5 size-3" />
                    About EcoSpark
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Built for impact
                  </Badge>
                </div>

                <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-eco-fade-up animate-delay-200">
                  We&apos;re on a mission to{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    spark a greener world.
                  </span>
                </h1>

                <p className="max-w-lg text-lg text-muted-foreground animate-eco-fade-up animate-delay-300">
                  EcoSpark is a community-driven platform where anyone can
                  share, discover, and support sustainability ideas — from small
                  daily habits to large-scale eco projects.
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
                    Join the Community
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 animate-eco-fade-up animate-delay-500">
                  {[
                    { label: "Focus", value: "Sustainability" },
                    { label: "Community", value: "Collaborative" },
                    { label: "Outcome", value: "Real Impact" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border bg-card px-4 py-3"
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: image card (existing) */}
              <div className="relative animate-eco-fade-up animate-delay-500">
                <div className="pointer-events-none absolute -inset-6 hidden md:block">
                  <div className="absolute top-8 left-10 size-24 rounded-full border border-emerald-200 bg-emerald-50/40 animation-duration-[22s] animate-spin" />
                  <div className="absolute bottom-10 right-10 size-20 rounded-full border border-emerald-200 bg-emerald-50/40 animate-pulse" />
                </div>

                <Card className="relative overflow-hidden shadow-xl shadow-emerald-600/5 ring-emerald-100 dark:ring-emerald-900/30">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Our story
                        </p>
                        <p className="font-heading text-lg font-semibold">
                          Change your nature, change the world
                        </p>
                      </div>
                      <Badge className="animate-eco-float bg-emerald-600 text-white">
                        Eco
                      </Badge>
                    </div>

                    <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-xl border bg-muted/30">
                      <Image
                        src="/pexels-cottonbro-6565761.jpg"
                        alt="EcoSpark community poster"
                        fill
                        className={cn(
                          "animate-eco-float object-cover opacity-95",
                        )}
                        sizes="(max-width: 1024px) 100vw, 520px"
                        priority
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">Learn</Badge>
                          <Badge variant="secondary">Share</Badge>
                          <Badge variant="secondary">Build</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Mission & Vision ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
                What we believe
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Clear principles that keep us focused
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                Every decision we make is guided by these core values.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {[
                {
                  icon: TargetIcon,
                  label: "Mission",
                  title: "Make sustainability easier",
                  description:
                    "Give everyone a place to find practical ideas and take action without feeling overwhelmed.",
                },
                {
                  icon: EyeIcon,
                  label: "Vision",
                  title: "A community that drives change",
                  description:
                    "Turn good intentions into shared progress through discussion, feedback, and support.",
                },
                {
                  icon: HeartIcon,
                  label: "Values",
                  title: "Simple, honest, impactful",
                  description:
                    "We keep it focused: real ideas, respectful conversations, and visible outcomes.",
                },
              ].map(({ icon: Icon, label, title, description }, idx) => (
                <div
                  key={label}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800",
                    "animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                  )}
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {label}
                  </p>
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

        {/* ── 3. Services ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
                What we offer
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Everything you need to drive green change
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                A platform built for everyone who wants to contribute to a
                sustainable future.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {SERVICES.map(({ icon: Icon, title, description }, idx) => (
                <div
                  key={title}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800 animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                    idx === 3 && "animate-delay-600",
                    idx === 4 && "animate-delay-700",
                    idx === 5 && "animate-delay-800",
                  )}
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

        {/* ── 4. Stats ── */}
        <section className="border-t bg-muted/10 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
                Our impact
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Numbers that speak for themselves
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 animate-eco-fade-up animate-delay-300">
              {/* {STATS.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-bold">{value}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {label}
                    </p>
                  </div>
                </div>
              ))} */}
              <AnimatedStatCard
                label="Countries Reached"
                countTo={150}
                format={(n) => `${Math.round(n)}+`}
                icon={GlobeIcon}
                delay={0 * 150}
              />
              <AnimatedStatCard
                label="Community Members"
                countTo={18000}
                format={(n) => `${n.toLocaleString()}+`}
                icon={UsersIcon}
                delay={1 * 150}
              />
              <AnimatedStatCard
                label="Projects Funded"
                countTo={200}
                format={(n) => `${n}+`}
                icon={RocketIcon}
                delay={2 * 150}
              />
              <AnimatedStatCard
                label="Countries Reached"
                countTo={42}
                format={(n) => `${n}+`}
                icon={GlobeIcon}
                delay={3 * 150}
              />
            </div>
          </div>
        </section>

        {/* ── 5. Team ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
                Our team
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                The people behind EcoSpark
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                A passionate team dedicated to making sustainability accessible
                to everyone.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {TEAM.map(({ initial, name, role, bio }, idx) => (
                <div
                  key={name}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800",
                    "animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                  )}
                >
                  <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-md shadow-emerald-600/20">
                    {initial}
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Journey / Milestones ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-eco-fade-up animate-delay-100">
                Our journey
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                How we got here
              </h2>
            </div>

            <div className="relative animate-eco-fade-up animate-delay-300">
              {/* Vertical timeline line */}
              <div className="absolute left-7.5 top-0 h-full w-px bg-emerald-100 dark:bg-emerald-900/40 sm:left-1/2 sm:-ml-px" />

              <div className="space-y-10">
                {MILESTONES.map(({ year, title, description }, i) => (
                  <div
                    key={year + title}
                    className={cn(
                      "relative flex gap-6 animate-eco-fade-up",
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
                      i === 0 && "animate-delay-100",
                      i === 1 && "animate-delay-200",
                      i === 2 && "animate-delay-300",
                      i === 3 && "animate-delay-400",
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-2 size-4 rounded-full border-2 border-emerald-600 bg-background shadow-sm sm:left-1/2 sm:-ml-2" />

                    <div
                      className={cn(
                        "w-full pl-14 sm:w-1/2 sm:pl-0",
                        i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12",
                      )}
                    >
                      <span className="mb-2 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                        {year}
                      </span>
                      <h3 className="font-heading mt-1 text-base font-semibold">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>

                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. CTA ── */}
        <section className="border-t">
          <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-700 py-20 sm:py-28">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
              <LeafIcon className="mx-auto mb-4 size-12 text-emerald-200 animate-eco-fade-up animate-delay-100" />
              <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl animate-eco-fade-up animate-delay-200">
                Ready to share your first eco idea?
              </h2>
              <p className="mb-8 text-lg text-emerald-100 animate-eco-fade-up animate-delay-300">
                Join EcoSpark and post something helpful today. Together, we can
                change the world.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center animate-eco-fade-up animate-delay-400">
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
                  Explore Ideas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
