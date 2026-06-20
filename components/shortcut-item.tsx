"use client"

import { Star } from "lucide-react"
import { KeyCombo } from "@/components/keycap"
import { cn } from "@/lib/utils"
import type { OsBadge } from "@/lib/category-meta"
import { keysForPlatform, type Platform, type Shortcut } from "@/lib/shortcuts-data"

interface ShortcutItemProps {
  shortcut: Shortcut
  platform: Platform
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  /** Accent color (hex) for the hover bar + popular dot. */
  accent: string
  /** OS badge label shown in the card corner. */
  badge: OsBadge
  /** Whether this row is the active keyboard-navigation target. */
  active?: boolean
}

const badgeStyles: Record<OsBadge, string> = {
  All: "text-chart-3",
  Win: "text-[#60a5fa]",
  Mac: "text-[#a78bfa]",
  Linux: "text-[#4ade80]",
}

export function ShortcutItem({
  shortcut,
  platform,
  isFavorite,
  onToggleFavorite,
  accent,
  badge,
  active,
}: ShortcutItemProps) {
  return (
    <div
      data-active={active || undefined}
      style={{ "--accent": accent } as React.CSSProperties}
      className={cn(
        "group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 transition-all",
        "hover:-translate-y-0.5 hover:border-white/20 hover:bg-secondary/40",
        "data-[active=true]:border-[var(--accent)] data-[active=true]:ring-1 data-[active=true]:ring-[var(--accent)]",
      )}
    >
      {/* Colored accent bar that reveals on hover / active. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[var(--accent)] opacity-0 transition-all group-hover:scale-x-100 group-hover:opacity-100 group-data-[active=true]:scale-x-100 group-data-[active=true]:opacity-100"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <p className="text-pretty font-medium leading-snug text-foreground">
            {shortcut.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
              badgeStyles[badge],
            )}
          >
            {badge}
          </span>
          <button
            type="button"
            onClick={() => onToggleFavorite(shortcut.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={cn(
              "rounded-md p-1 transition-colors hover:bg-white/10",
              isFavorite ? "text-chart-3" : "text-muted-foreground hover:text-chart-3",
            )}
          >
            <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {shortcut.context && (
        <p className="text-xs leading-relaxed text-muted-foreground">{shortcut.context}</p>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <KeyCombo combo={keysForPlatform(shortcut, platform)} />
        {shortcut.popular && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            Popular
          </span>
        )}
      </div>
    </div>
  )
}
