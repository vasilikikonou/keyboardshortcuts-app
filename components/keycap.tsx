import { cn } from "@/lib/utils"

interface KeyComboProps {
  /** Key combo string using "+" separators, e.g. "Ctrl + Shift + P". */
  combo: string
  className?: string
  /** Slightly larger keycaps, used for the spotlight preview. */
  size?: "sm" | "md"
}

/** A single character that should render as an enlarged symbol glyph. */
function isSymbol(key: string): boolean {
  return key.length === 1 && !/[a-z0-9]/i.test(key)
}

/**
 * Renders a key combination as a row of playful, 3D keycaps.
 * Splits on "+" and renders a small "+" glyph between keys.
 */
export function KeyCombo({ combo, className, size = "sm" }: KeyComboProps) {
  const keys = combo.split("+").map((k) => k.trim())

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {keys.map((key, i) => (
        <span key={`${key}-${i}`} className="flex items-center gap-1.5">
          <kbd
            className={cn(
              "inline-flex select-none items-center justify-center rounded-md",
              "border border-white/12 border-b-[3px] border-b-black/45 bg-kbd",
              "font-mono font-semibold text-kbd-foreground",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
              size === "sm" ? "h-7 min-w-7 px-2 text-xs" : "h-9 min-w-9 px-2.5 text-sm",
              isSymbol(key) && (size === "sm" ? "text-sm" : "text-base"),
            )}
          >
            {key}
          </kbd>
          {i < keys.length - 1 && (
            <span aria-hidden className="text-xs font-normal text-muted-foreground">
              +
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
