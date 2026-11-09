import assert from "node:assert/strict";
import test from "node:test";
import { mergeSystemShortcuts } from "./mergeSystemShortcuts";
import type { Shortcut } from "../lib/shortcuts";

function record(
  id: string,
  category: string,
  app: string,
  keys: Shortcut["keys"],
  source: string
): Shortcut {
  return {
    id,
    title: "Copy",
    description: `Copy from ${app}.`,
    category,
    app,
    level: "Beginner",
    task: "Editing",
    keys,
    source,
  };
}

test("combines a repeated OS action into one cross-platform shortcut", () => {
  const merged = mergeSystemShortcuts([
    record(
      "mac-copy",
      "macos",
      "macOS",
      { mac: ["Cmd", "C"] },
      "https://example.com/mac"
    ),
    record(
      "universal-copy",
      "universal",
      "Universal basics",
      {
        windows: ["Ctrl", "C"],
        mac: ["Cmd", "C"],
        linux: ["Ctrl", "C"],
      },
      "https://example.com/common"
    ),
  ]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, "universal-copy");
  assert.deepEqual(merged[0].keys, {
    windows: ["Ctrl", "C"],
    mac: ["Cmd", "C"],
    linux: ["Ctrl", "C"],
  });
  assert.deepEqual(merged[0].aliases, ["mac-copy"]);
  assert.equal(merged[0].sourceReferences?.length, 2);
});

test("keeps separate application records and same-category contexts distinct", () => {
  const system = record(
    "mac-copy",
    "macos",
    "macOS",
    { mac: ["Cmd", "C"] },
    "https://example.com/mac"
  );
  const editor = record(
    "vscode-copy",
    "vscode",
    "VS Code",
    { windows: ["Ctrl", "C"] },
    "https://example.com/code"
  );
  const sameCategory = {
    ...system,
    id: "mac-copy-files",
    app: "Finder",
    description: "Copy a file.",
  };
  const merged = mergeSystemShortcuts([system, editor, sameCategory]);
  assert.equal(merged.length, 3);
  assert.equal(
    merged.find(item => item.id === "vscode-copy")?.category,
    "vscode"
  );
});
