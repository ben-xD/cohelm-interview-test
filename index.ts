import {app} from "./app";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {db, migrationsFolder} from "./src/db/db";

const PORT = Number(process.env.PORT) || 8080;

// Run migration on start
migrate(db, {migrationsFolder});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
