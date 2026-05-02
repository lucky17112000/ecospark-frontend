"use client";
import Link from "next/link";
import {
  ArrowRightIcon,
  AwardIcon,
  GlobeIcon,
  HeartIcon,
  LeafIcon,
  LightbulbIcon,
  RocketIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentType, useEffect, useRef, useState } from "react";
import { useCountUp } from "@/components/shared/LandingPage";

export function AnimatedStatCard({
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

// ── static data ───────────────────────────────────────────────────────────────

const CORE_VALUES = [
  {
    icon: TargetIcon,
    label: "Purpose-Driven",
    description:
      "Every initiative we undertake is designed with environmental impact at its core, ensuring meaningful progress toward sustainability.",
  },
  {
    icon: LightbulbIcon,
    label: "Innovation",
    description:
      "We embrace cutting-edge technology and creative solutions to tackle environmental challenges in new and effective ways.",
  },
  {
    icon: UsersIcon,
    label: "Community",
    description:
      "Building a global network of eco-conscious individuals and organizations working together for a sustainable future.",
  },
  {
    icon: HeartIcon,
    label: "Integrity",
    description:
      "We hold ourselves accountable to the highest standards of transparency, honesty, and ethical responsibility.",
  },
];

const GOALS = [
  {
    icon: GlobeIcon,
    title: "Global Reach",
    description:
      "Expand our sustainable solutions to 100+ countries, making eco-friendly practices accessible to communities worldwide.",
  },
  {
    icon: TrendingUpIcon,
    title: "Carbon Reduction",
    description:
      "Help individuals and businesses reduce their carbon footprint by 50% through our innovative tracking and offset programs.",
  },
  {
    icon: AwardIcon,
    title: "Education First",
    description:
      "Educate 10 million people on sustainable practices through our free resources, workshops, and community programs.",
  },
];

// const STATS = [
//   { value: "50K+", label: "Active Members", icon: UsersIcon },
//   { value: "2M+", label: "Trees Planted", icon: LeafIcon },
//   { value: "75%", label: "Avg. Carbon Reduction", icon: TrendingUpIcon },
//   { value: "150+", label: "Countries Reached", icon: GlobeIcon },
// ];

// ── page ─────────────────────────────────────────────────────────────────────

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background animate-eco-fade-up animate-delay-100">
      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden animate-eco-fade-up animate-delay-100">
        <div className="pointer-events-none absolute inset-0 select-none animate-eco-fade-up animate-delay-100">
          <div className="absolute -top-40 -right-32 size-96 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20 animate-eco-fade-up animate-delay-100" />
          <div className="absolute bottom-0 -left-24 size-80 rounded-full bg-teal-50/80 blur-2xl dark:bg-teal-900/10 animate-eco-fade-up animate-delay-100" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:min-h-[55vh] lg:items-center ">
          <div className="mx-auto max-w-3xl space-y-6 text-center animate-eco-fade-up animate-delay-100">
            <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 ">
              <SparklesIcon className="mr-1.5 size-3" />
              Our Mission
            </Badge>

            <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl animate-eco-fade-up animate-delay-100">
              Sparking a{" "}
              <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
                greener world
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Empowering a sustainable future through innovation, education, and
              collective action for our planet.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
                )}
              >
                Join Our Movement
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
              <Link
                href="/idea"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Explore Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Mission Statement ── */}
      <section className="border-t bg-muted/10 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border bg-card p-8 shadow-sm sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
                <LeafIcon className="size-8" />
              </div>
            </div>

            <div className="mx-auto mb-8 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                What we stand for
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Our core belief
              </h2>
            </div>

            <div className="space-y-4 text-center">
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                At EcoSpark, we believe that every action counts in the fight
                against climate change. Our mission is to ignite sustainable
                living by providing innovative solutions, education, and tools
                that empower individuals and businesses to reduce their
                environmental footprint.
              </p>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                We envision a world where sustainability is not just an option,
                but a way of life — where communities thrive in harmony with
                nature, and future generations inherit a healthier, greener
                planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Core Values ── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              Core values
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Principles that guide everything we do
            </h2>
            <p className="mt-4 text-muted-foreground">
              These values shape our commitment to creating lasting change.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
          {/* <AnimatedStatCard
            label="Active Members"
            countTo={50000}
            format={(n) => `${Math.round(n / 1000)}K+`}
            icon={UsersIcon}
          />
          <AnimatedStatCard
            label="Trees Planted"
            countTo={2000000}
            format={(n) => `${Math.round(n / 1000000)}M+`}
            icon={LeafIcon}
            delay={500}
          />
          <AnimatedStatCard
            label="Avg. Carbon Reduction"
            countTo={75}
            format={(n) => `${Math.round(n)}%`}
            icon={TrendingUpIcon}
            delay={1000}
          />
          <AnimatedStatCard
            label="Countries Reached"
            countTo={150}
            format={(n) => `${Math.round(n)}+`}
            icon={GlobeIcon}
            delay={1500}
          /> */}
        </div>
      </section>

      {/* ── 4. Goals ── */}
      <section className="border-t bg-muted/10 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              Our goals
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Measurable targets, real impact
            </h2>
            <p className="mt-4 text-muted-foreground">
              Concrete targets that drive our mission forward every day.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {GOALS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-800"
              >
                <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-heading mb-3 text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Stats ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {/* {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {value}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {label}
                  </p>
                </div>
              </div>
            ))} */}
            <AnimatedStatCard
              label="Active Members"
              countTo={50000}
              format={(n) => `${Math.round(n / 1000)}K+`}
              icon={UsersIcon}
            />
            <AnimatedStatCard
              label="Trees Planted"
              countTo={2000000}
              format={(n) => `${Math.round(n / 1000000)}M+`}
              icon={LeafIcon}
              delay={500}
            />
            <AnimatedStatCard
              label="Avg. Carbon Reduction"
              countTo={75}
              format={(n) => `${Math.round(n)}%`}
              icon={TrendingUpIcon}
              delay={1000}
            />
            <AnimatedStatCard
              label="Countries Reached"
              countTo={150}
              format={(n) => `${Math.round(n)}+`}
              icon={GlobeIcon}
              delay={1500}
            />
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section className="border-t">
        <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-700 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <RocketIcon className="mx-auto mb-4 size-12 text-emerald-200" />
            <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Together, we create impact
            </h2>
            <p className="mb-8 text-lg text-emerald-100">
              Every small action adds up to significant change. Join us in
              building a sustainable future where people, planet, and prosperity
              thrive together.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-emerald-700 shadow-lg hover:bg-emerald-50",
                )}
              >
                Join Our Movement
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
              <Link
                href="/idea"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/40 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
