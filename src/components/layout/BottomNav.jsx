import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Menu, Sprout, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP } from "@/config/app";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [navOpen, setNavOpen] = useState(false);

  const isDashboard = pathname === "/";
  const isGrow = pathname.startsWith("/grow");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 bg-surface/95 backdrop-blur hairline-t sm:hidden">
      {/* LEFT — sidebar / menu */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] text-muted-foreground active:text-foreground press"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
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
                    {active ? null : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-40" strokeWidth={1.5} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>

      {/* CENTER — home / dashboard */}
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center justify-center gap-1 py-3 text-[10px] transition-colors press",
          isDashboard ? "text-foreground" : "text-muted-foreground active:text-foreground",
        )}
      >
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            isDashboard ? "bg-foreground text-background" : "bg-muted text-foreground",
          )}
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="uppercase tracking-[0.1em]">Home</span>
      </Link>

      {/* RIGHT — grow */}
      <Link
        to="/grow"
        className={cn(
          "flex flex-col items-center justify-center gap-1 py-3 text-[10px] transition-colors press",
          isGrow ? "text-foreground" : "text-muted-foreground active:text-foreground",
        )}
      >
        <Sprout
          className="h-5 w-5"
          strokeWidth={1.5}
          style={{ color: isGrow ? "var(--color-dept-grow)" : undefined }}
        />
        <span className="uppercase tracking-[0.1em]">Grow</span>
      </Link>
    </nav>
  );
}
