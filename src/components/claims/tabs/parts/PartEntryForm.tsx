// src/components/claims/tabs/parts/PartEntryForm.tsx
interface PartEntryFormProps {
  formType: "nags" | "custom" | "labor" | "deductible" | "rebate";
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const PartEntryForm = ({
  formType,
  onClose,
  onSubmit,
}: PartEntryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {formType === "nags" && "Add from NAGS"}
          {formType === "custom" && "Add Custom Part"}
          {formType === "labor" && "Add Labor"}
          {formType === "deductible" && "Add Deductible Buyback"}
          {formType === "rebate" && "Add Rebate"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          ×
        </button>
      </div>

      {/* Placeholder form fields - customize based on formType */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit({ description: "", price: 0 })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};
