"use client";

import React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LeafIcon, MenuIcon } from "lucide-react";
import { ModeToggle } from "./ThemeShare";

export type LandingNavLink = { label: string; href: string };

export type LandingNavbarProps = {
  brandName?: string;
  brandHref?: string;
  links?: LandingNavLink[];
  loginHref?: string;
  registerHref?: string;
  className?: string;
};

const DEFAULT_LINKS: LandingNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Ideas", href: "/idea" },
];

function NavLink({ href, label }: LandingNavLink) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

const LandingNavbar = ({
  brandName = "EcoSpark",
  brandHref = "/",
  links = DEFAULT_LINKS,
  loginHref = "/login",
  registerHref = "/register",
  className,
}: LandingNavbarProps) => {
  return (
    <header
      className={cn(
        "w-full border-b bg-background/80 supports-backdrop-filter:backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={brandHref} className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LeafIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            {brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={loginHref}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Login
          </Link>
          <Link href={registerHref} className={buttonVariants({ size: "sm" })}>
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="Open menu">
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-4">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href={loginHref}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Login
                  </Link>
                  <Link href={registerHref} className={buttonVariants({})}>
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default LandingNavbar;
