import React from "react";

interface FileDropProps {
  onFilesSelected?: (files: File[]) => void;
}

const FileDrop: React.FC<FileDropProps> = ({ onFilesSelected }) => {
  return <h2>File drop</h2>;
};

export default FileDrop;
