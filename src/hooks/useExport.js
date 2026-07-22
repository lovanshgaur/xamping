import { useCallback } from "react";
import { serializeExport } from "@/lib/bootxamp/services/export.service";
import { downloadText } from "@/utils/download";
import { useBootxamp } from "./useBootxamp";

export function useExport() {
  const { mutate } = useBootxamp();

  const run = useCallback(
    (type, scope) => {
      let result = null;
      mutate((d) => {
        result = serializeExport(d, type, scope);
      });
      if (result) downloadText(result.filename, result.contents);
      return result;
    },
    [mutate],
  );

  return { exportDaily: (dayId) => run("daily", { dayId }),
           exportWeekly: (weekId) => run("weekly", { weekId }),
           exportDepartment: (deptSlug) => run("department", { deptSlug }),
           exportCareer: () => run("career") };
}
