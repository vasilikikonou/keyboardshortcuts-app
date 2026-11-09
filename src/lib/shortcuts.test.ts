import assert from "node:assert/strict";
import test from "node:test";
import {
  comboText,
  getKeys,
  getShortcutApps,
  getSupportedPlatforms,
  matchesSearch,
  normalizeSearch,
  popularity,
  type Shortcut,
} from "./shortcuts";
const copy: Shortcut = {
  id: "test-copy",
  title: "Copy selection",
  description: "Copy selected text to the clipboard.",
  category: "universal",
  app: "Universal basics",
  level: "Beginner",
  task: "Editing",
  keys: { windows: ["Ctrl", "C"], mac: ["Cmd", "C"], linux: ["Ctrl", "C"] },
  source: "https://support.apple.com",
};
test("matches actions, descriptions, and applications", () => {
  assert.equal(matchesSearch(copy, "copy"), true);
  assert.equal(matchesSearch(copy, "clipboard"), true);
  assert.equal(matchesSearch(copy, "universal"), true);
  assert.equal(matchesSearch(copy, "Excel"), false);
});

test("matches combinations with symbols, spaces, and aliases", () => {
  for (const query of ["Ctrl+C", "Ctrl C", "control c", "⌘ C", "command c"])
    assert.equal(matchesSearch(copy, query), true);
});

test("matches individual keys and platform names", () => {
  assert.equal(matchesSearch(copy, "ctrl"), true);
  assert.equal(matchesSearch(copy, "macOS"), true);
  assert.equal(matchesSearch(copy, "Windows"), true);
});

test("formats simultaneous and sequential commands differently", () => {
  assert.equal(comboText(copy, "mac"), "Cmd + C");
  assert.equal(
    comboText(
      { ...copy, keys: { windows: ["g", "g"] }, sequence: true },
      "windows"
    ),
    "g → g"
  );
});

test("uses a safe display fallback for saved platform-specific shortcuts", () => {
  assert.deepEqual(
    getKeys({ ...copy, keys: { windows: ["Win", "D"] } }, "mac"),
    ["Win", "D"]
  );
});

test("reports all operating systems supported by a shared shortcut", () => {
  assert.deepEqual(getSupportedPlatforms(copy), ["windows", "mac", "linux"]);
});

test("normalizes common modifier aliases", () => {
  assert.equal(normalizeSearch("Option + Command + C"), "altcmdc");
});

test("ranks beginner shortcuts ahead of obscure advanced commands", () => {
  assert.ok(
    popularity(copy) >
      popularity({
        ...copy,
        title: "Toggle obscure mode",
        category: "vim",
        level: "Advanced",
      })
  );
});

test("searches only the active platform mapping when one is selected", () => {
  assert.equal(matchesSearch(copy, "Ctrl+C", "mac"), false);
  assert.equal(matchesSearch(copy, "Cmd+C", "mac"), true);
  assert.equal(matchesSearch(copy, "Ctrl+C", "windows"), true);
  assert.equal(matchesSearch(copy, "Cmd", "windows"), false);
  assert.equal(matchesSearch(copy, "Ctrl", "mac"), false);
  assert.equal(matchesSearch(copy, "macOS", "windows"), false);
  assert.equal(matchesSearch(copy, "Windows", "mac"), false);
  assert.equal(matchesSearch(copy, "copy", "mac"), true);
  assert.equal(matchesSearch(copy, "clipboard", "mac"), true);
  const windowsOnly = { ...copy, keys: { windows: ["Ctrl", "C"] } };
  assert.equal(matchesSearch(windowsOnly, "Windows"), true);
  assert.equal(matchesSearch(windowsOnly, "macOS"), false);
});

test("searches merged browser labels and each browser key mapping", () => {
  const browserShortcut: Shortcut = {
    ...copy,
    id: "browser-tab",
    title: "New tab",
    category: "browsers",
    app: "Browsers",
    browserApps: ["Google Chrome", "Safari"],
    browserVariants: [
      {
        app: "Google Chrome",
        description: "Open a new tab in Chrome.",
        keys: { windows: ["Ctrl", "T"], mac: ["Cmd", "T"] },
        source: "https://chrome.example/",
      },
      {
        app: "Safari",
        description: "Open a new tab in Safari.",
        keys: { mac: ["Cmd", "T"] },
        source: "https://safari.example/",
      },
    ],
    keys: { windows: ["Ctrl", "T"], mac: ["Cmd", "T"] },
  };
  assert.deepEqual(getSupportedPlatforms(browserShortcut), ["windows", "mac"]);
  assert.equal(getKeys(browserShortcut, "mac").join("+"), "Cmd+T");
  assert.equal(matchesSearch(browserShortcut, "Safari"), true);
  assert.equal(matchesSearch(browserShortcut, "Safari", "windows"), false);
  assert.equal(matchesSearch(browserShortcut, "Safari", "mac"), true);
  assert.equal(matchesSearch(browserShortcut, "Ctrl+T", "windows"), true);
  assert.equal(matchesSearch(browserShortcut, "Ctrl+T", "mac"), false);
  assert.deepEqual(getShortcutApps(browserShortcut, "windows"), [
    "Google Chrome",
  ]);
  assert.deepEqual(getShortcutApps(browserShortcut, "mac"), [
    "Google Chrome",
    "Safari",
  ]);
  assert.deepEqual(getShortcutApps(browserShortcut), [
    "Google Chrome",
    "Safari",
  ]);
});
