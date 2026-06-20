"use client"

import { useCallback, type ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Keyboard, Layers, Search, Star, X } from "lucide-react"
import { CategorySidebar, FAVORITES_ID } from "@/components/category-sidebar"
import { ShortcutItem } from "@/components/shortcut-item"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { metaFor } from "@/lib/category-meta"
import {
  categories,
  totalShortcutCount,
  type Platform,
  type Shortcut,
} from "@/lib/shortcuts-data"

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
]

const FAVORITES_KEY = "ks:favorites"

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows"
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("mac")) return "macos"
  if (ua.includes("linux") || ua.includes("x11")) return "linux"
  return "windows"
}

interface RenderGroup {
  categoryId: string
  categoryName: string
  groupId: string
  title: string
  shortcuts: Shortcut[]
}

export function ShortcutsExplorer() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string>("universal")
  const [platform, setPlatform] = useState<Platform>("windows")
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Load persisted favorites + detected platform on mount.
  useEffect(() => {
    setPlatform(detectPlatform())
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) setFavorites(JSON.parse(stored))
    } catch {
      // ignore malformed storage
    }
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch {
        // ignore write failures
      }
      return next
    })
  }, [])

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const normalizedQuery = query.trim().toLowerCase()

  function matches(shortcut: Shortcut): boolean {
    if (!normalizedQuery) return true
    const haystack = [
      shortcut.description,
      shortcut.context,
      shortcut.keys,
      shortcut.macos ?? "",
      shortcut.windows ?? "",
      ...(shortcut.tags ?? []),
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(normalizedQuery)
  }

  // Per-category counts respecting the current search query.
  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const cat of categories) {
      result[cat.id] = cat.groups.reduce(
        (sum, g) => sum + g.shortcuts.filter(matches).length,
        0,
      )
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery])

  // Build the list of groups to render for the current view.
  const renderGroups = useMemo<RenderGroup[]>(() => {
    const groups: RenderGroup[] = []

    if (selected === FAVORITES_ID) {
      for (const cat of categories) {
        for (const g of cat.groups) {
          const shortcuts = g.shortcuts.filter((s) => favoriteSet.has(s.id) && matches(s))
          if (shortcuts.length > 0) {
            groups.push({
              categoryId: cat.id,
              categoryName: cat.name,
              groupId: g.id,
              title: `${cat.name} · ${g.title}`,
              shortcuts,
            })
          }
        }
      }
      return groups
    }

    // When searching, show results across ALL categories.
    const source = normalizedQuery ? categories : categories.filter((c) => c.id === selected)
    for (const cat of source) {
      for (const g of cat.groups) {
        const shortcuts = g.shortcuts.filter(matches)
        if (shortcuts.length > 0) {
          groups.push({
            categoryId: cat.id,
            categoryName: cat.name,
            groupId: g.id,
            title: normalizedQuery ? `${cat.name} · ${g.title}` : g.title,
            shortcuts,
          })
        }
      }
    }
    return groups
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, normalizedQuery, favoriteSet])

  // Flattened order for keyboard navigation.
  const flatIds = useMemo(
    () => renderGroups.flatMap((g) => g.shortcuts.map((s) => s.id)),
    [renderGroups],
  )

  // Keep the active row valid as the list changes.
  useEffect(() => {
    if (activeId && !flatIds.includes(activeId)) setActiveId(null)
  }, [flatIds, activeId])

  const findShortcutById = useCallback((id: string): Shortcut | undefined => {
    for (const cat of categories) {
      for (const g of cat.groups) {
        const found = g.shortcuts.find((s) => s.id === id)
        if (found) return found
      }
    }
    return undefined
  }, [])

  // Global keyboard handling.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)

      // "/" or Cmd/Ctrl+K focuses search.
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }

      if (e.key === "Escape") {
        if (typing) {
          searchRef.current?.blur()
        }
        setActiveId(null)
        return
      }

      if (typing) return

      if (e.key === "ArrowDown" || e.key === "j") {
        if (flatIds.length === 0) return
        e.preventDefault()
        setActiveId((cur) => {
          const idx = cur ? flatIds.indexOf(cur) : -1
          return flatIds[Math.min(idx + 1, flatIds.length - 1)]
        })
      } else if (e.key === "ArrowUp" || e.key === "k") {
        if (flatIds.length === 0) return
        e.preventDefault()
        setActiveId((cur) => {
          const idx = cur ? flatIds.indexOf(cur) : flatIds.length
          return flatIds[Math.max(idx - 1, 0)]
        })
      } else if (e.key.toLowerCase() === "f" && activeId) {
        e.preventDefault()
        toggleFavorite(activeId)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flatIds, activeId, toggleFavorite])

  // Scroll the active row into view.
  useEffect(() => {
    if (!activeId) return
    const el = document.getElementById(`row-${activeId}`)
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [activeId])

  const activeCategory = categories.find((c) => c.id === selected)
  const headerTitle = selected === FAVORITES_ID ? "Favorites" : activeCategory?.name ?? ""
  const headerDesc =
    selected === FAVORITES_ID
      ? "Shortcuts you've starred. Press F on a focused row to add or remove."
      : activeCategory?.description ?? ""

  const resultCount = flatIds.length

  return (
    <div className="flex min-h-svh flex-col">
      <TopBar
        query={query}
        setQuery={setQuery}
        searchRef={searchRef}
        platform={platform}
        setPlatform={setPlatform}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-0 lg:gap-8 lg:px-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border py-6 pr-2 lg:block">
          <div className="sticky top-24">
            <CategorySidebar
              selected={selected}
              onSelect={(id) => {
                setSelected(id)
                setActiveId(null)
              }}
              counts={counts}
              favoritesCount={favorites.length}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-0">
          {/* Mobile category selector */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <MobileChip
              label="Favorites"
              active={selected === FAVORITES_ID}
              onClick={() => setSelected(FAVORITES_ID)}
            />
            {categories.map((c) => (
              <MobileChip
                key={c.id}
                label={c.name}
                active={selected === c.id}
                onClick={() => setSelected(c.id)}
              />
            ))}
          </div>

          <SectionHeading
            selected={selected}
            normalizedQuery={normalizedQuery}
            query={query}
            headerTitle={headerTitle}
            headerDesc={headerDesc}
            resultCount={resultCount}
          />

          {renderGroups.length === 0 ? (
            <EmptyState
              isFavorites={selected === FAVORITES_ID && !normalizedQuery}
              query={query}
            />
          ) : (
            <div className="flex flex-col gap-8">
              {renderGroups.map((group) => {
                const meta = metaFor(group.categoryId)
                return (
                  <section key={`${group.categoryId}-${group.groupId}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                        aria-hidden
                      />
                      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </h2>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                      {group.shortcuts.map((s) => (
                        <div key={s.id} id={`row-${s.id}`}>
                          <ShortcutItem
                            shortcut={s}
                            platform={platform}
                            isFavorite={favoriteSet.has(s.id)}
                            onToggleFavorite={toggleFavorite}
                            accent={meta.color}
                            badge={meta.badge}
                            active={activeId === s.id}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

interface TopBarProps {
  query: string
  setQuery: (v: string) => void
  searchRef: React.RefObject<HTMLInputElement | null>
  platform: Platform
  setPlatform: (p: Platform) => void
}

function TopBar({ query, setQuery, searchRef, platform, setPlatform }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_16px_-2px_var(--primary)]">
            <Keyboard className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">Shortcut Explorer</p>
            <p className="text-xs text-muted-foreground">
              {totalShortcutCount()} shortcuts, every platform
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 md:max-w-md md:justify-end">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts, keys, actions…"
              aria-label="Search shortcuts"
              className="pl-9 pr-16"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
                /
              </kbd>
            )}
          </div>

          <PlatformToggle platform={platform} setPlatform={setPlatform} />
        </div>
      </div>
    </header>
  )
}

function PlatformToggle({
  platform,
  setPlatform,
}: {
  platform: Platform
  setPlatform: (p: Platform) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Display keys for platform"
      className="flex shrink-0 items-center rounded-md border border-border bg-card p-0.5"
    >
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={platform === p.id}
          onClick={() => setPlatform(p.id)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            platform === p.id
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

function MobileChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

function SectionHeading({
  selected,
  normalizedQuery,
  query,
  headerTitle,
  headerDesc,
  resultCount,
}: {
  selected: string
  normalizedQuery: string
  query: string
  headerTitle: string
  headerDesc: string
  resultCount: number
}) {
  const isFavorites = selected === FAVORITES_ID
  const cat = categories.find((c) => c.id === selected)
  const meta = cat ? metaFor(cat.id) : null

  // Icon box: search results, favorites, or the active category color.
  let icon: ReactNode
  let accent = "var(--primary)"
  if (normalizedQuery) {
    icon = <Search className="size-5 text-primary" />
  } else if (isFavorites) {
    icon = <Star className="size-5 text-chart-3" fill="currentColor" />
    accent = "var(--chart-3)"
  } else if (meta) {
    const Icon = meta.Icon
    icon = <Icon className="size-5" style={{ color: meta.color }} />
    accent = meta.color
  } else {
    icon = <Layers className="size-5 text-primary" />
  }

  return (
    <header className="mb-6 flex flex-wrap items-center gap-3">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 18%, transparent)` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">
          {normalizedQuery ? `Results for “${query}”` : headerTitle}
        </h1>
        <p className="mt-0.5 text-pretty text-sm text-muted-foreground">
          {normalizedQuery
            ? `${resultCount} shortcut${resultCount === 1 ? "" : "s"} across all categories`
            : headerDesc}
        </p>
      </div>
      {!normalizedQuery && (
        <span
          className="ml-auto hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:flex"
          style={{ borderColor: `color-mix(in oklab, ${accent} 35%, transparent)` }}
        >
          <span className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
          {resultCount} shortcuts
        </span>
      )}
    </header>
  )
}

function EmptyState({ isFavorites, query }: { isFavorites: boolean; query: string }): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      {isFavorites ? (
        <>
          <Star className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No favorites yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Star any shortcut to pin it here. You can also focus a row and press F.
          </p>
        </>
      ) : (
        <>
          <Search className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No matches for “{query}”</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different action, key, or app name.
          </p>
        </>
      )}
    </div>
  )
}
