import type { BrowserVariant, Shortcut } from "../lib/shortcuts";

function normalizeTitle(title: string) {
  return title.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function mergeBrowserShortcuts(shortcuts: Shortcut[]): Shortcut[] {
  const groups = new Map<string, Shortcut[]>();
  for (const shortcut of shortcuts) {
    const key = normalizeTitle(shortcut.title);
    const group = groups.get(key) ?? [];
    group.push(shortcut);
    groups.set(key, group);
  }

  return [...groups.values()].map(group => {
    const first = group[0];
    const variants: BrowserVariant[] = group.flatMap(shortcut =>
      shortcut.browserVariants?.length
        ? shortcut.browserVariants
        : [
            {
              app: shortcut.app,
              description: shortcut.description,
              keys: shortcut.keys,
              source: shortcut.source,
            },
          ]
    );
    const browserApps = [...new Set(variants.map(variant => variant.app))];

    if (group.length === 1 && !first.browserVariants?.length) {
      return {
        ...first,
        app: "Browsers",
        browserApps,
        browserVariants: variants,
      };
    }

    return {
      ...first,
      app: "Browsers",
      browserApps,
      browserVariants: variants,
      aliases: [
        ...new Set(
          group
            .flatMap(shortcut => [shortcut.id, ...(shortcut.aliases ?? [])])
            .filter(id => id !== first.id)
        ),
      ],
    };
  });
}
