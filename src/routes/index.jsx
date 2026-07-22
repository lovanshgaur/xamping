import { createFileRoute } from "@tanstack/react-router";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { WeeklyProgressPanel, TodayProgressPanel } from "@/components/dashboard/ProgressPanels";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BootXamp" },
      {
        name: "description",
        content: "Where you are in the sprint. Today’s mission, weekly progress, and recent activity at a glance.",
      },
      { property: "og:title", content: "BootXamp Dashboard" },
      { property: "og:description", content: "Where you are in the apprenticeship at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl divide-y divide-border">
      <DashboardHero />
      <WeeklyProgressPanel />
      <TodayProgressPanel />
      <RecentActivity />
    </div>
  );
}
