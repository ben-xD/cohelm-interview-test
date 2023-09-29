import { Link, Route, useParams } from "@tanstack/react-router";
import { rootRoute } from "../Root";
import { Button } from "@radix-ui/themes";
import { Badge } from "@/components/ui/badge";
import FileDrop from "@/components/ui/FileDropZone";
import { useMutation } from "@tanstack/react-query";
import { backendUrl } from "@/backendUrl";
import { addPathToUrl } from "@/addPathToUrl";
import { indexRoute } from "@/IndexPage";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExistingMedicalRecordsView } from "./ExistingMedicalRecordsView";
import { Textarea } from "@/components/ui/textarea";
import { Evidence } from "./UtilizationReviews";

export const CreateUtilizationReview = () => {
  const { patientId } = useParams({ from: indexRoute.id });
  const [selectedFiles, setSelectedFiles] = useState<File[]>();
  const [guidelines, setGuidelines] = useState<string>("");
  const [allFilesUploaded, setAllFilesUploaded] = useState(true);
  const [evidences, setEvidences] = useState<Evidence[]>();

  const uploadFilesMutation = useMutation<File[], Error>({
    mutationFn: async () => {
      if (!selectedFiles || selectedFiles.length === 0) {
        throw new Error("No files selected");
      }
      const formData = new FormData();
      for (const [index, file] of selectedFiles.entries()) {
        formData.append(index.toString(), file);
      }
      const response = await fetch(
        addPathToUrl(new URL(backendUrl), `${patientId}/medical-records`),
        {
          method: "post",
          body: formData,
        }
      );
      setAllFilesUploaded(true);
      return response.json();
    },
  });

  const createUtilizationReviewMutation = useMutation<UtilizationReview, Error>(
    {
      mutationFn: async () => {
        const response = await fetch(
          addPathToUrl(new URL(backendUrl), `${patientId}/utilization-reviews`),
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              guidelinesText: guidelines,
              // TO simplify, we don't send the medical record ids for now.
              // medicalRecordIds: selectedFiles?.map()
            }),
          }
        );
        const body = (await response.json()) as { evidence: Evidence[] };
        console.error(body);
        setEvidences(body.evidence);
        return body;
      },
    }
  );

  const onFilesSelected = (pdfFiles: File[]) => {
    setAllFilesUploaded(false);
    setSelectedFiles(pdfFiles);
  };

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
        <Link
          to="../../$patientId/utilization-reviews"
          params={{ patientId: patientId }}
        >
          <Badge className="my-2" variant="outline">
            older utilization reviews
          </Badge>
        </Link>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
          Upload medical records
        </h2>
        {uploadFilesMutation.error ? (
          <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {uploadFilesMutation.error.message}
            </AlertDescription>
          </Alert>
        ) : (
          <></>
        )}
        {selectedFiles?.map((file) => (
          <div key={file.name} className="flex items-center gap-2">
            <p>{file.name}</p>
            <Cross2Icon
              onClick={() =>
                setSelectedFiles((files) => [
                  ...(files ?? []).filter(
                    (current) => current.name !== file.name
                  ),
                ])
              }
            />
          </div>
        ))}
        <FileDrop onFilesSelected={onFilesSelected} />
        <div>
          <Button onClick={() => uploadFilesMutation.mutate()}>Upload</Button>
        </div>
      </div>
      <ExistingMedicalRecordsView patientId={patientId} />
      <div className="w-full">
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
          Guidelines
        </h2>
        <Textarea
          value={guidelines}
          onChange={(e) => setGuidelines(e.target.value)}
        />
      </div>
      <div className="pt-4 border-t w-full">
        <Button
          onClick={() => createUtilizationReviewMutation.mutate()}
          disabled={!allFilesUploaded}
        >
          Create utilization review
        </Button>
      </div>
      {evidences ? (
        <div className="w-full">
          <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
            Result
          </h2>
          {evidences.map((evidence) => (
            <div key={evidence.criteria} className="my-4">
              <p>Criteria: {evidence.criteria}</p>
              <p>Evidence: {evidence.evidence}</p>
              <p>Page: {evidence.page}</p>
              <p>Reasoning: {evidence.reasoning}</p>
              <p>Score: {evidence.score}</p>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export const createUtilizationReviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/$patientId/create-utilization-review",
  component: CreateUtilizationReview,
});
