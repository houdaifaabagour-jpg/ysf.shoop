import Link from "next/link";
import { getSession, getProfile } from "@/lib/auth/get-session";
import { logout } from "@/features/account/actions";
import { redirect } from "next/navigation";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      <div className="mt-6 rounded-lg border border-border p-6">
        <h2 className="font-semibold">Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile?.full_name ?? "No name set"} &middot; {session.user.email}
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
            View Orders
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-danger hover:underline">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
