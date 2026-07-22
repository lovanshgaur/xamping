import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useBootxamp } from "@/hooks/useBootxamp";
import { getRecentTimeline } from "@/lib/bootxamp/selectors";
import { formatDateTime } from "@/utils/dates";

export function RecentActivity() {
  const { data } = useBootxamp();
  const items = getRecentTimeline(data);

  return (
    <section className="py-10">
      <SectionHeader eyebrow="Trail" title="Recent Activity" description="The last ten events on your timeline." />
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No activity yet." description="Import a sprint and complete tasks to build history." />
        </div>
      ) : (
        <ol className="mt-6 hairline rounded-[6px] bg-surface">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 hairline-b last:hairline-b-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
              <div className="text-right meta shrink-0">
                <p className="text-[10px] uppercase tracking-[0.14em]">{item.type.replace(/_/g, " ")}</p>
                <p className="mt-0.5">{formatDateTime(item.timestamp)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
