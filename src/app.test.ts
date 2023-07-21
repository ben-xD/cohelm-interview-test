import { Server } from "node:http";
import { promisify } from "node:util";
import { Express } from "express";
import inspector from 'inspector';
import request from "supertest";
import Database from "better-sqlite3";
import {drizzle} from "drizzle-orm/better-sqlite3";

const getCellNames = (cells: {name: string}[]) => cells.map(({ name }) => name);

if (!inspector.url()) { // only set test timeout when not using debugger.
    jest.setTimeout(100);
}

jest.mock('./db/db.ts', () => {
    const actual = jest.requireActual('./db/db');

    const db = drizzle(new Database(":memory:"));

    return {
        ...actual,
        db
    };
})

describe("Express App", () => {
    let app: Express;
    let server: Server | undefined;

    beforeEach(async () => {
        jest.resetModules();
        ({ app } = await import("./app"));
        server = await promisify(app.listen).bind(app)() as Server;
    });

    afterEach(async () => {
        if (server) {
            await promisify(server.close).bind(server)();
            server = undefined;
        }
    });

    describe("GET /", () => {
        test("should respond with Hello World!", async () => {
            const response = await request(app).get("/").expect(200);
            expect(response.text).toEqual("Hello World!");
        });
    });

    describe("POST /api/cells", () => {
        test("should create a new cell", async () => {
            const cellData = { name: "HEK", doublingTime: 2 };
            await request(app).post("/api/cells").send(cellData).expect(201);
            const response = await request(app).get("/api/cells").expect(200);
            expect(response.body).toEqual([cellData]);
        });
        test("should fail if name not provided", async () => {
            const cellData = { doublingTime: 2 };
            await request(app).post("/api/cells").send(cellData).expect(406);
        });
        test("should fail if cell name exists", async () => {
            const cellData = { name: "HEK", doublingTime: 6 };
            await request(app).post("/api/cells").send(cellData).expect(201);
            await request(app).post("/api/cells").send(cellData).expect(409);
            const response = await request(app).get("/api/cells").expect(200);
            expect(response.body).toEqual([cellData]);
        });
    });

    describe("GET /api/cells", () => {
        beforeEach(async () => {
            const cells = [
                { name: "HEK 293", doublingTime: 2, maxConfluence: 0.6 },
                { name: "HeLa", doublingTime: 6, maxConfluence: 0.8 },
                { name: "Chinese hamster ovary cells", doublingTime: 4 },
            ];
            await Promise.all(
                cells.map((cellData) =>
                    request(app).post("/api/cells").send(cellData).expect(201),
                ),
            );
        });
        test("should find all cells", async () => {
            const response = await request(app).get("/api/cells").expect(200);
            expect(response.body).toHaveLength(3);
        });
        test("should find cells by exact name", async () => {
            const url = "/api/cells?name=HEK 293";
            const response = await request(app).get(url).expect(200);
            expect(getCellNames(response.body)).toEqual(["HEK 293"]);
        });
        test("should find cells using name search", async () => {
            const url = "/api/cells?name:like=hek";
            const response = await request(app).get(url).expect(200);
            expect(getCellNames(response.body)).toEqual(["HEK 293"]);
        });
        test("should find cells with a low growth rate", async () => {
            const url = "/api/cells?doublingTime:max=2";
            const response = await request(app).get(url).expect(200);
            expect(getCellNames(response.body)).toEqual(["HEK 293"]);
        });
        test("should find cells with high maximum confluence", async () => {
            const url = "/api/cells?maxConfluence:min=0.7";
            const response = await request(app).get(url).expect(200);
            expect(getCellNames(response.body)).toEqual(["HeLa"]);
        });
    });
});
