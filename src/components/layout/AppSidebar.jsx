import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { APP } from "@/config/app";
import { useBootxamp } from "@/hooks/useBootxamp";
import { getOverallRank } from "@/lib/bootxamp/selectors";
import { formatNumber } from "@/utils/format";
import { PanelLeftClose, PanelLeftOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/shared/Avatar";

/**
 * @param {{ collapsed: boolean, onToggle: () => void }} props
 */
export function AppSidebar({ collapsed, onToggle }) {
  const { data } = useBootxamp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rank = getOverallRank(data);
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col hairline-b sm:flex sm:h-screen sm:sticky sm:top-0 sm:hairline",
        collapsed ? "sm:w-16" : "sm:w-64",
      )}
      style={{ transition: "width 200ms ease" }}
    >
      <div className={cn("flex items-center justify-between p-4 hairline-b", collapsed && "justify-center")}>
        {!collapsed ? (
          <Link to="/" className="flex flex-col leading-tight">
            <span className="font-display text-lg font-medium tracking-tight">{APP.name}</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {APP.tagline}
            </span>
          </Link>
        ) : (
          <Link to="/" className="font-display text-lg font-medium">B</Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="grid h-8 w-8 place-items-center rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" strokeWidth={1.5} /> : <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {ROUTES.map((r) => {
            const active = r.path === "/" ? pathname === "/" : pathname.startsWith(r.path);
            const Icon = r.icon;
            return (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className={cn(
                    "flex items-center gap-3 rounded-[4px] px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                  title={collapsed ? r.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {!collapsed ? <span>{r.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed ? (
        <div className="space-y-4 p-4 hairline-t">
          <Link to="/profile" className="flex items-center gap-3 rounded-[4px] p-2 text-sm transition-colors hover:bg-muted">
            <Avatar avatar={data.employee.avatar} name={data.employee.name} size={40} />
            <div className="min-w-0">
              <p className="truncate font-medium">{data.employee.name || "Unnamed employee"}</p>
              <p className="truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {rank.name}
              </p>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <MiniStat label="Week" value={data.sprint ? `${data.sprint.currentWeek}/${data.sprint.totalWeeks}` : "—"} />
            <MiniStat
              label="Day"
              value={data.app.currentDayId ? findDayNumber(data) ?? "—" : "—"}
            />
            <MiniStat label="XP" value={formatNumber(data.employee.overallXP)} />
            <MiniStat label="Rank" value={rank.name} />
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <span>Theme</span>
            <span className="inline-flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />}
              {theme}
            </span>
          </button>
        </div>
      ) : (
        <div className="p-2 hairline-t">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="grid h-8 w-full place-items-center rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? <Moon className="h-4 w-4" strokeWidth={1.5} /> : <Sun className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </div>
      )}
    </aside>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-display text-base font-medium tabular-nums">{value}</p>
    </div>
  );
}

function findDayNumber(data) {
  for (const w of data.weeks) {
    const d = w.days.find((x) => x.id === data.app.currentDayId);
    if (d) return d.dayNumber;
  }
  return null;
}
