"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, LeafIcon, MenuIcon } from "lucide-react";
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
  { label: "Home", href: "/" },
  { label: "Ideas", href: "/idea" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const EXPLORE_LINKS: LandingNavLink[] = [
  { label: "Contact", href: "/contact" },

  { label: "Our Mission", href: "/mission" },
  { label: "My Profile", href: "/my-profile" },
];

const isLinkActive = (href: string, pathname: string): boolean => {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
};

function NavLink({
  href,
  label,
  isActive,
}: LandingNavLink & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex select-none items-center rounded-full px-3 py-1.5 text-sm font-medium",
        "transition-all duration-200 ease-out",
        isActive
          ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900/60"
          : "text-muted-foreground hover:bg-emerald-50/80 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300",
      )}
    >
      <span
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          isActive
            ? "mr-1.5 max-w-3.5 opacity-100"
            : "max-w-0 opacity-0 group-hover:mr-1.5 group-hover:max-w-3.5 group-hover:opacity-100",
        )}
      >
        <LeafIcon className="size-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
      </span>
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const exploreActive = EXPLORE_LINKS.some(({ href }) =>
    isLinkActive(href, pathname),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/95 shadow-sm supports-backdrop-filter:backdrop-blur-md"
          : "bg-background/80 supports-backdrop-filter:backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* ── Brand ── */}
        <Link
          href={brandHref}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <LeafIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight">
            {brandName}
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Primary"
        >
          {links.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isLinkActive(item.href, pathname)}
            />
          ))}

          {/* Explore dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex select-none items-center gap-1 rounded-full px-3 py-1.5",
                "text-sm font-medium outline-none transition-all duration-200",
                exploreActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900/60"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              Explore
              <ChevronDownIcon className="size-3.5 opacity-70 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {EXPLORE_LINKS.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                  className={cn(
                    "transition-colors duration-150",
                    isLinkActive(item.href, pathname) &&
                      "text-emerald-700 dark:text-emerald-400",
                  )}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Link
            href={loginHref}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Login
          </Link>
          <Link
            href={registerHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-all duration-200",
            )}
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile ── */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="size-9"
              >
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="pb-3">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-600 text-white">
                    <LeafIcon className="size-3.5" />
                  </span>
                  {brandName}
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-0.5 px-1 pt-1">
                {links.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start transition-all duration-150",
                        active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="my-1 border-t" />

                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Explore
                </p>
                {EXPLORE_LINKS.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start pl-5 text-sm transition-all duration-150",
                        active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-4">
                  <Link
                    href={loginHref}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Login
                  </Link>
                  <Link
                    href={registerHref}
                    className={cn(
                      buttonVariants({}),
                      "bg-emerald-600 text-white hover:bg-emerald-700",
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
