// src/components/claims/tabs/parts/ShopInvoiceUpload.tsx
import { UploadModal } from "../../modals/UploadModal";

interface ShopInvoiceUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export const ShopInvoiceUpload = ({
  isOpen,
  onClose,
  onUpload,
}: ShopInvoiceUploadProps) => {
  return (
    <UploadModal
      isOpen={isOpen}
      onClose={onClose}
      onUpload={(file) => onUpload(file)}
    />
  );
};
