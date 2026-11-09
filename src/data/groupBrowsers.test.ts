import assert from "node:assert/strict";
import test from "node:test";
import { mergeBrowserShortcuts } from "./groupBrowsers";
import type { Shortcut } from "../lib/shortcuts";

function browserShortcut(
  id: string,
  app: string,
  keys: Shortcut["keys"],
  source: string
): Shortcut {
  return {
    id,
    title: "New tab",
    description: `Open a new tab in ${app}.`,
    category: "browsers",
    app,
    level: "Beginner",
    task: "Tabs",
    keys,
    source,
  };
}

test("merges a repeated browser action into one shortcut and retains variants", () => {
  const grouped = mergeBrowserShortcuts([
    browserShortcut(
      "chrome-new-tab",
      "Google Chrome",
      {
        windows: ["Ctrl", "T"],
        mac: ["Cmd", "T"],
        linux: ["Ctrl", "T"],
      },
      "https://example.com/chrome"
    ),
    browserShortcut(
      "safari-new-tab",
      "Safari",
      {
        mac: ["Cmd", "T"],
      },
      "https://example.com/safari"
    ),
  ]);

  assert.equal(grouped.length, 1);
  assert.deepEqual(grouped[0].browserApps, ["Google Chrome", "Safari"]);
  assert.equal(grouped[0].browserVariants?.length, 2);
  assert.equal(grouped[0].browserVariants?.[1].keys.mac?.join("+"), "Cmd+T");
  assert.equal(
    grouped[0].browserVariants?.[1].source,
    "https://example.com/safari"
  );
});

test("normalizes title whitespace and leaves unrelated browser actions separate", () => {
  const first = browserShortcut(
    "1",
    "Chrome",
    { windows: ["Ctrl", "T"] },
    "https://example.com/1"
  );
  const same = { ...first, id: "2", app: "Firefox", title: "  New   tab " };
  const different = { ...first, id: "3", title: "Close tab" };
  const grouped = mergeBrowserShortcuts([first, same, different]);
  assert.equal(grouped.length, 2);
  assert.deepEqual(grouped[0].browserApps, ["Chrome", "Firefox"]);
  assert.equal(grouped[1].title, "Close tab");
});
