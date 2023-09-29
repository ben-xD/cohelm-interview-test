import { Route } from "@tanstack/react-router";
import { rootRoute } from "./Root.tsx";
import { PatientsList } from "./patient/PatientsList.tsx";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

export function Index() {
  return (
    <>
      <PatientsList />
    </>
  );
}
