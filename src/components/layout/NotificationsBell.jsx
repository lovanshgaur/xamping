import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBootxamp } from "@/hooks/useBootxamp";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDateTime } from "@/utils/dates";
import { Button } from "@/components/shared/Button";

export function NotificationsBell() {
  const { data, mutate } = useBootxamp();
  const [open, setOpen] = useState(false);
  const unread = data.notifications.filter((n) => !n.read).length;

  const markAll = () => {
    mutate((d) => {
      d.notifications = d.notifications.map((n) => ({ ...n, read: true }));
    });
  };
  const clearAll = () => {
    mutate((d) => {
      d.notifications = [];
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-[6px] border-border bg-surface p-0">
        <div className="flex items-center justify-between p-4 hairline-b">
          <p className="eyebrow">Notifications</p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={markAll}>Mark read</Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear</Button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {data.notifications.length === 0 ? (
            <div className="p-4">
              <EmptyState compact title="No notifications." description="You're all caught up." />
            </div>
          ) : (
            <ul>
              {data.notifications
                .slice()
                .reverse()
                .map((n) => (
                  <li key={n.id} className="px-4 py-3 hairline-b last:hairline-b-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                    ) : null}
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
