import { createFileRoute } from "@tanstack/react-router";
import { DepartmentDashboard } from "@/components/departments/DepartmentDashboard";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Build — BootXamp" },
      { name: "description", content: "Build department: projects, features, commits, milestones, build XP." },
      { property: "og:title", content: "Build — BootXamp" },
      { property: "og:description", content: "Track projects and shipping momentum." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl">
      <DepartmentDashboard
        slug="build"
        sections={[
          { label: "Projects" },
          { label: "Features" },
          { label: "Commits" },
          { label: "Milestones" },
        ]}
      />
    </div>
  ),
});
