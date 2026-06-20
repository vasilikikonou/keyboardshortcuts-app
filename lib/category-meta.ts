import {
  AppWindow,
  Code2,
  Command,
  FileText,
  Globe,
  Globe2,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react"

export type OsBadge = "All" | "Win" | "Mac" | "Linux"

export interface CategoryMeta {
  /** Lucide icon used for the category. */
  Icon: LucideIcon
  /** Accent color (hex) used for icon tints, accent bars, and badges. */
  color: string
  /** OS badge shown on each shortcut card in this category. */
  badge: OsBadge
}

/**
 * Per-category visual identity. Colors double as decorative data-viz accents
 * (one distinct hue per category) and are the single source of truth for the
 * colored icons, hover accent bars, and OS badges across the UI.
 */
export const categoryMeta: Record<string, CategoryMeta> = {
  universal: { Icon: Globe, color: "#fbbf24", badge: "All" },
  windows: { Icon: AppWindow, color: "#60a5fa", badge: "Win" },
  macos: { Icon: Command, color: "#a78bfa", badge: "Mac" },
  linux: { Icon: Terminal, color: "#4ade80", badge: "Linux" },
  browsers: { Icon: Globe2, color: "#f472b6", badge: "All" },
  vscode: { Icon: Code2, color: "#38bdf8", badge: "All" },
  microsoft365: { Icon: FileText, color: "#fb923c", badge: "All" },
  productivity: { Icon: Sparkles, color: "#2dd4bf", badge: "All" },
}

const FALLBACK: CategoryMeta = { Icon: Globe, color: "#a78bfa", badge: "All" }

export function metaFor(categoryId: string): CategoryMeta {
  return categoryMeta[categoryId] ?? FALLBACK
}
