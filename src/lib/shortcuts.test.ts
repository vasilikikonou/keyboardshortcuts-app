import assert from "node:assert/strict";
import test from "node:test";
import {
  comboText,
  getKeys,
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
  source: "https://support.microsoft.com",
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
});
