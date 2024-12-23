// src/components/claims/tabs/parts/PartsTab.tsx
import { useState } from "react";
import { ShopInvoice } from "./ShopInvoice";
import { PartsTable } from "./PartsTable";
import { PartEntryForm } from "./PartEntryForm";
import { FinancialSummary } from "./FinancialSummary";

export const PartsTab = () => {
  const [activeForm, setActiveForm] = useState<
    "nags" | "custom" | "labor" | "deductible" | "rebate" | null
  >(null);

  const buttonConfigs = [
    {
      id: "nags",
      label: "Add from NAGS",
      icon: "+",
      colorClass: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      id: "custom",
      label: "Add Custom Part",
      icon: "+",
      colorClass: "bg-gray-100 hover:bg-gray-200",
    },
    {
      id: "labor",
      label: "Add Labor",
      icon: "🔧",
      colorClass: "bg-gray-100 hover:bg-gray-200",
    },
    {
      id: "deductible",
      label: "Add Deductible Buyback",
      icon: "$",
      colorClass: "bg-gray-100 hover:bg-gray-200",
    },
    {
      id: "rebate",
      label: "Add Rebate",
      icon: "↩️",
      colorClass: "bg-gray-100 hover:bg-gray-200",
    },
  ] as const;

  return (
    <div className="flex gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-grow space-y-6">
        {/* Action Buttons Container */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex gap-4">
            {buttonConfigs.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveForm(button.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg 
                  ${
                    activeForm === button.id
                      ? "bg-blue-600 text-white"
                      : button.colorClass
                  }
                  transition-colors duration-150
                `}
              >
                <span>{button.icon}</span>
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        {activeForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <PartEntryForm
              formType={activeForm}
              onClose={() => setActiveForm(null)}
              onSubmit={(data) => {
                console.log("Form submitted:", data);
                setActiveForm(null);
              }}
            />
          </div>
        )}

        {/* Parts Table */}
        <PartsTable />

        {/* Financial Summary */}
        <FinancialSummary />
      </div>

      {/* Shop Invoice - Right Side */}
      <div className="w-96">
        <ShopInvoice />
      </div>
    </div>
  );
};
