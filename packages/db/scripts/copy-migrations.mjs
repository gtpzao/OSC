import { cp } from "node:fs/promises";

await cp("src/migrations", "dist/migrations", { recursive: true });
