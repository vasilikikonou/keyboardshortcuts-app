export type Platform = "windows" | "mac" | "linux";
export type Shortcut = {
  id: string;
  title: string;
  description: string;
  category: string;
  app: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  task: string;
  keys: Partial<Record<Platform, string[]>>;
  mode?: string;
  sequence?: boolean;
  source: string;
};

export const platformNames: Record<Platform, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};
export function getKeys(shortcut: Shortcut, platform: Platform): string[] {
  return shortcut.keys[platform] ?? Object.values(shortcut.keys)[0] ?? [];
}
export function comboText(shortcut: Shortcut, platform: Platform) {
  return getKeys(shortcut, platform).join(shortcut.sequence ? " → " : " + ");
}
export function normalizeSearch(text: string) {
  return text
    .toLowerCase()
    .replace(/command|⌘/g, "cmd")
    .replace(/control/g, "ctrl")
    .replace(/option|⌥/g, "alt")
    .replace(/windows key|super/g, "win")
    .replace(/[^a-z0-9]/g, "");
}
export function matchesSearch(
  shortcut: Shortcut,
  query: string,
  platform?: Platform
) {
  if (!query.trim()) return true;
  const terms = query.toLowerCase().trim().split(/\s+/);
  const mappings = platform
    ? shortcut.keys[platform]
      ? { [platform]: shortcut.keys[platform] }
      : shortcut.keys
    : shortcut.keys;
  const searchable = [
    shortcut.title,
    shortcut.description,
    shortcut.app,
    shortcut.category,
    shortcut.task,
    shortcut.level,
    shortcut.mode,
    ...Object.entries(mappings).flatMap(([name, keys]) => [
      name,
      platformNames[name as Platform],
      ...(keys ?? []),
    ]),
  ]
    .join(" ")
    .toLowerCase();
  const comboQuery = normalizeSearch(query);
  const keyMatch = Object.values(mappings).some(keys => {
    const normalized = normalizeSearch((keys ?? []).join(""));
    return normalized.includes(comboQuery);
  });
  return (
    terms.every(term => searchable.includes(term)) ||
    (comboQuery.length > 0 && keyMatch)
  );
}
export const beginnerPriority = [
  "copy",
  "paste",
  "cut",
  "undo",
  "save",
  "select all",
  "find",
  "redo",
  "switch",
  "screenshot",
];
export function popularity(shortcut: Shortcut) {
  const index = beginnerPriority.findIndex(word =>
    shortcut.title.toLowerCase().startsWith(word)
  );
  return (
    (shortcut.category === "universal" ? 100 : 0) +
    (index >= 0 ? 30 - index : 0) +
    (shortcut.level === "Beginner" ? 10 : 0)
  );
}
