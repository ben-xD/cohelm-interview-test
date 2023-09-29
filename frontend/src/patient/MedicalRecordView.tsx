import { Checkbox } from "@/components/ui/checkbox";

export type MedicalRecord = { originalFilename: string; id: string };

export const MedicalRecordView = ({ record }: { record: MedicalRecord }) => {
  return (
    <div className="flex items-center space-x-2 my-4">
      <Checkbox id={record.id} />
      <label
        htmlFor={record.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {record.originalFilename}
      </label>
    </div>
  );
};
