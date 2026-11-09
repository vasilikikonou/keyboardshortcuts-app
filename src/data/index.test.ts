import assert from "node:assert/strict";
import test from "node:test";
import { shortcuts } from "./index";
import { getSupportedPlatforms } from "../lib/shortcuts";

test("the common Copy action is one shared all-platform record", () => {
  const copy = shortcuts.filter(
    shortcut => shortcut.title === "Copy" && shortcut.category === "universal"
  );
  assert.equal(copy.length, 1);
  assert.deepEqual(getSupportedPlatforms(copy[0]), ["windows", "mac", "linux"]);
  assert.deepEqual(copy[0].keys, {
    windows: ["Ctrl", "C"],
    mac: ["Cmd", "C"],
    linux: ["Ctrl", "C"],
  });
});

test("each browser action has one card with every source browser variant", () => {
  const newTabs = shortcuts.filter(
    shortcut =>
      shortcut.category === "browsers" &&
      shortcut.title.toLowerCase() === "new tab"
  );
  assert.equal(newTabs.length, 1);
  assert.deepEqual(newTabs[0].browserApps, [
    "Google Chrome",
    "Mozilla Firefox",
    "Microsoft Edge",
    "Safari",
  ]);
  assert.equal(newTabs[0].browserVariants?.length, 4);
});
