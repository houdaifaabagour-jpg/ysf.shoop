"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCoupon, updateCoupon, deleteCoupon } from "@/features/coupons/actions";
import type { ActionState } from "@/features/coupons/actions";
import type { CouponWithUsage } from "@/features/coupons/queries";

const initialState: ActionState = { error: "", success: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50">
      {pending ? "..." : label}
    </button>
  );
}

interface CouponFormProps {
  coupon?: CouponWithUsage;
  onClose: () => void;
}

function CouponForm({ coupon, onClose }: CouponFormProps) {
  const action = coupon 
    ? (_prev: ActionState | null, formData: FormData) => updateCoupon(coupon.id, _prev, formData) 
    : createCoupon;
  const [state, formAction] = useFormState(action, initialState);

  if (state?.success) {
    onClose();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{coupon ? "Edit Coupon" : "Add Coupon"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Code</label>
            <input name="code" defaultValue={coupon?.code} required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm uppercase" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select name="type" defaultValue={coupon?.type} required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm">
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Value</label>
              <input name="value" type="number" step="0.01" defaultValue={coupon?.value} required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Min Order Amount</label>
              <input name="minOrderAmount" type="number" step="0.01" defaultValue={coupon?.min_order_amount ?? ""} placeholder="Optional" className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Usage Limit</label>
              <input name="usageLimit" type="number" defaultValue={coupon?.usage_limit ?? ""} placeholder="Optional" className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Starts At</label>
              <input name="startsAt" type="datetime-local" defaultValue={coupon?.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : ""} className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Expires At</label>
              <input name="expiresAt" type="datetime-local" defaultValue={coupon?.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : ""} className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
          </div>
          {coupon && (
            <div className="flex items-center gap-2">
              <input type="hidden" name="isActive" value={coupon.is_active ? "true" : "false"} />
              <button type="button" onClick={() => { const input = document.querySelector('input[name="isActive"]') as HTMLInputElement; input.value = (!coupon.is_active).toString(); }} className={`rounded-md px-3 py-1 text-xs font-medium ${coupon.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {coupon.is_active ? "Active" : "Inactive"}
              </button>
            </div>
          )}
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
            <SubmitButton label={coupon ? "Update" : "Create"} />
          </div>
        </form>
      </div>
    </div>
  );
}

interface AdminCouponsClientProps {
  coupons: CouponWithUsage[];
}

export function AdminCouponsClient({ coupons }: AdminCouponsClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponWithUsage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (coupon: CouponWithUsage) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this coupon?")) {
      await deleteCoupon(id);
      window.location.reload();
    }
  };

  const getStatus = (coupon: CouponWithUsage) => {
    if (!coupon.is_active) return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Inactive</span>;
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">Expired</span>;
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">Exhausted</span>;
    return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">Active</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={handleAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
          Add Coupon
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Min Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Expires</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-3 text-sm font-medium">{coupon.code}</td>
                <td className="px-4 py-3 text-sm capitalize">{coupon.type}</td>
                <td className="px-4 py-3 text-sm">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                </td>
                <td className="px-4 py-3 text-sm">{coupon.min_order_amount ? `$${coupon.min_order_amount}` : "—"}</td>
                <td className="px-4 py-3 text-sm">{coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ""}</td>
                <td className="px-4 py-3 text-sm">{getStatus(coupon)}</td>
                <td className="px-4 py-3 text-sm">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(coupon)} className="text-sm text-primary hover:underline">Edit</button>
                  <form action={deleteCoupon.bind(null, coupon.id)} className="inline">
                    <button type="submit" onClick={(e) => { if (!confirm("Delete this coupon?")) e.preventDefault(); }} className="text-sm text-danger hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No coupons yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && <CouponForm coupon={editingCoupon ?? undefined} onClose={handleClose} />}
    </div>
  );
}