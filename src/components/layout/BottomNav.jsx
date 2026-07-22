import { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Menu, LayoutGrid, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { DEPARTMENTS } from "@/constants/departments";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP } from "@/config/app";

const DEPT_PATHS = ["/learn", "/build", "/grow", "/career", "/operate"];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);

  const activeDeptPath = DEPT_PATHS.find((p) => pathname.startsWith(p));
  const activeDept = activeDeptPath
    ? DEPARTMENTS.find((d) => `/${d.id}` === activeDeptPath)
    : null;
  const DeptIcon = activeDept?.icon ?? LayoutGrid;
  const deptLabel = activeDept?.name ?? "Depts";

  const isDashboard = pathname === "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 bg-surface/95 backdrop-blur hairline-t sm:hidden">
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center justify-center gap-1 py-3 text-[10px] transition-colors",
          isDashboard ? "text-foreground" : "text-muted-foreground active:text-foreground",
        )}
      >
        <LayoutDashboard className="h-5 w-5" strokeWidth={1.5} />
        <span className="uppercase tracking-[0.1em]">Home</span>
      </Link>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] text-muted-foreground active:text-foreground"
            aria-label="Open navigation"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="uppercase tracking-[0.1em]">Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[82%] max-w-sm border-border bg-surface p-0">
          <div className="flex items-center justify-between p-5 hairline-b">
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-medium tracking-tight">{APP.name}</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {APP.tagline}
              </span>
            </div>
          </div>
          <ul className="p-2">
            {ROUTES.map((r) => {
              const active = r.path === "/" ? pathname === "/" : pathname.startsWith(r.path);
              const Icon = r.icon;
              return (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    onClick={() => setNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-[4px] px-4 py-3 text-sm transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>{r.label}</span>
                    {active ? null : <ChevronRight className="ml-auto h-4 w-4 opacity-40" strokeWidth={1.5} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>

      <Sheet open={deptOpen} onOpenChange={setDeptOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-3 text-[10px] transition-colors",
              activeDept ? "text-foreground" : "text-muted-foreground active:text-foreground",
            )}
            aria-label="Switch department"
          >
            <DeptIcon className="h-5 w-5" strokeWidth={1.5} />
            <span className="uppercase tracking-[0.1em] truncate max-w-[80px]">{deptLabel}</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="border-border bg-surface p-0">
          <div className="flex items-center justify-between p-5 hairline-b">
            <p className="eyebrow">Switch Department</p>
            <button
              type="button"
              onClick={() => setDeptOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-[4px] text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-2 p-3 pb-6">
            {DEPARTMENTS.filter((d) => DEPT_PATHS.includes(`/${d.id}`)).map((d) => {
              const active = activeDept?.id === d.id;
              const Icon = d.icon;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setDeptOpen(false);
                      navigate({ to: `/${d.id}` });
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[6px] p-4 text-left transition-colors hairline",
                      active
                        ? "bg-foreground text-background"
                        : "bg-surface hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-[4px]",
                        active ? "bg-background/10" : "bg-muted",
                      )}
                      style={!active ? { color: d.strokeVar } : undefined}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-base font-medium tracking-tight">
                        {d.name}
                      </span>
                      <span className={cn("mt-0.5 block text-[11px]", active ? "text-background/70" : "text-muted-foreground")}>
                        {d.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
