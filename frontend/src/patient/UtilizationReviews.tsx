import { indexRoute } from "@/IndexPage";
import { rootRoute } from "@/Root";
import { addPathToUrl } from "@/addPathToUrl";
import { backendUrl } from "@/backendUrl";
import { useQuery } from "@tanstack/react-query";
import { Route, useParams } from "@tanstack/react-router";

export type Evidence = {
  criteria: string;
  score: number;
  met: boolean;
  evidence: string;
  reasoning: string;
  page: number;
};

export type UtilizationReview = {
  id: string;
  guidelines: string;
  createdAt: string;
  patientId: string;
  review: string;
};

export const UtilizationReviewView = () => {
  const { patientId } = useParams({ from: indexRoute.id });

  const {
    isLoading,
    isError,
    error,
    data: olderUtilizationReviews,
  } = useQuery<UtilizationReview[]>({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(
        addPathToUrl(new URL(backendUrl), `/utilization-reviews`)
      );
      const body = (await response.json()) as UtilizationReview[];
      return body;
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <span>Error: {error.message}</span>;
    } else {
      return <span>Error: unknown error</span>;
    }
  }

  return (
    <div className="my-4 flex flex-col gap-8 items-start">
      <div>
        {/* <h1 className="text-lg">
            <span className="font-semibold">Patient Name:</span> not supported
          </h1> */}
        <h1 className="text-lg">
          <span className="font-semibold">Patient ID:</span> {patientId}
        </h1>
        <h1 className="text-lg">
          <span className="font-semibold">Date of birth:</span> 30-09-1924
        </h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
          Older Utilization Reviews
        </h2>
        {olderUtilizationReviews.length === 0 ? (
          <p>No existing utilization reviews.</p>
        ) : (
          <></>
        )}
        {olderUtilizationReviews.map((review) => {
          const evidence = JSON.parse(review.review) as {
            evidence: Evidence[];
          };
          return (
            <div key={review.id} className="my-4">
              <p>Created at: {review.createdAt}</p>
              <p>Guidelines: {review.guidelines}</p>
              {evidence.evidence.map((evidence) => (
                <div key={evidence.criteria} className="my-4">
                  <p>Criteria: {evidence.criteria}</p>
                  <p>Evidence: {evidence.evidence}</p>
                  <p>Page: {evidence.page}</p>
                  <p>Reasoning: {evidence.reasoning}</p>
                  <p>Score: {evidence.score}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const utilizationReviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "$patientId/utilization-reviews",
  component: UtilizationReviewView,
});
