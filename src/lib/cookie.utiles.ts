"use server";
import { cookies } from "next/headers";

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSeconds: number,
) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "strict" breaks top-level cross-site redirects (e.g. Stripe -> your site)
    // by not sending cookies on the return navigation.
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeInSeconds,
  });
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
