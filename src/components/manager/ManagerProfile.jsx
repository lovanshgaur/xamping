import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { MANAGER_TIERS } from "@/constants/managers";
import { RANKS } from "@/constants/ranks";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

/**
 * @param {{ manager: any, currentRankId: string }} props
 */
export function ManagerProfile({ manager, currentRankId }) {
  const currentIdx = MANAGER_TIERS.findIndex((m) => m.rankId === currentRankId);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-[6px] bg-surface p-6 hairline sm:grid-cols-[auto_minmax(0,1fr)]">
        <Avatar avatar={manager.avatar} name={manager.name} size={112} />
        <div className="min-w-0 space-y-3">
          <p className="eyebrow">Your Manager · {manager.company}</p>
          <h2 className="font-display text-3xl font-medium tracking-tight">{manager.name}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="solid">{manager.position}</Badge>
            <Badge variant="outline">{manager.level}</Badge>
          </div>
          {manager.bio ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{manager.bio}</p>
          ) : null}
        </div>
      </div>

      <div>
        <p className="eyebrow">Mentor progression</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {MANAGER_TIERS.map((m, i) => {
            const unlocked = i <= currentIdx;
            const rank = RANKS.find((r) => r.id === m.rankId);
            return (
              <li
                key={m.rankId}
                className={cn(
                  "flex items-center gap-3 rounded-[4px] bg-surface p-3 hairline",
                  !unlocked && "opacity-50",
                )}
              >
                <Avatar avatar={{ style: m.avatarStyle, seed: m.avatarSeed }} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{m.name}</p>
                  <p className="truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {rank?.name ?? m.rankId} · {m.level}
                  </p>
                </div>
                {!unlocked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
