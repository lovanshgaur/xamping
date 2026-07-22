import { createFileRoute } from "@tanstack/react-router";
import { DepartmentDashboard } from "@/components/departments/DepartmentDashboard";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career — BootXamp" },
      { name: "description", content: "Career department: applications, networking, interviews, portfolio, XP." },
      { property: "og:title", content: "Career — BootXamp" },
      { property: "og:description", content: "Track applications, interviews, and career signals." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl">
      <DepartmentDashboard
        slug="career"
        sections={[
          { label: "Resume" },
          { label: "Portfolio" },
          { label: "GitHub" },
          { label: "Applications" },
          { label: "Interview Practice" },
          { label: "Leetcode" },
          { label: "Application History" },
          { label: "Interview History" },
        ]}
      />
    </div>
  ),
});
