import { SignupForm } from "@/features/account/signup-form";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <SignupForm />
    </div>
  );
}
