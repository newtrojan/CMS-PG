import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Insurer as InsurerType } from "../types/insurer";
import { ChevronDown, Plus } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export const Insurer = () => {
  const { token } = useAuth();
  const [insurers, setInsurers] = useState<InsurerType[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<InsurerType | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<InsurerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

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

      // Update selected insurer if it exists in the new list
      if (selectedInsurer) {
        const updatedSelectedInsurer = insurersList.find(
          (insurer: InsurerType) => insurer.id === selectedInsurer.id
        );
        if (updatedSelectedInsurer) {
          setSelectedInsurer(updatedSelectedInsurer);
        }
      }
    } catch (error) {
      console.error("Error fetching insurers:", error);
      setError("Failed to load insurers");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      fetchInsurers();
    }
  }, [token]);

  // Only refresh data when editing is finished
  useEffect(() => {
    if (selectedInsurer && !isEditing && editedData === null) {
      const fetchSelectedInsurer = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/api/v1/insurers/${selectedInsurer.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch insurer: ${response.statusText}`);
          }

          const result = await response.json();
          if (result.data) {
            setSelectedInsurer(result.data);
            // Also update this insurer in the list
            setInsurers((prev) =>
              prev.map((insurer) =>
                insurer.id === result.data.id ? result.data : insurer
              )
            );
          }
        } catch (error) {
          console.error("Error fetching selected insurer:", error);
          // Only show notification for actual errors, not cancellations
          if (error instanceof Error && error.name !== "AbortError") {
            showNotification({
              type: "error",
              message: "Failed to refresh insurer data",
            });
          }
        }
      };

      fetchSelectedInsurer();
    }
  }, [isEditing, editedData]);

  const handleEdit = () => {
    if (!selectedInsurer) return;
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
      const updatedInsurer = result.data as InsurerType;
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

  const handleInsurerSelect = (insurer: InsurerType) => {
    setSelectedInsurer(insurer);
    setIsDropdownOpen(false);
    setIsEditing(false);
    setEditedData(null);
  };

  // Display formatted value for pricing rules and dates
  const formatValue = (value: unknown): string => {
    if (value instanceof Date) {
      return new Date(value).toLocaleDateString();
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Handle dropdown open with refresh
  const handleDropdownToggle = async () => {
    if (!isDropdownOpen) {
      // If we're opening the dropdown, refresh the list
      await fetchInsurers();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fix the linter error for pricing rules input
  const getPricingRuleValue = (
    key: string,
    value: unknown
  ): string | number => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value as string | number;
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

      {/* Insurer Selector */}
      <div className="max-w-xl mx-auto -mt-6 mb-8">
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
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
                      onClick={() => handleInsurerSelect(insurer)}
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

      {/* Selected Insurer Content */}
      {selectedInsurer && (
        <div className="bg-white rounded-lg shadow">
          {/* Action Buttons */}
          <div className="px-6 py-4 border-b flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>

          {/* Basic Information */}
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["name", "billingEmail", "phone", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        (editedData?.[field as keyof InsurerType] as string) ||
                        ""
                      }
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev ? { ...prev, [field]: e.target.value } : null
                        )
                      }
                      className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {formatValue(selectedInsurer[field as keyof InsurerType])}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Rules */}
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
                        value={getPricingRuleValue(
                          key,
                          editedData?.pricingRules?.[key] ?? value
                        )}
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
                          : formatValue(value)}
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
