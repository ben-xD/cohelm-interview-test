import type {Config} from 'drizzle-kit';
import {migrationsFolder} from "./src/db/db";

export default {
  schema: './src/db/schema',
  out: migrationsFolder,
  driver: 'better-sqlite',
  breakpoints: true,
} satisfies Config;
