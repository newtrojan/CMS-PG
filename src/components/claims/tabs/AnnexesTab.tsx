// src/components/claims/tabs/AnnexesTab.tsx
import { useState } from "react";
import { Upload, Eye, File, Image } from "lucide-react";
import { UploadModal } from "../modals/UploadModal";

interface FileItem {
  id: string;
  name: string;
  category: string;
  type: "pdf" | "image";
}

export const AnnexesTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Insurance_Report.pdf",
      category: "Insurance Documents",
      type: "pdf",
    },
    {
      id: "2",
      name: "Damage_Photo.jpg",
      category: "Evidence Photos",
      type: "image",
    },
  ]);

  const handleUpload = (file: File, category: string) => {
    // Handle file upload logic here
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      category,
      type: file.type.includes("pdf") ? "pdf" : "image",
    };
    setFiles([...files, newFile]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Uploaded Files</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id}>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    {file.type === "pdf" ? (
                      <File className="h-8 w-8 text-red-500" />
                    ) : (
                      <Image className="h-8 w-8 text-blue-500" />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};
