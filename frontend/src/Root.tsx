import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link as RouterLink, Outlet, RootRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Link as RadixLink } from "@radix-ui/themes";

const queryClient = new QueryClient();

// const TanStackRouterDevtools =
//   import.meta.env.MODE === "production"
//     ? () => null // Render nothing in production
//     : React.lazy(() =>
//         // Lazy load router dev tools in development
//         import("@tanstack/router-devtools").then((res) => ({
//           default: res.TanStackRouterDevtools,
//         }))
//       );

export const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className=" mt-8 mx-4 lg:mx-auto lg:w-1/2">
        <RouterLink to="/">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            10s Utilization Review
          </h1>
        </RouterLink>
        <p className="leading-7">
          The utilization review app that takes 10 seconds using AI.
        </p>
        <p className="italic text-gray-600 text-sm">
          It doesn't really use AI. It just returns useless utilization review
          data.
        </p>
        <RadixLink href="https://cohelm-test.fly.dev/documentation">
          <Badge className="my-2" variant="outline">
            API documentation
          </Badge>
        </RadixLink>
        <Outlet />
        {/* <Suspense>
          <TanStackRouterDevtools />
        </Suspense> */}
      </div>
    </QueryClientProvider>
  );
};

export const rootRoute = new RootRoute({
  component: Root,
});
