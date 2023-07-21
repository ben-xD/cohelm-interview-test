import express from "express";

export const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    response.send("Hello World!");
});

app.post("/api/cells", (request, response) => {
    // TODO: Implement create
});

app.get("/api/cells", (request, response) => {
    // TODO: Implement list
});
