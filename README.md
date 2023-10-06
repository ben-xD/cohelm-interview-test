# Cohelm interview test

This is my attempt/solution to a test as part of an application process. I was messaged on LinkedIn by a Cohelm founder. 

## Links
- Frontend: https://cohelm.pages.dev
- API: https://cohelm-test.fly.dev
  - API docs: https://cohelm-test.fly.dev/documentation

## Technologies
- Frontend: React, Radix UI, Shadcn/ui
- Backend: Fastify, OpenAPI
- Infrastucture: Cloudflare Pages and Fly.io

## Update: Feedback from Cohelm

We wanted to provide you with some feedback on areas where we feel you could improve for future reference. We were impressed by your comprehensive solution that covered all parts of the assessment requirements.

However, there were a few areas where we felt your code could be improved:

    It was clear from your solution that you can craft functional code in a way that’s easy to read and maintain, however the solution was missing small details that demonstrate empathy towards the user. For example, this page has a lot of dense information that can be made easier to digest by using simple cards, or even bolding the label text. Another quick win candidates have used to demonstrate that empathy is formatting the date string with the Intl library.
    The solution takes a novel approach to split the front-end and backend into two separate projects stored in a monorepo. This approach demonstrates an awareness of how backend/frontend projects may be coupled and managed. However, given Next.js’ support for API routes we would like to see justification for this approach, especially as the solution introduces deployment and hosting complexities
    The homepage makes good use of styling, cards, font manipulation and icons however this is not consistent with some of the other screens in the app
    There is a lack of loading states on the Create Utilization Review screen which make it difficult to understand when the app is doing work and when it is not responding to an input. Clearer on-screen instructions, loading spinners or a UI that guides users through the steps would make it easier to follow what needs to be done to use the app

We understand that this may be disappointing news, but we encourage you to continue to develop your skills and apply for future opportunities with us. We value your interest in our company and appreciate the time you took to complete this assessment.

## My thoughts

Thank you! Feedback is a gift. It's dissapointing to see all the feedback here related to minor problems that can be easily fixed (except for using NextJS-specific API, which I think is a bad idea). These are areas I consciously neglected given the time constraints and my interests.

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
  - Note: When running backend locally, point the frontend to the local backend `http://localhost:$port` in `frontend/.env`

## Goals

- Deliver something a long the lines that Cohelm wanted (task sent via email).
- Experiment:
  - Get more familiar with Radix UI, shadcn/ui, tanstack router and tanstack query, and build toward a template that I can use for any future projects.
  - Use Fastify + OpenAPI + Drizzle-orm in the same project (I will open source a template/starter-repo based on what I learn). I am very conscious this is a slower approach compared to tRPC (type safe, end to end APIs), however it is limited to Typescript clients. I wanted to define a widely-compatible API (without incurring the cost of protobuf/gRPC serialization and toolchain complexity).
- #not-done Use playwright to test end to end (frontend and backend). If this was a real project, I'd backend specific integration tests that only test the APIs.

## Annoying points with Fly.io
- When using `fly deploy` the dockerfile will automatically copy the `dist` folder, which means it uses your local, stale build into deployment. 
- The generated dockerfile does not build the application. It's quite badly written too.
- DNS propagation for recreating projects can be delayed, which is also confusing. DNS records would be missing.
- They assume you have set up your project to use Husky. If your project doesn't have Husky configured, you cannot even set up Fly for your project.
- With `auto_stop_machines=true` in `fly.toml` (the default generated config), the machines are auto stopped when not being used. When users visit your app, the app will start. However, when it restarts, it won't use the same image that was turned off. Instead, it will use the **latest** image, even if it's broken - which means your app will be unusable.
