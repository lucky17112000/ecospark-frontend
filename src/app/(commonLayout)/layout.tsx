import LandingPage from "@/components/shared/LandingPage";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <LandingPage /> */}
      {children}
    </>
  );
}
