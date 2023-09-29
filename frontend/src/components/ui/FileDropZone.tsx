import { Card } from "@radix-ui/themes";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropProps {
  onFilesSelected: (files: File[]) => void;
}

const FileDrop: React.FC<FileDropProps> = ({ onFilesSelected }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card className="cursor-pointer rounded-md py-5 text-center flex flex-col justify-center bg-slate-200">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop PDF files here, or click to browse</p>
        )}
      </div>
    </Card>
  );
};

export default FileDrop;
