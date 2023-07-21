import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {databasePath} from "../src/db/db";

const sql = Database(databasePath)
const db = drizzle(sql);

