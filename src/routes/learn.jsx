import { createFileRoute } from "@tanstack/react-router";
import { DepartmentDashboard } from "@/components/departments/DepartmentDashboard";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — BootXamp" },
      { name: "description", content: "Learn department: level, XP, current topic, week progress, resources." },
      { property: "og:title", content: "Learn — BootXamp" },
      { property: "og:description", content: "Track study, courses, and structured practice." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl">
      <DepartmentDashboard slug="learn" sections={[{ label: "Resources" }]} />
    </div>
  ),
});
