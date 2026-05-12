import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { getCoupons } from "@/features/coupons/queries";
import { AdminCouponsClient } from "./admin-coupons-client";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const coupons = await getCoupons();

  return (
    <div className="p-6">
      <AdminCouponsClient coupons={coupons} />
    </div>
  );
}