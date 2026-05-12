"use client";

interface BarChartItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartItem[];
  title?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: "bg-amber-400",
  confirmed: "bg-blue-500",
  packed: "bg-indigo-500",
  shipped: "bg-purple-500",
  delivered: "bg-emerald-500",
  refused: "bg-orange-500",
  returned: "bg-red-500",
  cancelled: "bg-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  refused: "Refused",
  returned: "Returned",
  cancelled: "Cancelled",
};

export function SimpleBarChart({ data, title }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      {title && <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>}
      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.value / max) * 100;
          const colorClass = STATUS_COLORS[item.label] ?? "bg-slate-400";
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-28 flex-shrink-0 text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[item.label] ?? item.label.replace(/_/g, " ")}
              </span>
              <div className="relative flex-1">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="w-8 flex-shrink-0 text-right text-xs font-bold text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}