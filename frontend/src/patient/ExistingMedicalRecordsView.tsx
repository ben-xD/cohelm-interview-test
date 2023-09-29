import { addPathToUrl } from "@/addPathToUrl";
import { backendUrl } from "@/backendUrl";
import { useQuery } from "@tanstack/react-query";
import { MedicalRecordView } from "./MedicalRecordView";

export const ExistingMedicalRecordsView = ({
  patientId,
}: {
  patientId: string;
}) => {
  const {
    isLoading,
    isError,
    error,
    data: existingMedicalRecords,
  } = useQuery<{ id: string; originalFilename: string }[]>({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(
        addPathToUrl(new URL(backendUrl), `/${patientId}/medical-records`)
      );
      return response.json();
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
        Select existing medical records (not implemented)
      </h2>
      <div className="py-4">
        {existingMedicalRecords.length === 0 ? (
          <p>No existing medical records.</p>
        ) : (
          existingMedicalRecords.map((record) => (
            <MedicalRecordView key={record.id} record={record} />
          ))
        )}
      </div>
    </div>
  );
};
