// src/components/claims/NewClaimForm.tsx
import { Link, useLocation, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NewClaimForm = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop();

  const tabs = [
    { id: "claim-info", label: "Claim Info" },
    { id: "parts", label: "Parts" },
    { id: "annexes", label: "Annexes" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold">New Claim</h1>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Claim
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={`/claims/new/${tab.id}`}
              className={`
                py-4 px-1 border-b-2 font-medium text-lg
                ${
                  currentTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};
