import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { updateSetting } from "@/features/admin/actions";
import { COUNTRIES } from "@/lib/settings";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: settings } = await supabase.from("store_settings").select("*");

  const getValue = (key: string) => {
    const setting = settings?.find((s) => s.key === key);
    return setting?.value;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Store Settings</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form action={updateSetting.bind(null, "supported_countries")} className="rounded-lg border border-border bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Supported Countries</h2>
          <p className="text-sm text-muted-foreground mb-4">Countries available in checkout</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {COUNTRIES.map((c) => {
              const selected = (getValue("supported_countries") as string[])?.includes(c.code) ?? true;
              return (
                <label key={c.code} className="flex items-center gap-2 text-sm p-2 rounded border border-border cursor-pointer hover:bg-muted">
                  <input type="checkbox" name="value" value={c.code} defaultChecked={selected} />
                  {c.flag} {c.name}
                </label>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "default_country")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Default Country</h2>
          <p className="text-sm text-muted-foreground mb-4">The default country for new orders</p>
          <select name="value" defaultValue={getValue("default_country") || "MA"} className="w-full rounded-md border border-border px-3 py-2">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.nameAr})
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "currency")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Currency</h2>
          <p className="text-sm text-muted-foreground mb-4">Primary currency code (e.g., SAR, MAD, AED)</p>
          <select name="value" defaultValue={getValue("currency") || "MAD"} className="w-full rounded-md border border-border px-3 py-2">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.currency}>
                {c.currency} - {c.currencySymbol} ({c.name})
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "currency_symbol")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Currency Symbol</h2>
          <p className="text-sm text-muted-foreground mb-4">Symbol to display next to prices</p>
          <input name="value" defaultValue={getValue("currency_symbol") || "د.م."} className="w-full rounded-md border border-border px-3 py-2" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "phone_code")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Default Phone Code</h2>
          <p className="text-sm text-muted-foreground mb-4">Default country phone code</p>
          <select name="value" defaultValue={getValue("phone_code") || "+212"} className="w-full rounded-md border border-border px-3 py-2">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.phoneCode}>
                {c.flag} {c.phoneCode} ({c.name})
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "free_shipping_threshold")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Free Shipping Threshold</h2>
          <p className="text-sm text-muted-foreground mb-4">Orders above this amount get free shipping</p>
          <input name="value" type="number" defaultValue={getValue("free_shipping_threshold") || 500} className="w-full rounded-md border border-border px-3 py-2" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "default_shipping_cost")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Default Shipping Cost</h2>
          <p className="text-sm text-muted-foreground mb-4">Shipping cost for orders below threshold</p>
          <input name="value" type="number" defaultValue={getValue("default_shipping_cost") || 50} className="w-full rounded-md border border-border px-3 py-2" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "store_phone")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Store Phone</h2>
          <p className="text-sm text-muted-foreground mb-4">Contact phone number displayed on the site</p>
          <input name="value" defaultValue={getValue("store_phone") || "+212 6XX XXX XXX"} className="w-full rounded-md border border-border px-3 py-2" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>

        <form action={updateSetting.bind(null, "store_email")} className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Store Email</h2>
          <p className="text-sm text-muted-foreground mb-4">Contact email displayed on the site</p>
          <input name="value" type="email" defaultValue={getValue("store_email") || "contact@ysf.shoop"} className="w-full rounded-md border border-border px-3 py-2" />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}