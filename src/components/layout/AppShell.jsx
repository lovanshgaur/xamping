import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { NotificationsBell } from "./NotificationsBell";

import { useBootxamp } from "@/hooks/useBootxamp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION } from "@/constants/animations";
import { APP } from "@/config/app";

export function AppShell({ children }) {
  const { data, mutate } = useBootxamp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(data.settings.sidebarCollapsed);
  const pageRef = useRef(null);
  const reduced = useReducedMotion();

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    mutate((d) => {
      d.settings.sidebarCollapsed = next;
    });
  };

  useEffect(() => {
    if (!pageRef.current || reduced) return;
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: MOTION.page.rise },
      { opacity: 1, y: 0, duration: MOTION.page.duration, ease: MOTION.page.ease },
    );
  }, [pathname, reduced]);

  return (
    <div className="relative flex min-h-screen text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 hairline-b bg-background/80 px-4 py-3 backdrop-blur sm:px-8">
          <p className="eyebrow truncate">
            <span className="sm:hidden">{APP.name}</span>
            <span className="hidden sm:inline">{APP.name} · {APP.tagline}</span>
          </p>
          <NotificationsBell />
        </header>

        <main
          ref={pageRef}
          className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-10 sm:pt-10"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
