import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/onboarding-assets", { recursive: true });
await cp("src/onboarding-assets", "dist/onboarding-assets", { recursive: true });
