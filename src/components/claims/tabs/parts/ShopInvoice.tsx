// src/components/claims/tabs/parts/ShopInvoice.tsx
import { useState } from "react";
import { ShopInvoiceUpload } from "./ShopInvoiceUpload";

export const ShopInvoice = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    date: "",
    shopAmount: "",
    preTaxAmount: "",
    shopAdminFee: {
      percentage: "",
      amount: "",
    },
    shopAdminFeeTax: "",
    deductible: "",
    total: "",
    shopAmountFinal: "",
    variance: "",
  });

  const handleUpload = (file: File) => {
    console.log("Uploaded shop invoice:", file);
    setIsUploadModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Shop Invoice</h3>

      <div className="space-y-4">
        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="yyyy-mm-dd"
          />
        </div>

        {/* Shop Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shop Amount
          </label>
          <input
            type="number"
            name="shopAmount"
            value={formData.shopAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Pre Tax Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pre Tax Amount
          </label>
          <input
            type="number"
            name="preTaxAmount"
            value={formData.preTaxAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Shop Admin Fee */}
        <div className="flex gap-2">
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700">%</label>
            <input
              type="number"
              name="shopAdminFee.percentage"
              value={formData.shopAdminFee.percentage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700">$</label>
            <input
              type="number"
              name="shopAdminFee.amount"
              value={formData.shopAdminFee.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
        </div>

        {/* Shop Admin Fee Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shop Admin Fee Tax
          </label>
          <input
            type="number"
            name="shopAdminFeeTax"
            value={formData.shopAdminFeeTax}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Deductible */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deductible
          </label>
          <input
            type="number"
            name="deductible"
            value={formData.deductible}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total
          </label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
            readOnly
          />
        </div>

        {/* Shop Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shop Amount
          </label>
          <input
            type="number"
            name="shopAmountFinal"
            value={formData.shopAmountFinal}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Variance */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Variance
          </label>
          <input
            type="number"
            name="variance"
            value={formData.variance}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
            readOnly
          />
        </div>

        {/* Upload Section */}
        <div
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
        >
          <div className="text-gray-600">
            <p>Drop files here or click to upload</p>
            <p className="text-sm">
              To be able to audit the invoice, please complete the above.
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Calculate
        </button>
      </div>

      <ShopInvoiceUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};
