import type { Config } from "drizzle-kit";
import { databasePath, migrationsFolder } from "./src/db/db";

export default {
  schema: "./src/db/schema",
  out: migrationsFolder,
  driver: "better-sqlite",
  breakpoints: true,
  dbCredentials: {
    url: databasePath,
  },
} satisfies Config;
