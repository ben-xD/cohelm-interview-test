import express, {query} from "express";
import {db, migrationsFolder} from "./db/db";
import {cells, insertCellSchema, selectCellSchemaRequired} from "./db/schema/cells";
import {z} from "zod";
import {and, eq, gte, like, lte, SQL} from "drizzle-orm";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";

// Run migration on start
migrate(db, {migrationsFolder});

export const app = express();

app.use(express.json());

// TODO implement pagination

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.post("/api/cells", (request, response) => {
  const newCellResult = insertCellSchema.safeParse(request.body);
  if (!newCellResult.success) {
    return response.status(406).send();
  }

  const newCell = newCellResult.data;
  try {
    const result = db.insert(cells).values({...newCell}).run();
    if (result.changes === 0) {
      return response.status(400).send();
    } else if (result.changes === 1) {
      return response.status(201).send(newCell);
    } else {
      return response.status(500).send();
    }
  } catch (e) {
    return response.status(409).send();
  }
});

const toNumber = (val: string | undefined) => (val) ? parseFloat(val): undefined;
const getCellsQueryParams = z.object({
  name: z.string().optional(),
  "name:like": z.string().optional(),
  maxConfluence: z.string().optional().transform(toNumber),
  "maxConfluence:max": z.string().optional().transform(toNumber),
  "maxConfluence:min": z.string().optional().transform(toNumber),
  doublingTime: z.string().optional().transform(toNumber),
  "doublingTime:max": z.string().optional().transform(toNumber),
  "doublingTime:min": z.string().optional().transform(toNumber),
})

app.get("/api/cells", (request, response) => {
  const queryResult = getCellsQueryParams.safeParse(request.query);
  if (!queryResult.success) {
    return response.status(406).send();
  }
  const query = queryResult.data;

  const conditions: SQL[] = [];
  if (query.name) {
    conditions.push(eq(cells.name, query.name))
  } else if (query["name:like"]) {
    // Only supports extra text before and after, not in between
    conditions.push(like(cells.name, `%${query["name:like"]}%`))
  }

  if (query.maxConfluence) {
    conditions.push(eq(cells.maxConfluence, query.maxConfluence))
  } else {
    if (query["maxConfluence:max"]) {
      conditions.push(lte(cells.maxConfluence, query["maxConfluence:max"]))
    } else if (query["maxConfluence:min"]) {
      conditions.push(gte(cells.maxConfluence, query["maxConfluence:min"]))
    }
  }

  if (query.doublingTime) {
    conditions.push(eq(cells.doublingTime, query.doublingTime))
  } else {
    if (query["doublingTime:max"]) {
      conditions.push(lte(cells.doublingTime, query["doublingTime:max"]))
    } else if (query["doublingTime:min"]) {
      conditions.push(gte(cells.doublingTime, query["doublingTime:min"]))
    }
  }

  try {
    const results = db.select().from(cells).where(and(...conditions)).all();
    const resultsNullRemoved = results.map(result => (result.maxConfluence) ? result : selectCellSchemaRequired.parse(result));
    return response.status(200).send(resultsNullRemoved);
  } catch (e) {
    return response.status(500).send();
  }
});
