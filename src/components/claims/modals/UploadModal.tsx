import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string) => void;
}

export const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Insurance Documents");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium mb-4">Upload File</h2>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p>Drop the file here</p>
          ) : (
            <div>
              <p className="text-gray-600">Drag and drop your file here or</p>
              <p className="text-blue-600">browse files</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="text-sm">{selectedFile.name}</p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          >
            <option>Insurance Documents</option>
            <option>Evidence Photos</option>
            <option>Repair Estimates</option>
            <option>Other Documents</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedFile && onUpload(selectedFile, category)}
            disabled={!selectedFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
