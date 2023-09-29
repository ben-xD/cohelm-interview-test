import { Route, useParams } from "@tanstack/react-router";
import { rootRoute } from "../Root";
import { Button } from "@radix-ui/themes";
import FileDrop from "@/components/ui/FileDropZone";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { backendUrl } from "@/backendUrl";
import { addPathToUrl } from "@/addPathToUrl";
import { indexRoute } from "@/IndexPage";

type MedicalRecord = { filename: string; id: string };

const MedicalRecord = ({ record }: { record: MedicalRecord }) => {
  return (
    <div className="flex items-center space-x-2 my-4">
      <Checkbox id={record.id} />
      <label
        htmlFor={record.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {record.filename}
      </label>
    </div>
  );
};

const ExistingMedicalRecords = (patientId: { patientId: string }) => {
  // TODO get existing medical records
  // const [selectedFileIds, setSelectedFileIds] = useState<string[]>();
  const {
    isLoading,
    isError,
    error,
    data: existingMedicalRecords,
  } = useQuery({
    queryKey: [],
    queryFn: () => {
      fetch(addPathToUrl(new URL(backendUrl), `/${patientId}/medical-records`));
      return [
        { filename: "meds.pdf", id: "1" },
        { filename: "scan.pdf", id: "2" },
        { filename: "post.pdf", id: "3" },
      ];
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
    <div className="w-full">
      <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
        Select existing medical records
      </h2>
      {existingMedicalRecords.length === 0 ? (
        <p>No existing medical records.</p>
      ) : (
        existingMedicalRecords.map((record) => (
          <MedicalRecord key={record.id} record={record} />
        ))
      )}
    </div>
  );
};

export const CreateUtilizationReview = () => {
  const { patientId } = useParams({ from: indexRoute.id });

  const onFilesAdded = (pdfFiles: File[]) => {
    console.info({ pdfFiles });
  };

  const onUploadAll = () => {
    console.error("Upload all images");
    // TODO upload medical records.
  };

  const onCreateUtilizationReview = () => {
    console.error("Create UR");
  };

  return (
    <div className="m-4 flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-2 w-full">
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full">
          Upload medical records
        </h2>
        Patient: {patientId}
        <FileDrop onFilesAdded={onFilesAdded} />
        <div>
          <Button onClick={onUploadAll}>Upload all</Button>
        </div>
      </div>
      <ExistingMedicalRecords patientId={patientId} />
      <div className="pt-4 border-t w-full">
        <Button onClick={onCreateUtilizationReview}>
          Create utilization review
        </Button>
      </div>
    </div>
  );
};

export const createUtilizationReviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "$patientId/create-utilization-review",
  component: CreateUtilizationReview,
});
