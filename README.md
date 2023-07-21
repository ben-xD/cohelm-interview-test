# Cohelm test

## Getting started

- Install node version specified in `.node_version`
- Install `pnpm`: https://pnpm.io/installation
- Install dependencies: `pnpm install`
- Run application: `pnpm dev`
- Run tests: `pnpm test`
- View database UI: `pnpm db:ui`
- Test APIs using swagger UI: `pnpm dev` and visit http://127.0.0.1:8080/documentation
- Deploy: manually with Fly.io: `pnpm deploy`

## Goals
- Deliver something a long the lines that Cohelm wanted (task sent via email).
- Use Fastify + OpenAPI + Drizzle-orm in the same project (I will open source a template/starter-repo based on what I learn). I am very conscious this is a slower approach compared to tRPC (type safe, end to end APIs), however it is limited to Typescript clients. I wanted to define a widely-compatible API (without incurring the cost of protobuf/gRPC serialization and toolchain complexity).
