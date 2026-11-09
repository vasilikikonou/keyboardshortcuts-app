import {
  platformNames,
  platforms,
  type Platform,
  type Shortcut,
} from "../lib/shortcuts";

const systemCategories = new Set(["windows", "macos", "linux", "universal"]);
function normalizeTitle(title: string) {
  return title.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}
function mergeKey(shortcut: Shortcut) {
  return [
    normalizeTitle(shortcut.title),
    shortcut.task.trim().toLocaleLowerCase(),
    shortcut.mode ?? "",
    shortcut.sequence ? "sequence" : "chord",
  ].join("|");
}

export function mergeSystemShortcuts(shortcuts: Shortcut[]): Shortcut[] {
  const candidateGroups = new Map<string, Shortcut[]>();
  for (const shortcut of shortcuts) {
    if (!systemCategories.has(shortcut.category)) continue;
    const key = mergeKey(shortcut);
    const group = candidateGroups.get(key) ?? [];
    group.push(shortcut);
    candidateGroups.set(key, group);
  }

  const mergeGroups = new Map<string, Shortcut[]>();
  for (const [key, group] of candidateGroups) {
    const categories = new Set(group.map(shortcut => shortcut.category));
    if (group.length > 1 && categories.size === group.length)
      mergeGroups.set(key, group);
  }

  const emitted = new Set<string>();
  return shortcuts.flatMap(shortcut => {
    const key = mergeKey(shortcut);
    const group = mergeGroups.get(key);
    if (!group) return [shortcut];
    if (emitted.has(key)) return [];
    emitted.add(key);

    const canonical =
      group.find(item => item.category === "universal") ?? group[0];
    const keys: Shortcut["keys"] = {};
    for (const platform of platforms) {
      const mapping = group.find(item => item.keys[platform]?.length)?.keys[
        platform
      ];
      if (mapping) keys[platform] = mapping;
    }
    const sourceLabels = new Map<string, Set<string>>();
    for (const item of group) {
      const urlLabels = sourceLabels.get(item.source) ?? new Set<string>();
      const platformLabel =
        item.category === "macos"
          ? platformNames.mac
          : item.category === "linux"
            ? platformNames.linux
            : item.category === "windows"
              ? platformNames.windows
              : item.app;
      urlLabels.add(platformLabel);
      sourceLabels.set(item.source, urlLabels);
    }
    const sourceReferences = [...sourceLabels].map(([url, labels]) => ({
      url,
      label: [...labels].join(" / "),
    }));

    return [
      {
        ...canonical,
        category: "universal",
        app: "Universal basics",
        keys,
        aliases: [
          ...new Set(
            group.map(item => item.id).filter(id => id !== canonical.id)
          ),
        ],
        sourceReferences,
      },
    ];
  });
}
