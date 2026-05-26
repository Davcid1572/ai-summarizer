import { useRef, useState } from "react";

interface PDFInputProps {
  onFileSelect: (base64: string, fileName: string) => void;
  isLoading: boolean;
  selectedFileName: string;
}

export default function PDFInput({
  onFileSelect,
  isLoading,
  selectedFileName,
}: PDFInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a PDF under 10MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      onFileSelect(base64, file.name);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Upload a PDF</label>

      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center
                   gap-3 border-2 border-dashed rounded-xl px-6 py-10
                   cursor-pointer transition-all duration-150
                   ${
                     isDragging
                       ? "border-blue-500 bg-blue-500/10"
                       : selectedFileName
                         ? "border-green-500 bg-green-500/10"
                         : "border-gray-600 bg-gray-800 hover:border-gray-500"
                   }
                   ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {selectedFileName ? (
          <>
            <div className="text-3xl">📄</div>
            <p className="text-sm font-medium text-green-400">
              {selectedFileName}
            </p>
            <p className="text-xs text-gray-500">Click to change file</p>
          </>
        ) : (
          <>
            <div className="text-3xl">📂</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">
                Drop your PDF here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse — max 10MB
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
}
