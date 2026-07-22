import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Download } from "lucide-react";
import { triggerDownload } from "@/utils/download";
import { EmptyState } from "./EmptyState";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

/**
 * Chart.js editorial graph with a PNG export.
 *
 * @param {{
 *   title: string,
 *   description?: string,
 *   data: {date?:string,label?:string,value:number}[],
 *   variant?: "line"|"bar",
 *   filename: string,
 *   className?: string,
 * }} props
 */
export function GraphCard({ title, description, data, variant = "line", filename, className }) {
  const chartRef = useRef(null);
  const hasData = Array.isArray(data) && data.length > 0;

  const onExport = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.toBase64Image("image/png", 1);
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => triggerDownload(filename, blob));
  };

  const styles = readChartTokens();
  const labels = data.map((p) => p.label ?? p.date ?? "");
  const values = data.map((p) => p.value);

  const dataset =
    variant === "line"
      ? {
          labels,
          datasets: [
            {
              data: values,
              borderColor: styles.foreground,
              backgroundColor: styles.accentSoft,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: styles.accent,
              borderWidth: 1.5,
              tension: 0.35,
              fill: true,
            },
          ],
        }
      : {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: styles.foreground,
              hoverBackgroundColor: styles.accent,
              borderRadius: 3,
              borderSkipped: false,
              barPercentage: 0.7,
              categoryPercentage: 0.75,
            },
          ],
        };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: styles.surface,
        borderColor: styles.border,
        borderWidth: 1,
        titleColor: styles.foreground,
        bodyColor: styles.mutedForeground,
        titleFont: { family: "Inter Tight", size: 12, weight: "500" },
        bodyFont: { family: "Inter", size: 11 },
        padding: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        border: { color: styles.border },
        grid: { display: false },
        ticks: { color: styles.mutedForeground, font: { size: 10 }, maxTicksLimit: 8, autoSkip: true },
      },
      y: {
        border: { display: false },
        grid: { color: styles.border, drawTicks: false },
        ticks: { color: styles.mutedForeground, font: { size: 10 }, maxTicksLimit: 5 },
      },
    },
  };

  return (
    <section className={cn("hairline rounded-[6px] bg-surface p-6 lift", className)}>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{title}</p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {hasData ? (
          <Button variant="ghost" size="sm" onClick={onExport} aria-label={`Export ${title} as PNG`} className="press">
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            PNG
          </Button>
        ) : null}
      </header>
      {hasData ? (
        <div className="relative h-[220px]">
          {variant === "line" ? (
            <Line ref={chartRef} data={dataset} options={options} />
          ) : (
            <Bar ref={chartRef} data={dataset} options={options} />
          )}
        </div>
      ) : (
        <EmptyState
          compact
          title="No analytics available."
          description="This graph populates once related days or data points exist."
        />
      )}
    </section>
  );
}

function readChartTokens() {
  if (typeof window === "undefined") {
    return {
      foreground: "#111",
      mutedForeground: "#888",
      accent: "#e05a2b",
      accentSoft: "rgba(224,90,43,0.15)",
      border: "#ddd",
      surface: "#fff",
    };
  }
  const style = getComputedStyle(document.documentElement);
  const raw = (name, fb) => style.getPropertyValue(name).trim() || fb;
  const fg = raw("--foreground", "oklch(0.16 0 0)");
  const accent = raw("--accent", "oklch(0.62 0.19 45)");
  return {
    foreground: fg,
    mutedForeground: raw("--muted-foreground", "oklch(0.48 0 0)"),
    accent,
    accentSoft: `color-mix(in oklab, ${accent} 18%, transparent)`,
    border: raw("--border", "oklch(0.90 0 0)"),
    surface: raw("--surface", "oklch(1 0 0)"),
  };
}
