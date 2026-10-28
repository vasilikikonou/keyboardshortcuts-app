import {
  AppWindow,
  Globe2,
  Code2,
  Command,
  Layers3,
  Keyboard,
  Monitor,
  Terminal,
  SquareTerminal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
export const categories = [
  {
    id: "all",
    label: "All shortcuts",
    short: "Everything",
    color: "yellow",
    icon: Layers3,
  },
  {
    id: "universal",
    label: "Universal basics",
    short: "The essentials",
    color: "orange",
    icon: Keyboard,
  },
  {
    id: "windows",
    label: "Windows",
    short: "Work your windows",
    color: "blue",
    icon: Monitor,
  },
  {
    id: "macos",
    label: "macOS",
    short: "Make it a Mac thing",
    color: "purple",
    icon: Command,
  },
  {
    id: "linux",
    label: "Linux",
    short: "Desktop & terminal",
    color: "yellow",
    icon: Terminal,
  },
  {
    id: "browsers",
    label: "Browsers",
    short: "Surf a little faster",
    color: "green",
    icon: Globe2,
  },
  {
    id: "editors",
    label: "Code editors",
    short: "Less typing, more building",
    color: "blue",
    icon: Code2,
  },
  {
    id: "microsoft365",
    label: "Microsoft 365",
    short: "Your productive side",
    color: "orange",
    icon: Layers3,
  },
  {
    id: "vim",
    label: "Vim",
    short: "Stay in the flow",
    color: "green",
    icon: SquareTerminal,
  },
];
export function categoryMatches(id: string, category: string) {
  return (
    id === "all" ||
    id === category ||
    (id === "editors" && ["vscode", "jetbrains"].includes(category))
  );
}
export function categoryInfo(id: string) {
  return (
    categories.find(c => c.id === id) ??
    (["vscode", "jetbrains"].includes(id) ? categories[6] : categories[0])
  );
}
export function CategoryIcon({
  category,
  size = 18,
  className = "",
}: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon: LucideIcon = categoryInfo(category).icon;
  return <Icon size={size} strokeWidth={2.5} className={className} />;
}
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <AppWindow size={22} strokeWidth={3} />
    </span>
  );
}
export function SparkleMark() {
  return <Sparkles size={15} strokeWidth={2.8} />;
}
