// I tried ChatGPT instead of react-dropzone.
import React, { useRef, useState } from "react";

interface FileDropProps {
  onFilesAdded?: (files: File[]) => void;
}

const FileDrop: React.FC<FileDropProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      if (onFilesAdded) onFilesAdded(pdfFiles as File[]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      if (onFilesAdded) onFilesAdded(pdfFiles as File[]);
    }
  };

  return (
    <div
      className={`w-full text-center p-6 border-2 rounded ${
        isDragging ? "bg-blue-100 border-blue-500" : "border-gray-300"
      } relative`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".pdf"
        onChange={handleFileChange}
        hidden
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        {isDragging
          ? "Drop your files here"
          : "Drag & Drop PDF files or click to browse"}
      </label>
    </div>
  );
};

export default FileDrop;
