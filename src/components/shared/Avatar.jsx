import { cn } from "@/lib/utils";
import { buildAvatarUrl, normalizeAvatar } from "@/lib/bootxamp/domain/avatar";

/**
 * DiceBear-backed avatar. Falls back to initials via CSS if the image fails.
 *
 * @param {{
 *   avatar: any,
 *   name?: string,
 *   size?: number,
 *   className?: string,
 *   alt?: string,
 * }} props
 */
export function Avatar({ avatar, name, size = 64, className, alt }) {
  const { style, seed } = normalizeAvatar(avatar);
  const url = buildAvatarUrl({ style, seed, size });
  const label = alt || `${name || "Employee"} avatar`;
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-muted hairline",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <img
        src={url}
        alt={label}
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
