import { LoginForm } from "@/features/account/login-form";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign In" };

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      <LoginForm />
    </div>
  );
}
