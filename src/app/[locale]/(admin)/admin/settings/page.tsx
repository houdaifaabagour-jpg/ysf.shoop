import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { updateSetting } from "@/features/admin/actions";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: settings } = await supabase.from("store_settings").select("*");

  return (
    <div>
      <h1 className="text-2xl font-bold">Store Settings</h1>

      <div className="mt-6 space-y-4">
        {settings?.map((setting) => (
          <form
            key={setting.id}
            action={updateSetting.bind(null, setting.key)}
            className="rounded-lg border border-border bg-white p-4"
          >
            <label className="text-sm font-medium capitalize">{setting.key.replace(/_/g, " ")}</label>
            <input
              name="value"
              defaultValue={JSON.stringify(setting.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-mono"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-light"
              >
                Update
              </button>
            </div>
          </form>
        ))}
        {(!settings || settings.length === 0) && (
          <p className="text-sm text-muted-foreground">No settings configured. Run seed data.</p>
        )}
      </div>
    </div>
  );
}
