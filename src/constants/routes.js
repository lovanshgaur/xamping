import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Hammer,
  Sprout,
  Briefcase,
  Activity,
  UserCog,
  User,
  BarChart3,
  Timer,
} from "lucide-react";

export const ROUTES = Object.freeze([
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/today", label: "Today", icon: CalendarCheck },
  { path: "/timer", label: "Timer", icon: Timer },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/build", label: "Build", icon: Hammer },
  { path: "/grow", label: "Grow", icon: Sprout },
  { path: "/career", label: "Career", icon: Briefcase },
  { path: "/operate", label: "Operate", icon: Activity },
  { path: "/manager", label: "Manager", icon: UserCog },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
]);
