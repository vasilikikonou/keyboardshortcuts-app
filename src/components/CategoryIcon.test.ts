import assert from "node:assert/strict";
import test from "node:test";
import { categories, categoryMatches } from "./CategoryIcon";

test("left navigation includes All and app categories but not OS filters", () => {
  const ids = categories.map(category => category.id);
  assert.ok(ids.includes("all"));
  assert.ok(ids.includes("universal"));
  assert.ok(ids.includes("browsers"));
  assert.ok(ids.includes("editors"));
  assert.ok(ids.includes("microsoft365"));
  assert.ok(ids.includes("vim"));
  assert.equal(ids.includes("windows"), false);
  assert.equal(ids.includes("macos"), false);
  assert.equal(ids.includes("linux"), false);
});

test("All includes every category and Editors includes both editor groups", () => {
  assert.equal(categoryMatches("all", "windows"), true);
  assert.equal(categoryMatches("all", "linux"), true);
  assert.equal(categoryMatches("editors", "vscode"), true);
  assert.equal(categoryMatches("editors", "jetbrains"), true);
});
