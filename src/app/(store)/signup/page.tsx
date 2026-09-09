import { redirect } from "next/navigation";

export const metadata = { title: "Sign up" };

/** Signup uses the same phone OTP flow as Sign In (AstroTalk-style). */
export default function SignupPage() {
  redirect("/login?next=/dashboard");
}
