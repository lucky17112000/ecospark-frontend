"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { Footer2 } from "../footer2";
import LandingNavbar from "./LandingNavbar";

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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <LandingNavbar /> */}

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Sustainable ideas, shared</Badge>
                <Badge variant="outline">Community-powered</Badge>
              </div>

              <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Spark eco-friendly ideas that turn into real impact.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                Discover, share, and support environmental ideas—from small
                daily habits to community projects.
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/idea" className={buttonVariants({ size: "lg" })}>
                  Explore ideas
                  <ArrowRightIcon className="ml-1 size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Create an account
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 hidden md:block">
                <div className="absolute top-6 left-10 size-28 rounded-full border bg-muted/40 animate-spin [animation-duration:18s]" />
                <div className="absolute bottom-8 right-10 size-24 rounded-full border bg-muted/40 animate-pulse" />
              </div>

              <Card className="relative overflow-hidden">
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
                    <Badge className="animate-eco-float">New</Badge>
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-muted/30">
                    <div className="absolute inset-0 grid place-items-center">
                      <Image
                        src="/f229b094-ef88-457d-8c4f-cebe1dd64d7a.jpg"
                        alt="EcoSpark poster"
                        width={560}
                        height={280}
                        className="animate-eco-float opacity-90"
                        priority
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Ideas</Badge>
                        <Badge variant="secondary">Community</Badge>
                        <Badge variant="secondary">Impact</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/20">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-heading text-base font-semibold">
                  Trending eco topics
                </p>
                <p className="text-sm text-muted-foreground">
                  Change Your nature, Change the world.
                </p>
              </div>
              <Badge variant="outline">Alamin</Badge>
            </div>

            <div className="eco-marquee mt-4 overflow-hidden rounded-xl border bg-background">
              <div className="eco-marquee-track flex w-max items-center gap-2 p-3">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                  <span
                    key={`${item.label}-${idx}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground",
                      "transition-transform will-change-transform hover:-translate-y-0.5 hover:scale-[1.02]",
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
      </main>
      <Footer2 />
    </div>
  );
};

export default LandingPage;
