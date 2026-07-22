import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { ImportDialog } from "@/components/shared/ImportDialog";
import { ExportDialog } from "@/components/shared/ExportDialog";
import { ResetDialog } from "@/components/shared/ResetDialog";
import { SettingsDrawer } from "@/components/profile/SettingsDrawer";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { useBootxamp } from "@/hooks/useBootxamp";
import { useExport } from "@/hooks/useExport";
import { getAllDepartmentXP, getOverallRank } from "@/lib/bootxamp/selectors";
import { backupAndReset } from "@/lib/bootxamp/services/backup.service";
import { levelFromXP } from "@/lib/bootxamp/domain/levels";
import { getRankProgress, getNextRank } from "@/lib/bootxamp/domain/ranks";
import { DEPARTMENTS } from "@/constants/departments";
import { formatNumber, formatHours } from "@/utils/format";
import { formatDateShort, todayISODate, nowIso } from "@/utils/dates";
import { Download, Upload, RotateCcw, Save, Settings as SettingsIcon, Camera } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BootXamp" },
      { name: "description", content: "Who you are becoming. Employee identity, XP, streaks, promotions, and settings." },
      { property: "og:title", content: "Profile — BootXamp" },
      { property: "og:description", content: "Employee identity, XP, streaks and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, mutate } = useBootxamp();
  const { exportCareer } = useExport();
  const [imp, setImp] = useState(false);
  const [exp, setExp] = useState(false);
  const [reset, setReset] = useState(false);
  const [settings, setSettings] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const emp = data.employee;
  const rank = getOverallRank(data);
  const next = getNextRank(emp.overallXP);
  const rankPct = getRankProgress(emp.overallXP);
  const deptXP = getAllDepartmentXP(data);

  const doBackup = () => exportCareer();
  const doReset = () => {
    if (data.settings.exportBeforeReset) backupAndReset(data);
    else if (typeof window !== "undefined") {
      window.localStorage.removeItem("bootxamp");
      window.location.reload();
    }
  };

  const updateField = (key, coerce) => (e) => {
    const raw = e.target.value;
    mutate((d) => {
      d.employee[key] = coerce ? coerce(raw) : raw;
      d.employee.updatedAt = nowIso();
    });
  };

  const recordWeight = () => {
    const w = Number(emp.weight);
    if (!Number.isFinite(w) || w <= 0) return;
    mutate((d) => {
      d.employee.weightHistory = d.employee.weightHistory ?? [];
      d.employee.weightHistory.push({ id: nanoid(), date: todayISODate(), weight: w });
      d.employee.updatedAt = nowIso();
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="grid gap-8 pb-6 hairline-b sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <button
          type="button"
          onClick={() => setAvatarOpen(true)}
          className="group relative"
          aria-label="Change avatar"
        >
          <Avatar avatar={emp.avatar} name={emp.name || "Employee"} size={112} />
          <span className="absolute inset-x-0 -bottom-2 mx-auto flex w-fit items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-background opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-3 w-3" strokeWidth={1.75} /> Edit
          </span>
        </button>
        <div className="min-w-0 space-y-2">
          <p className="eyebrow">Employee</p>
          <input
            value={emp.name}
            onChange={updateField("name")}
            placeholder="Your name"
            className="w-full bg-transparent font-display text-4xl font-medium tracking-tight outline-none sm:text-5xl"
          />
          <input
            value={emp.designation}
            onChange={updateField("designation")}
            placeholder="Position"
            className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="solid">{rank.name}</Badge>
            <Badge variant="outline">Level {emp.overallLevel}</Badge>
            <Badge>{formatNumber(emp.overallXP)} XP</Badge>
          </div>
          {next ? (
            <p className="text-xs text-muted-foreground">
              {Math.max(0, next.minXP - emp.overallXP)} XP to {next.name} · {Math.round(rankPct * 100)}%
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Max rank achieved.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImp(true)}>
            <Upload className="h-4 w-4" strokeWidth={1.5} /> Import
          </Button>
          <Button variant="outline" onClick={() => setExp(true)}>
            <Download className="h-4 w-4" strokeWidth={1.5} /> Export
          </Button>
          <Button variant="outline" onClick={doBackup}>
            <Save className="h-4 w-4" strokeWidth={1.5} /> Backup
          </Button>
          <Button variant="destructive" onClick={() => setReset(true)}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Reset
          </Button>
          <Button variant="ghost" onClick={() => setSettings(true)} aria-label="Settings">
            <SettingsIcon className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </header>

      <section>
        <SectionHeader eyebrow="Identity" title="Bio" description="Editable at any time. Weight can be re-logged to build history." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BioField label="Birthday" type="date" value={emp.birthday ?? ""} onChange={updateField("birthday", (v) => v || null)} />
          <BioField
            label="Height (cm)"
            type="number"
            value={emp.height ?? ""}
            onChange={updateField("height", (v) => (v === "" ? null : Number(v)))}
            placeholder="—"
          />
          <div className="flex flex-col gap-2 rounded-[6px] bg-surface p-4 hairline">
            <span className="eyebrow">Weight (kg)</span>
            <input
              type="number"
              step={0.1}
              value={emp.weight ?? ""}
              placeholder="—"
              onChange={updateField("weight", (v) => (v === "" ? null : Number(v)))}
              className="bg-transparent font-display text-2xl font-medium tabular-nums outline-none"
            />
            <button
              type="button"
              onClick={recordWeight}
              className="mt-auto w-fit rounded-[4px] hairline px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Log to history
            </button>
          </div>
          <BioField label="Company" value={emp.company ?? ""} onChange={updateField("company")} placeholder="Forge Labs" />
        </div>
        {emp.weightHistory && emp.weightHistory.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="eyebrow">Weight log ·</span>
            {emp.weightHistory
              .slice(-6)
              .reverse()
              .map((h) => (
                <span key={h.id} className="rounded-[4px] hairline px-2 py-1 tabular-nums">
                  {formatDateShort(h.date)} · {h.weight}kg
                </span>
              ))}
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeader eyebrow="Career" title="Overall Metrics" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Overall XP" value={formatNumber(emp.overallXP)} sub={`Level ${emp.overallLevel}`} />
          <StatCard label="Current Streak" value={emp.currentStreak} sub="days" />
          <StatCard label="Longest Streak" value={emp.longestStreak} sub="days" />
          <StatCard label="Hours Worked" value={formatHours(emp.totalHours)} />
          <StatCard label="Tasks Completed" value={formatNumber(emp.totalTasksCompleted)} />
          <StatCard label="Projects Completed" value={formatNumber(emp.totalProjectsCompleted)} />
          <StatCard label="Applications" value={formatNumber(emp.totalApplications)} />
          <StatCard label="Commits" value={formatNumber(emp.totalCommits)} />
          <StatCard label="Bonus XP" value={formatNumber(emp.totalBonusXP ?? 0)} sub="from reviews" />
          <StatCard label="Penalty XP" value={formatNumber(emp.totalPenaltyXP ?? 0)} sub="from reviews" />
          <StatCard label="Reviews" value={formatNumber(emp.totalReviews)} />
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Departments" title="Levels" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENTS.map((d) => (
            <StatCard
              key={d.id}
              label={d.name}
              value={levelFromXP(deptXP[d.id])}
              sub={`${formatNumber(deptXP[d.id])} XP`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Promotions" title="Promotion History" />
        {emp.promotionHistory.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No promotions yet." description="Earn XP to progress through the seven rank tiers." />
          </div>
        ) : (
          <ol className="mt-6 hairline rounded-[6px] bg-surface">
            {emp.promotionHistory
              .slice()
              .reverse()
              .map((p) => (
                <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 hairline-b last:hairline-b-0">
                  <div>
                    <p className="text-sm font-medium">{p.rank}</p>
                    <p className="text-xs text-muted-foreground">at {formatNumber(p.atXP)} XP</p>
                  </div>
                  <p className="meta">{formatDateShort(p.occurredAt)}</p>
                </li>
              ))}
          </ol>
        )}
      </section>

      <ImportDialog open={imp} onOpenChange={setImp} />
      <ExportDialog open={exp} onOpenChange={setExp} />
      <ResetDialog open={reset} onOpenChange={setReset} onConfirm={doReset} />
      <SettingsDrawer
        open={settings}
        onOpenChange={setSettings}
        onImport={() => {
          setSettings(false);
          setImp(true);
        }}
        onExport={() => {
          setSettings(false);
          setExp(true);
        }}
        onReset={() => {
          setSettings(false);
          setReset(true);
        }}
      />
      <AvatarPicker open={avatarOpen} onOpenChange={setAvatarOpen} />
    </div>
  );
}

function BioField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="flex flex-col gap-2 rounded-[6px] bg-surface p-4 hairline">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent font-display text-2xl font-medium tabular-nums outline-none"
      />
    </label>
  );
}
