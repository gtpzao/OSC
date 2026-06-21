import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import {
  agents,
  authUsers,
  companies,
  companyMemberships,
  companySkills,
  createDb,
  instanceUserRoles,
} from "@paperclipai/db";
import {
  getEmbeddedPostgresTestSupport,
  startEmbeddedPostgresTestDatabase,
} from "./helpers/embedded-postgres.js";
import { ensureOrkDefaultCompany } from "../services/ork-default-company.js";

const embeddedPostgresSupport = await getEmbeddedPostgresTestSupport();
const describeEmbeddedPostgres = embeddedPostgresSupport.supported ? describe : describe.skip;

if (!embeddedPostgresSupport.supported) {
  console.warn(
    `Skipping ORK default company tests on this host: ${embeddedPostgresSupport.reason ?? "unsupported environment"}`,
  );
}

describe("ensureOrkDefaultCompany", () => {
  it("returns early when disabled or not local_trusted", async () => {
    expect(
      await ensureOrkDefaultCompany({} as never, {
        actorUserId: "local-board",
        deploymentMode: "local_trusted",
        enabled: false,
      }),
    ).toEqual({ status: "disabled", reason: "disabled" });

    expect(
      await ensureOrkDefaultCompany({} as never, {
        actorUserId: "local-board",
        deploymentMode: "authenticated",
      }),
    ).toEqual({ status: "skipped", reason: "non_local_trusted" });
  });
});

describeEmbeddedPostgres("ensureOrkDefaultCompany integration", () => {
  let db!: ReturnType<typeof createDb>;
  let tempDb: Awaited<ReturnType<typeof startEmbeddedPostgresTestDatabase>> | null = null;

  beforeAll(async () => {
    tempDb = await startEmbeddedPostgresTestDatabase("paperclip-ork-default-company-");
    db = createDb(tempDb.connectionString);
    const now = new Date();

    await db.insert(authUsers).values({
      id: "local-board",
      name: "Board",
      email: "local@paperclip.local",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(instanceUserRoles).values({
      userId: "local-board",
      role: "instance_admin",
    });
  }, 20_000);

  afterAll(async () => {
    await tempDb?.cleanup();
  });

  it("bootstraps the bundled BIRCK starter once into an empty local instance", async () => {
    const first = await ensureOrkDefaultCompany(db, {
      actorUserId: "local-board",
      deploymentMode: "local_trusted",
    });
    expect(first.status).toBe("created");
    if (first.status !== "created") {
      throw new Error(`Expected created result, received ${first.status}`);
    }
    expect(first.starterId).toBe("birck");
    expect(first.companyName).toBe("BIRCK");
    expect(first.agentCount).toBe(20);
    expect(first.skillCount).toBe(53);

    const companyRows = await db.select().from(companies);
    expect(companyRows).toHaveLength(1);

    const importedAgents = await db
      .select({
        id: agents.id,
        name: agents.name,
        adapterType: agents.adapterType,
        adapterConfig: agents.adapterConfig,
      })
      .from(agents);
    expect(importedAgents).toHaveLength(20);
    expect(importedAgents.every((agent) => agent.adapterType === "claude_local")).toBe(true);
    expect(
      importedAgents.every((agent) => (agent.adapterConfig as Record<string, unknown>)?.command === "fcc-claude"),
    ).toBe(true);

    const starterSkills = await db.select({ id: companySkills.id }).from(companySkills);
    expect(starterSkills.length).toBeGreaterThan(0);

    const memberships = await db.select().from(companyMemberships);
    expect(memberships.some((membership) => membership.principalId === "local-board")).toBe(true);

    const second = await ensureOrkDefaultCompany(db, {
      actorUserId: "local-board",
      deploymentMode: "local_trusted",
    });
    expect(second).toEqual({ status: "skipped", reason: "existing_companies" });

    const companyRowsAfterSecondCall = await db.select().from(companies);
    expect(companyRowsAfterSecondCall).toHaveLength(1);
  }, 40_000);
});
