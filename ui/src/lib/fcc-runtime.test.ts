import { describe, expect, it } from "vitest";
import { isFccClaudeCommand } from "./fcc-runtime";

describe("isFccClaudeCommand", () => {
  it("detects bare FCC launcher commands", () => {
    expect(isFccClaudeCommand("fcc-claude")).toBe(true);
    expect(isFccClaudeCommand("fcc-claude.cmd")).toBe(true);
  });

  it("detects absolute Windows paths", () => {
    expect(isFccClaudeCommand("C:\\Tools\\fcc-claude.exe")).toBe(true);
    expect(isFccClaudeCommand("C:/Tools/fcc-claude.cmd")).toBe(true);
  });

  it("ignores unrelated commands", () => {
    expect(isFccClaudeCommand("claude")).toBe(false);
    expect(isFccClaudeCommand("uv")).toBe(false);
  });
});
