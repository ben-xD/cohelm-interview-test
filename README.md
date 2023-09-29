# Cohelm test

## Links
- Frontend: https://cohelm.pages.dev
- API: https://cohelm-test.fly.dev
  - API docs: https://cohelm-test.fly.dev/documentation

## Getting started

- Install node version specified in `.node_version` (I use `fnm`, so I run `fnm install 20.7.0` and `fnm use 20.7.0`)
- Install `pnpm`: https://pnpm.io/installation
- Install dependencies: `pnpm install`
- Backend:
  - Run application: `pnpm dev`
  - Run tests: `pnpm test`
  - View database UI: `pnpm db:ui`
  - Test APIs using swagger UI: `pnpm dev` and visit http://127.0.0.1:8080/documentation
  - Deploy: 
    - one time setup: `fly deploy`
    - manually with Fly.io: `pnpm deploy`
    - Run locally with fly: run `fly deploy --local-only`
- Frontend:
  - Run application: `pnpm dev`
  - Run tests: `pnpm tests`

## Goals
- Deliver something a long the lines that Cohelm wanted (task sent via email).
- Experiment:
  - Try Radix UI and shadcn/ui.
  - Use Fastify + OpenAPI + Drizzle-orm in the same project (I will open source a template/starter-repo based on what I learn). I am very conscious this is a slower approach compared to tRPC (type safe, end to end APIs), however it is limited to Typescript clients. I wanted to define a widely-compatible API (without incurring the cost of protobuf/gRPC serialization and toolchain complexity).
- Use playwright to test end to end (frontend and backend). If this was a real project, I'd backend specific integration tests that only test the APIs
