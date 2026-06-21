import { describe, expect, it } from "vitest";
import {
  buildClaudeCommandUnresolvableHint,
  resolveClaudeHelloProbeCommand,
} from "./test.js";

describe("resolveClaudeHelloProbeCommand", () => {
  it("supports the native claude binary", () => {
    expect(resolveClaudeHelloProbeCommand("claude")).toBe("claude");
    expect(resolveClaudeHelloProbeCommand("C:\\Tools\\claude.cmd")).toBe("claude");
  });

  it("supports the FCC launcher", () => {
    expect(resolveClaudeHelloProbeCommand("fcc-claude")).toBe("fcc-claude");
    expect(resolveClaudeHelloProbeCommand("D:\\bin\\fcc-claude.exe")).toBe("fcc-claude");
  });

  it("skips unrelated wrapper commands", () => {
    expect(resolveClaudeHelloProbeCommand("uv")).toBeNull();
    expect(resolveClaudeHelloProbeCommand("custom-claude-wrapper")).toBeNull();
  });
});

describe("buildClaudeCommandUnresolvableHint", () => {
  it("returns FCC-specific guidance for a missing fcc launcher", () => {
    expect(buildClaudeCommandUnresolvableHint("fcc-claude")).toContain("Free Claude Code launcher");
    expect(buildClaudeCommandUnresolvableHint("fcc-claude")).toContain("absolute path");
  });

  it("does not add extra guidance for other commands", () => {
    expect(buildClaudeCommandUnresolvableHint("claude")).toBeNull();
    expect(buildClaudeCommandUnresolvableHint("uv")).toBeNull();
  });
});
