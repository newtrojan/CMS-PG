interface ActionButtonsProps {
  activeForm: "nags" | "custom" | "labor" | "deductible" | "rebate" | null;
  onFormChange: (
    form: "nags" | "custom" | "labor" | "deductible" | "rebate" | null
  ) => void;
}

export const ActionButtons = ({
  activeForm,
  onFormChange,
}: ActionButtonsProps) => {
  const buttons = [
    { id: "nags", label: "Add from NAGS", icon: "+" },
    { id: "custom", label: "Add Custom Part", icon: "+" },
    { id: "labor", label: "Add Labor", icon: "🔧" },
    { id: "deductible", label: "Add Deductible Buyback", icon: "$" },
    { id: "rebate", label: "Add Rebate", icon: "↩️" },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex gap-4">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => onFormChange(button.id)}
            className={`
                 flex items-center gap-2 px-4 py-2 rounded-lg
                 ${
                   activeForm === button.id
                     ? "bg-blue-600 text-white"
                     : "bg-gray-50 hover:bg-gray-100"
                 }
               `}
          >
            <span>{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};
