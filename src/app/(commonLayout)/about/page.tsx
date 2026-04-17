import React from "react";
import Image from "next/image";
import Link from "next/link";

import LandingNavbar from "@/components/shared/LandingNavbar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <LandingNavbar /> */}

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">About EcoSpark</Badge>
                <Badge variant="outline">Built for impact</Badge>
              </div>

              <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                A place where eco ideas become action.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                EcoSpark is a community-driven platform to discover and share
                sustainability ideas—simple habits, smart innovations, and
                real-world projects.
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
                  Join the community
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Focus
                  </p>
                  <p className="text-sm font-semibold">Sustainability</p>
                </div>
                <div className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Community
                  </p>
                  <p className="text-sm font-semibold">Collaborative</p>
                </div>
                <div className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Outcome
                  </p>
                  <p className="text-sm font-semibold">Real impact</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 hidden md:block">
                <div className="absolute top-8 left-10 size-24 rounded-full border bg-muted/40 animate-spin [animation-duration:22s]" />
                <div className="absolute bottom-10 right-10 size-20 rounded-full border bg-muted/40 animate-pulse" />
              </div>

              <Card className="relative overflow-hidden">
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
                    <Badge className="animate-eco-float">Eco</Badge>
                  </div>

                  <div className="mt-4 relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/30">
                    <Image
                      src="/pexels-cottonbro-6565761.jpg"
                      alt="EcoSpark community poster"
                      fill
                      className={cn(
                        "object-cover",
                        "animate-eco-float opacity-95",
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
        </section>

        <section className="border-y bg-muted/20">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="space-y-2">
              <p className="font-heading text-base font-semibold">
                What we believe
              </p>
              <p className="text-sm text-muted-foreground">
                Clear principles that keep EcoSpark simple and useful.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Mission
                </p>
                <p className="mt-1 font-heading text-base font-semibold">
                  Make sustainability easier
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Give everyone a place to find practical ideas and take action
                  without feeling overwhelmed.
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Vision
                </p>
                <p className="mt-1 font-heading text-base font-semibold">
                  A community that drives change
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Turn good intentions into shared progress through discussion,
                  feedback, and support.
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Values
                </p>
                <p className="mt-1 font-heading text-base font-semibold">
                  Simple, honest, impactful
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We keep it focused: real ideas, respectful conversations, and
                  visible outcomes.
                </p>
              </Card>
            </div>

            <Separator className="my-8" />

            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-heading text-base font-semibold">
                    Ready to share your first eco idea?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Join EcoSpark and post something helpful today.
                  </p>
                </div>
                <Link
                  href="/register"
                  className={buttonVariants({ size: "lg" })}
                >
                  Get started
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
