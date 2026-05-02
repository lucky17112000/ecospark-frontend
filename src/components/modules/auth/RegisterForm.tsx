"use client";
import AppField from "@/components/shared/Appfield";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/services/auth.service";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Leaf, Zap, ShieldCheck, Sparkles, Globe, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Registration failed. Please try again.");
          return;
        }
        router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
      } catch (error: any) {
        console.error("Register error:", error);
        setServerError(error.message || "An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-neutral-50">

      {/* ── Left Hero Panel (lg+) ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] sticky top-0 h-screen flex-col justify-between p-10 xl:p-14 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-600 overflow-hidden">

        {/* Ambient glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        {/* Floating decorative icons */}
        <Leaf      className="absolute top-28 right-16 w-9 h-9 text-emerald-400/30 animate-eco-float pointer-events-none" />
        <Sparkles  className="absolute bottom-40 left-14 w-5 h-5 text-yellow-300/30 animate-eco-float pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <Zap       className="absolute top-1/2 right-12 w-5 h-5 text-yellow-400/35 animate-eco-float pointer-events-none" style={{ animationDelay: "1s" }} />
        <Globe     className="absolute top-[63%] left-[35%] w-4 h-4 text-emerald-200/20 animate-eco-float pointer-events-none" style={{ animationDelay: "2.5s" }} />
        <Leaf      className="absolute bottom-20 right-1/4 w-3 h-3 text-emerald-300/20 animate-eco-float pointer-events-none" style={{ animationDelay: "3s" }} />

        {/* Brand */}
        <div className="relative z-10 animate-eco-fade-down">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
              <Leaf className="size-5 text-white" />
            </span>
            <div>
              <span className="text-xl font-bold text-white tracking-tight block leading-none">EcoSpark Hub</span>
              <span className="text-xs text-emerald-200/70 mt-0.5 block">Sustainable Future Initiative</span>
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8 animate-eco-fade-up animate-delay-200">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-emerald-400/60" />
              <span className="text-emerald-200/75 text-xs font-medium tracking-widest uppercase">Start Your Journey</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1]">
              Be the Change<br />
              <span className="text-yellow-400">The World Needs</span>
            </h2>
            <p className="mt-4 text-emerald-100/65 text-sm leading-relaxed max-w-sm">
              Create your free account and join thousands of innovators building a greener, more sustainable world — one idea at a time.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            {([
              { icon: Sparkles, text: "Share and discover sustainable ideas" },
              { icon: Users,    text: "Connect with 50,000+ eco-innovators"  },
              { icon: Zap,      text: "Track your environmental impact"        },
              { icon: Globe,    text: "Make a difference globally"             },
            ] as const).map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-white/10 border border-white/10 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-emerald-300" />
                </span>
                <span className="text-sm text-emerald-100/75">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 animate-eco-fade-in animate-delay-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-200/50">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Platform</span>
            <span>·</span>
            <span>Verified Ideas</span>
            <span>·</span>
            <span>Active Community</span>
          </div>
          <p className="mt-2 text-emerald-200/30 text-[11px]">© 2026 EcoSpark Hub. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-105">

          {/* Mobile-only brand mark */}
          <div className="lg:hidden text-center mb-8 animate-eco-fade-down">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/25 mb-3">
              <Leaf className="size-7 text-white" />
            </span>
            <h2 className="text-lg font-bold text-foreground">EcoSpark Hub</h2>
            <p className="text-sm text-muted-foreground">Sustainable Future Initiative</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-eco-fade-up">

            {/* Card header */}
            <div className="px-6 pt-8 pb-6 sm:px-8 border-b border-neutral-100 text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/25 mb-4 animate-eco-float">
                <Sparkles className="size-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Join the EcoSpark community today — it&apos;s free</p>
            </div>

            {/* Card body */}
            <div className="px-6 py-7 sm:px-8">

              {/* Google sign-up */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 h-11 px-4 bg-white border border-neutral-200 rounded-xl text-sm text-foreground font-medium hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-xs text-muted-foreground whitespace-nowrap px-1">or register with email</span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Form */}
              <form
                method="POST"
                action="#"
                noValidate
                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                className="space-y-4"
              >
                <div className="animate-eco-fade-up animate-delay-100">
                  <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                    {(field) => (
                      <AppField field={field} label="Full Name" type="text" placeholder="Jane Doe" />
                    )}
                  </form.Field>
                </div>

                <div className="animate-eco-fade-up animate-delay-200">
                  <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
                    {(field) => (
                      <AppField field={field} label="Email" type="email" placeholder="hello@ecosparkhub.com" />
                    )}
                  </form.Field>
                </div>

                <div className="animate-eco-fade-up animate-delay-300">
                  <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                    {(field) => (
                      <AppField
                        field={field}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        append={
                          <Button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </Button>
                        }
                      />
                    )}
                  </form.Field>
                </div>

                {/* Server error */}
                {serverError && (
                  <Alert className="border border-red-100 bg-red-50 rounded-xl py-3 px-4 animate-eco-fade-in">
                    <AlertDescription className="text-sm text-red-600">{serverError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit */}
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton
                      isPending={isSubmitting}
                      disabled={!canSubmit}
                      classname="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-emerald-600/20"
                    >
                      Create Account →
                    </AppSubmitButton>
                  )}
                </form.Subscribe>

                {/* Login link */}
                <p className="text-center text-sm text-muted-foreground pt-1">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-600 font-semibold hover:underline underline-offset-4 transition-colors">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Below-card notes */}
          <div className="mt-5 text-center space-y-2 animate-eco-fade-in animate-delay-500">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Your data is protected with 256-bit encryption
            </p>
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-emerald-600 hover:underline underline-offset-2">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-emerald-600 hover:underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
