import { useRef, useState } from "react";

//props interface for PDFInput component
interface PDFInputProps {
  onFileSelect: (base64: string, fileName: string) => void;
  isLoading: boolean;
  selectedFileName: string;
}

// The getPrompt Function
export default function PDFInput({
  onFileSelect,
  isLoading,
  selectedFileName,
}: PDFInputProps) {
  // State to track if a file is being dragged over the drop area
  const [isDragging, setIsDragging] = useState(false);
  // Ref for the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to process the selected file, either from drag-and-drop or file input
  const processFile = (file: File) => {
    // Basic validation for file type and size
    if (!file) return;

    // Only allow PDF files
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    // Limit file size to 10MB for better performance and to avoid hitting API limits
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a PDF under 10MB.");
      return;
    }

    // Read the file as a base64 string using FileReader
    const reader = new FileReader();

    // When the file is loaded, extract the base64 string and pass it to the parent component via onFileSelect
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];

      // readAsDataURL returns a string that looks like this:
      // data:application/pdf;base64,JVBERi0xLjQKJcfs..
      // We only want the part after the comma — the actual Base64 data. .split(",")[1] splits on the comma and takes the second part. The data:application/pdf;base64, prefix would confuse our server so we strip it here.

      onFileSelect(base64, file.name);
    };

    reader.readAsDataURL(file);
  };

  // Handler for file input change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Handlers for drag-and-drop events to manage the dragging state and process the dropped file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // Handler for when a file is dragged over the drop area to set the dragging state
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handler for when a file is dragged away from the drop area to reset the dragging state
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
