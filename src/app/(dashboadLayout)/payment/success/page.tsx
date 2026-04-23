import { redirect } from "next/navigation";

export default function PaymentSuccessPage() {
  // After Stripe returns to the app, always go to the public home page.
  // (Keeps UX consistent and avoids auth middleware redirects.)
  redirect("/");
}
