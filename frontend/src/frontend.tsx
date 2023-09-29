import React from "react";
import ReactDOM from "react-dom/client";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Router, RouterProvider } from "@tanstack/react-router";
import { indexRoute } from "./IndexPage.tsx";
import { rootRoute } from "./Root.tsx";
import { createUtilizationReviewRoute } from "./patient/CreateUtilizationReview.tsx";
import "./globals.css";

const routeTree = rootRoute.addChildren([
  indexRoute,
  createUtilizationReviewRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="blue">
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
