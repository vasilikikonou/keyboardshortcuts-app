import type { Shortcut, Platform } from "@/lib/shortcuts";
import browserData from "./browsers.json";
import jetBrainsData from "./jetbrains.json";
import linuxData from "./linux.json";
import macData from "./macos.json";
import microsoft365Data from "./microsoft365.json";
import universalData from "./universal.json";
import vimData from "./vim.json";
import vsCodeData from "./vscode.json";
import windowsData from "./windows.json";

const collections = [
  browserData,
  jetBrainsData,
  linuxData,
  macData,
  microsoft365Data,
  universalData,
  vimData,
  vsCodeData,
  windowsData,
].map(data => data as unknown as Shortcut[]);
const modifiers = new Set([
  "Ctrl",
  "Control",
  "Cmd",
  "Command",
  "Alt",
  "Option",
  "Shift",
  "Win",
  "Super",
  "Meta",
  "Fn",
]);
function expandKeys(keys: string[]) {
  return keys.flatMap(key => {
    if (
      !/^(Ctrl|Control|Cmd|Command|Alt|Option|Shift|Win|Super|Meta|Fn)\+/.test(
        key
      )
    )
      return [key];
    const parts = key.split("+");
    if (parts[parts.length - 1] === "") {
      while (parts[parts.length - 1] === "") parts.pop();
      parts.push("+");
    }
    return parts.filter(Boolean);
  });
}
function sequenceKeys(keys: string[]) {
  const groups: string[] = [];
  let pending: string[] = [];
  for (const key of keys) {
    if (modifiers.has(key)) pending.push(key);
    else {
      groups.push([...pending, key].join("+"));
      pending = [];
    }
  }
  // Repeated modifier taps, such as Shift five times, are a sequence, not a chord.
  if (pending.length) groups.push(...pending);
  return groups;
}
export const shortcuts: Shortcut[] = collections
  .flat()
  .filter(item => item.id && item.title && item.keys)
  .map(item => ({
    ...item,
    app:
      item.app === "Universal basics" && item.category === "windows"
        ? "Windows"
        : item.app === "Universal basics" && item.category === "macos"
          ? "macOS"
          : item.app,
    keys: Object.fromEntries(
      Object.entries(item.keys).map(([platform, keys]) => [
        platform as Platform,
        item.sequence ? sequenceKeys(keys ?? []) : expandKeys(keys ?? []),
      ])
    ),
  }));
export const categoryOrder = [
  "universal",
  "windows",
  "macos",
  "linux",
  "browsers",
  "vscode",
  "jetbrains",
  "microsoft365",
  "vim",
];
