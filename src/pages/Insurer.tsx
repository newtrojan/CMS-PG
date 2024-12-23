import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Insurer } from "../types/insurer";
import { ChevronDown, Plus } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export const Insurer = () => {
  const { token } = useAuth();
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Insurer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchInsurers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/v1/insurers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch insurers: ${response.statusText}`);
        }

        const result = await response.json();
        const insurersList = result.data || [];
        setInsurers(insurersList);
      } catch (error) {
        console.error("Error fetching insurers:", error);
        setError("Failed to load insurers");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInsurers();
    }
  }, [token]);

  const handleEdit = () => {
    if (!selectedInsurer) return;
    // Create a deep copy of the selected insurer for editing
    setEditedData(JSON.parse(JSON.stringify(selectedInsurer)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedData || !selectedInsurer) return;

    setIsSaving(true);
    try {
      const updateData = {
        name: editedData.name,
        address: editedData.address,
        phone: editedData.phone,
        billingEmail: editedData.billingEmail,
        carrierNote: editedData.carrierNote,
        pricingRules: {
          ...editedData.pricingRules,
          laborType: editedData.pricingRules.laborType || "FLAT",
        },
      };

      console.log(`Updating insurer ${selectedInsurer.id}...`);

      const response = await fetch(
        `http://localhost:5001/api/v1/insurers/${selectedInsurer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }

      // Update the selected insurer with the response data
      const updatedInsurer = result.data as Insurer;
      setSelectedInsurer(updatedInsurer);

      // Update the insurers list, only modifying the updated insurer
      setInsurers((prevInsurers) =>
        prevInsurers.map((insurer) =>
          insurer.id === updatedInsurer.id ? updatedInsurer : insurer
        )
      );

      showNotification({
        type: "success",
        message: "Changes saved successfully",
      });

      setIsEditing(false);
      setEditedData(null);
    } catch (error) {
      console.error(
        `Failed to update insurer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      showNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while saving changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-semibold text-gray-900">Insurers</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Insurer
        </button>
      </div>

      {/* Insurer Selector - Better centered */}
      <div className="max-w-xl mx-auto -mt-6 mb-8">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-gray-500 text-sm">
              {selectedInsurer?.name || "Select an insurer"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {insurers.length > 0 ? (
                insurers.map((insurer) => (
                  <li key={insurer.id}>
                    <button
                      onClick={() => {
                        setSelectedInsurer(insurer);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      {insurer.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2.5 text-center text-sm text-gray-500">
                  No insurers available
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Insurer Details */}
      {selectedInsurer && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 min-w-[100px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 min-w-[100px]"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200 min-w-[100px]"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Fields */}
              {["name", "billingEmail", "phone", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.[field as keyof Insurer] || ""}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev ? { ...prev, [field]: e.target.value } : null
                        )
                      }
                      className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {selectedInsurer[field as keyof Insurer]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Rules Section */}
          <div className="px-6 py-5 border-t">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Pricing Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(selectedInsurer.pricingRules)
                .filter(
                  ([key]) =>
                    !["id", "insurerId", "createdAt", "updatedAt"].includes(key)
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {isEditing ? (
                      <input
                        type={typeof value === "number" ? "number" : "text"}
                        value={editedData?.pricingRules?.[key] ?? value}
                        onChange={(e) =>
                          setEditedData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  pricingRules: {
                                    ...prev.pricingRules,
                                    [key]:
                                      typeof value === "number"
                                        ? Number(e.target.value)
                                        : e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                        className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {typeof value === "number"
                          ? `$${value.toFixed(2)}`
                          : value}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
