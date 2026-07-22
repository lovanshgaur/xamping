/**
 * Build named datasets for the Analytics page graphs.
 * @param {import("../schema").BootXampData} data
 */
export function buildAnalyticsSeries(data) {
  const a = data.analytics ?? {};
  return {
    xp: xpOverTime(data),
    hours: sumSeries([a.codingHours, a.studyHours, a.readingHours]),
    coding: a.codingHours ?? [],
    study: a.studyHours ?? [],
    sleep: a.sleepHours ?? [],
    steps: a.steps ?? [],
    calories: a.calories ?? [],
    heartPoints: a.heartPoints ?? [],
    distance: a.distance ?? [],
    timeMoving: a.timeMoving ?? [],
    weight: buildWeightSeries(data),
    applications: a.applications ?? [],
    commits: a.commits ?? [],
    focus: a.focus ?? [],
    energy: a.energy ?? [],
    dailyReview: a.dailyReview ?? [],
    weeklyReview: a.weeklyReview ?? [],
    operateScore: buildOperateScoreSeries(data),
    departmentProgress: departmentProgressSeries(data),
    weeklyCompletion: weeklyCompletionSeries(data),
  };
}

function xpOverTime(data) {
  const points = [];
  let running = 0;
  const submitted = [];
  for (const w of data.weeks) for (const d of w.days) if (d.submitted) submitted.push(d);
  submitted.sort((a, b) => a.date.localeCompare(b.date));
  for (const d of submitted) {
    running += d.score || sumDayXP(d);
    points.push({ date: d.date, value: running });
  }
  return points;
}

function sumDayXP(day) {
  let sum = 0;
  for (const dept of day.departments) for (const t of dept.tasks) if (t.completed) sum += t.xp ?? 0;
  return sum;
}

function sumSeries(seriesList) {
  const map = new Map();
  for (const s of seriesList ?? [])
    for (const p of s ?? []) map.set(p.date, (map.get(p.date) ?? 0) + p.value);
  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function departmentProgressSeries(data) {
  const totals = { learn: 0, build: 0, grow: 0, career: 0, operate: 0 };
  for (const w of data.weeks)
    for (const d of w.days)
      for (const dept of d.departments)
        for (const t of dept.tasks) if (t.completed) totals[dept.slug] += t.xp ?? 0;
  return Object.entries(totals).map(([label, value]) => ({ label, value }));
}

function weeklyCompletionSeries(data) {
  return data.weeks.map((w) => ({
    label: `W${w.weekNumber}`,
    value: Math.round(w.progress * 100),
  }));
}

function buildOperateScoreSeries(data) {
  const byDate = data.operate?.byDate ?? {};
  return Object.values(byDate)
    .map((e) => ({ date: e.date, value: Math.round((e.scores?.overall ?? 0) * 100) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildWeightSeries(data) {
  const history = data.employee?.weightHistory ?? [];
  return history
    .map((h) => ({ date: h.date, value: Number(h.weight) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
