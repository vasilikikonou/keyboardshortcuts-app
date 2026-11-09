export type Platform = "windows" | "mac" | "linux";
export type PlatformFilter = Platform | "all";
export type BrowserVariant = {
  app: string;
  description: string;
  keys: Partial<Record<Platform, string[]>>;
  source: string;
};
export type ShortcutSourceReference = { label: string; url: string };
export type Shortcut = {
  id: string;
  title: string;
  description: string;
  category: string;
  app: string;
  browserApps?: string[];
  browserVariants?: BrowserVariant[];
  aliases?: string[];
  sourceReferences?: ShortcutSourceReference[];
  level: "Beginner" | "Intermediate" | "Advanced";
  task: string;
  keys: Partial<Record<Platform, string[]>>;
  mode?: string;
  sequence?: boolean;
  source: string;
};

export const platforms: Platform[] = ["windows", "mac", "linux"];
export const platformNames: Record<Platform, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};
export const platformFilterNames: Record<PlatformFilter, string> = {
  all: "All platforms",
  ...platformNames,
};

export function getSupportedPlatforms(shortcut: Shortcut): Platform[] {
  const supported = new Set<Platform>();
  for (const platform of platforms) {
    if (shortcut.keys[platform]?.length) supported.add(platform);
    if (
      shortcut.browserVariants?.some(variant => variant.keys[platform]?.length)
    )
      supported.add(platform);
  }
  return platforms.filter(platform => supported.has(platform));
}

export function getBrowserVariants(shortcut: Shortcut): BrowserVariant[] {
  return shortcut.browserVariants ?? [];
}

export function getShortcutApps(
  shortcut: Shortcut,
  platform?: Platform
): string[] {
  if (shortcut.browserVariants?.length) {
    return shortcut.browserVariants
      .filter(variant => !platform || variant.keys[platform]?.length)
      .map(variant => variant.app);
  }
  return shortcut.browserApps?.length ? shortcut.browserApps : [shortcut.app];
}

export function getKeys(shortcut: Shortcut, platform: Platform): string[] {
  const browserKeys = shortcut.browserVariants?.find(
    variant => variant.keys[platform]?.length
  )?.keys[platform];
  return (
    browserKeys ??
    shortcut.keys[platform] ??
    Object.values(shortcut.keys)[0] ??
    []
  );
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
  const browserVariants = shortcut.browserVariants ?? [];
  const matchingBrowserVariants = platform
    ? browserVariants.filter(variant => variant.keys[platform]?.length)
    : browserVariants;
  const browserNames = browserVariants.length
    ? matchingBrowserVariants.map(variant => variant.app)
    : (shortcut.browserApps ?? []);
  const keyMappings = platform
    ? [
        ...(shortcut.keys[platform] ? [shortcut.keys[platform]!] : []),
        ...browserVariants.flatMap(variant =>
          variant.keys[platform] ? [variant.keys[platform]!] : []
        ),
      ]
    : [
        ...Object.values(shortcut.keys),
        ...browserVariants.flatMap(variant => Object.values(variant.keys)),
      ];
  const isPlatformLabel = (value?: string) =>
    platforms.some(
      item =>
        item === value?.toLowerCase() ||
        platformNames[item].toLowerCase() === value?.toLowerCase()
    );
  const isActivePlatformLabel = (value?: string) =>
    !isPlatformLabel(value) ||
    !platform ||
    value?.toLowerCase() === platform ||
    value?.toLowerCase() === platformNames[platform].toLowerCase();
  const mappingPlatforms = platform
    ? [platform]
    : getSupportedPlatforms(shortcut);
  const platformNamesToSearch = mappingPlatforms.flatMap(item => [
    item,
    platformNames[item],
  ]);
  const searchable = [
    shortcut.title,
    shortcut.description,
    ...(isActivePlatformLabel(shortcut.app) ? [shortcut.app] : []),
    ...browserNames,
    ...matchingBrowserVariants.map(variant => variant.description),
    ...(isActivePlatformLabel(shortcut.category) ? [shortcut.category] : []),
    shortcut.task,
    shortcut.level,
    shortcut.mode,
    ...platformNamesToSearch,
    ...keyMappings.flat(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const comboQuery = normalizeSearch(query);
  const keyMatch = keyMappings.some(keys =>
    normalizeSearch(keys.join("")).includes(comboQuery)
  );
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
