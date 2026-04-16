import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

export default function AdminDashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      Admin Layout
      {children}
    </>
  );
}
