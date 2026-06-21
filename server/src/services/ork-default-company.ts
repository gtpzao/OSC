import { count, eq } from "drizzle-orm";
import { companies, companySkills, issues } from "@paperclipai/db";
import type { Db } from "@paperclipai/db";
import type { DeploymentMode } from "@paperclipai/shared";
import type { StorageService } from "../storage/types.js";
import { loadBundledCompanyStarter } from "./bundled-company-starters.js";
import { companyPortabilityService } from "./company-portability.js";

const DEFAULT_ORK_STARTER_ID = "birck";

export interface EnsureOrkDefaultCompanyOptions {
  actorUserId: string;
  deploymentMode: DeploymentMode;
  enabled?: boolean;
  starterId?: string;
  storage?: StorageService;
}

export type EnsureOrkDefaultCompanyResult =
  | { status: "disabled"; reason: "disabled" }
  | { status: "skipped"; reason: "non_local_trusted" | "existing_companies" }
  | {
      status: "created";
      starterId: string;
      companyId: string;
      companyName: string;
      agentCount: number;
      projectCount: number;
      issueCount: number;
      skillCount: number;
    };

export async function ensureOrkDefaultCompany(
  db: Db,
  options: EnsureOrkDefaultCompanyOptions,
): Promise<EnsureOrkDefaultCompanyResult> {
  if (options.enabled === false) {
    return { status: "disabled", reason: "disabled" };
  }

  if (options.deploymentMode !== "local_trusted") {
    return { status: "skipped", reason: "non_local_trusted" };
  }

  const companyCount = await db
    .select({ count: count() })
    .from(companies)
    .then((rows) => Number(rows[0]?.count ?? 0));
  if (companyCount > 0) {
    return { status: "skipped", reason: "existing_companies" };
  }

  const starterId = options.starterId ?? DEFAULT_ORK_STARTER_ID;
  const starter = await loadBundledCompanyStarter(starterId);
  const portability = companyPortabilityService(db, options.storage);
  const imported = await portability.importBundle(
    {
      source: {
        type: "inline",
        files: starter.files,
      },
      include: {
        company: true,
        agents: true,
        projects: true,
        issues: true,
        skills: true,
      },
      target: {
        mode: "new_company",
      },
      collisionStrategy: "skip",
    },
    options.actorUserId,
  );
  const [{ count: importedIssueCount }] = await db
    .select({ count: count() })
    .from(issues)
    .where(eq(issues.companyId, imported.company.id));
  const [{ count: importedSkillCount }] = await db
    .select({ count: count() })
    .from(companySkills)
    .where(eq(companySkills.companyId, imported.company.id));

  return {
    status: "created",
    starterId,
    companyId: imported.company.id,
    companyName: imported.company.name,
    agentCount: imported.agents.filter((agent) => agent.action !== "skipped").length,
    projectCount: imported.projects.filter((project) => project.action !== "skipped").length,
    issueCount: Number(importedIssueCount ?? 0),
    skillCount: Number(importedSkillCount ?? 0),
  };
}
