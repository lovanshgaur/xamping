import { useMemo } from "react";
import { buildAnalyticsSeries } from "@/lib/bootxamp/services/analytics.service";
import { useBootxamp } from "./useBootxamp";

export function useAnalytics() {
  const { data } = useBootxamp();
  return useMemo(() => buildAnalyticsSeries(data), [data]);
}
