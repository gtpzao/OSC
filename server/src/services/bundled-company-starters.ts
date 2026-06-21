import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CompanyPortabilityFileEntry } from "@paperclipai/shared";
import { notFound, unprocessable } from "../errors.js";
import { normalizePortablePath } from "./portable-path.js";

const serviceDir = path.dirname(fileURLToPath(import.meta.url));
const starterRoot = path.resolve(serviceDir, "../../..", "starter-companies");

const STARTERS = {
  birck: {
    name: "BIRCK",
    description:
      "BIRCK baseline company bundled with OSC for local-first claude_local + fcc-claude workflows.",
    relativePath: "birck",
  },
  "software-factory-method": {
    name: "Software Factory Method",
    description:
      "BMAD starter company bundled with OSC for local-first FCC and NVIDIA NIM workflows.",
    relativePath: "software-factory-method",
  },
} as const;

const TEXT_FILE_EXTENSIONS = new Set([
  ".csv",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".license",
  ".md",
  ".mjs",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

type BundledCompanyStarterId = keyof typeof STARTERS;

export interface BundledCompanyStarter {
  id: BundledCompanyStarterId;
  name: string;
  description: string;
  rootPath: string;
  files: Record<string, CompanyPortabilityFileEntry>;
  agentSlugs: string[];
}

function isTextStarterFile(filePath: string) {
  const fileName = path.basename(filePath).toLowerCase();
  return TEXT_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase()) || fileName === "license";
}

async function readBundledStarterFiles(
  rootPath: string,
  currentPath = rootPath,
): Promise<Record<string, CompanyPortabilityFileEntry>> {
  const files: Record<string, CompanyPortabilityFileEntry> = {};
  const entries = await fs.readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      Object.assign(files, await readBundledStarterFiles(rootPath, absolutePath));
      continue;
    }
    if (!entry.isFile()) continue;

    const relativePath = normalizePortablePath(path.relative(rootPath, absolutePath));
    const raw = await fs.readFile(absolutePath);
    files[relativePath] = isTextStarterFile(absolutePath)
      ? raw.toString("utf8")
      : {
          encoding: "base64",
          data: raw.toString("base64"),
        };
  }

  return files;
}

function collectStarterAgentSlugs(files: Record<string, CompanyPortabilityFileEntry>) {
  return Object.keys(files)
    .filter((filePath) => /^agents\/[^/]+\/AGENTS\.md$/i.test(filePath))
    .map((filePath) => filePath.split("/")[1]!)
    .sort((left, right) => left.localeCompare(right));
}

export async function loadBundledCompanyStarter(id: string): Promise<BundledCompanyStarter> {
  const starterId = id as BundledCompanyStarterId;
  const starter = STARTERS[starterId];
  if (!starter) {
    throw notFound(`Bundled company starter "${id}" not found.`);
  }

  const rootPath = path.resolve(starterRoot, starter.relativePath);
  let stats;
  try {
    stats = await fs.stat(rootPath);
  } catch {
    throw notFound(`Bundled company starter "${id}" is missing from ${rootPath}.`);
  }
  if (!stats.isDirectory()) {
    throw unprocessable(`Bundled company starter "${id}" is not a directory.`);
  }

  const files = await readBundledStarterFiles(rootPath);
  if (typeof files["COMPANY.md"] !== "string") {
    throw unprocessable(`Bundled company starter "${id}" is missing COMPANY.md.`);
  }

  const agentSlugs = collectStarterAgentSlugs(files);
  if (agentSlugs.length === 0) {
    throw unprocessable(`Bundled company starter "${id}" does not declare any agents.`);
  }

  return {
    id: starterId,
    name: starter.name,
    description: starter.description,
    rootPath,
    files,
    agentSlugs,
  };
}
