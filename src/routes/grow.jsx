import { createFileRoute } from "@tanstack/react-router";
import { DepartmentDashboard } from "@/components/departments/DepartmentDashboard";

export const Route = createFileRoute("/grow")({
  head: () => ({
    meta: [
      { title: "Grow — BootXamp" },
      { name: "description", content: "Grow department: reading, writing, communication, consistency." },
      { property: "og:title", content: "Grow — BootXamp" },
      { property: "og:description", content: "Track reading, writing, and consistency." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl">
      <DepartmentDashboard
        slug="grow"
        sections={[
          { label: "Reading" },
          { label: "Writing" },
          { label: "Communication" },
          { label: "Reading Streak" },
          { label: "Writing Streak" },
        ]}
      />
    </div>
  ),
});
