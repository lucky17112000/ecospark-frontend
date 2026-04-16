import { email, z } from "zod";

export const loginZodSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const verifyEmailZodSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  otp: z.string().min(1, { message: "OTP is required" }).length(6, {
    message: "OTP must be exactly 6 characters long",
  }),

});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
