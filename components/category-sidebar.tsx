"use client"

import { Star } from "lucide-react"
import { categories } from "@/lib/shortcuts-data"
import { metaFor } from "@/lib/category-meta"
import { cn } from "@/lib/utils"

export const FAVORITES_ID = "favorites"

interface CategorySidebarProps {
  selected: string
  onSelect: (id: string) => void
  counts: Record<string, number>
  favoritesCount: number
}

export function CategorySidebar({ selected, onSelect, counts, favoritesCount }: CategorySidebarProps) {
  return (
    <nav aria-label="Shortcut categories" className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onSelect(FAVORITES_ID)}
        aria-current={selected === FAVORITES_ID}
        className={cn(
          "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
          selected === FAVORITES_ID
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-chart-3/15">
          <Star className="size-4 text-chart-3" fill="currentColor" />
        </span>
        <span className="flex-1 font-medium">Favorites</span>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {favoritesCount}
        </span>
      </button>

      <div className="my-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Categories
      </div>

      {categories.map((cat) => {
        const isActive = selected === cat.id
        const { Icon, color } = metaFor(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            aria-current={isActive}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-md transition-colors"
              style={{ backgroundColor: `${color}22` }}
            >
              <Icon className="size-4" style={{ color }} />
            </span>
            <span className="flex-1 truncate font-medium">{cat.name}</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
              {counts[cat.id] ?? 0}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
