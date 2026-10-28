import assert from "node:assert/strict";
import test from "node:test";
import { categories, categoryMatches } from "./CategoryIcon";

test("left navigation contains All shortcuts and every OS choice", () => {
  const ids = categories.map(category => category.id);
  assert.ok(ids.includes("all"));
  assert.ok(ids.includes("windows"));
  assert.ok(ids.includes("macos"));
  assert.ok(ids.includes("linux"));
});

test("All includes every category and Editors includes both editor groups", () => {
  assert.equal(categoryMatches("all", "microsoft365"), true);
  assert.equal(categoryMatches("editors", "vscode"), true);
  assert.equal(categoryMatches("editors", "jetbrains"), true);
});
