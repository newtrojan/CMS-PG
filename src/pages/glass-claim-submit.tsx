import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

interface Insurer {
  id: string;
  name: string;
}

enum ClaimType {
  COLLISION = "COLLISION",
  GLASS = "GLASS",
  BOTH = "BOTH",
}

interface ClaimFormData {
  // Contact Information
  name: string;
  phone: string;
  email: string;
  password: string; // Added for user registration

  // Claim Details
  insurerId: string;
  claimType: ClaimType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  notes: string;
  policeReport: string;
  photos: File[];
}

export const GlassClaimSubmit = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<ClaimFormData>({
    name: "",
    phone: "",
    email: "",
    password: "", // Added for user registration
    insurerId: "",
    claimType: ClaimType.GLASS,
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    notes: "",
    policeReport: "",
    photos: [],
  });

  // Fetch insurers list
  const { data: insurers, isLoading } = useQuery<Insurer[]>({
    queryKey: ["insurers"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/v1/insurers/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch insurers");
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error fetching insurers:", error);
        showNotification({
          type: "error",
          message: "Failed to load insurance providers",
        });
        return [];
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(files)],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Register user
      const registerResponse = await fetch(
        "http://localhost:5001/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "USER",
          }),
        }
      );

      if (!registerResponse.ok) {
        throw new Error("Failed to register user");
      }

      const registerData = await registerResponse.json();

      // 2. Submit claim with user reference
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "photos") {
          formDataToSend.append(key, value);
        }
      });

      // Add photos
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      formDataToSend.append("userId", registerData.data.id);
      formDataToSend.append("status", "WEB");

      const claimResponse = await fetch(
        "http://localhost:5001/api/v1/claims/web",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!claimResponse.ok) {
        throw new Error("Failed to submit claim");
      }

      showNotification({
        type: "success",
        message:
          "Claim submitted successfully. Please check your email for login details.",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        insurerId: "",
        claimType: ClaimType.GLASS,
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        notes: "",
        policeReport: "",
        photos: [],
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
      showNotification({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit claim",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-8 py-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-900">
              Submit a Claim
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Please fill out the form below to submit your claim
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    You'll need this password to check your claim status later
                  </p>
                </div>
              </div>
            </div>

            {/* Claim Details Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Claim Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="insurerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Insurance Provider
                  </label>
                  <select
                    id="insurerId"
                    name="insurerId"
                    required
                    value={formData.insurerId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select an insurer</option>
                    {insurers?.map((insurer) => (
                      <option key={insurer.id} value={insurer.id}>
                        {insurer.name}
                      </option>
                    ))}
                  </select>
                  {isLoading && (
                    <p className="mt-1 text-sm text-gray-500">
                      Loading insurers...
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="claimType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type of Claim
                  </label>
                  <select
                    id="claimType"
                    name="claimType"
                    required
                    value={formData.claimType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Object.values(ClaimType).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="vehicleMake"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vehicle Make
                  </label>
                  <input
                    type="text"
                    id="vehicleMake"
                    name="vehicleMake"
                    required
                    value={formData.vehicleMake}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vehicleModel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    id="vehicleModel"
                    name="vehicleModel"
                    required
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vehicleYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vehicle Year
                  </label>
                  <input
                    type="text"
                    id="vehicleYear"
                    name="vehicleYear"
                    required
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="policeReport"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Police Report # (Optional)
                  </label>
                  <input
                    type="text"
                    id="policeReport"
                    name="policeReport"
                    value={formData.policeReport}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Photos</h2>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600">
                    <label
                      htmlFor="photo-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload photos</span>
                      <input
                        id="photo-upload"
                        name="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handlePhotoUpload(e.target.files)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Uploaded photo ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            photos: prev.photos.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
