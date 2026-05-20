import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Audit Logs" };

export default async function AuditLogsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">سجل تعديلات الإدارة — آخر 200 عملية</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entity</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No audit logs yet.</td></tr>
            )}
            {logs?.map((log: { id: string; action: string; entity: string; entity_id: string | null; details: { updates?: string[]; value?: unknown; slug?: string; title?: string; status?: string; [key: string]: unknown } | null; created_at: string }) => (
              <tr key={log.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    log.action.startsWith("create") ? "bg-green-100 text-green-700" :
                    log.action.startsWith("delete") ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{log.action}</span>
                </td>
                <td className="px-4 py-3 font-medium capitalize">{log.entity}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{log.entity_id ? log.entity_id.slice(0, 8) : "—"}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate" title={log.details ? JSON.stringify(log.details) : ""}>
                  {log.details
                    ? (log.details.updates?.join(", ") || log.details.slug || log.details.status || "—")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString("en-SA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
