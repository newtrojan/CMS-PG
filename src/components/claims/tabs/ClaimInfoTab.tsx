// src/components/claims/tabs/ClaimInfoTab.tsx
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { AddressAutocomplete } from "../../common/AddressAutocomplete";
import { useInsurers } from "../../../hooks/useInsurers";

export interface ClaimFormData {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
  homeTel: string;
  businessTel: string;
  driversLicense: string;
  insurerId: string;
  insurerAuthNumber: string;
}

export const ClaimInfoTab = () => {
  const { register, control, setValue, handleSubmit } =
    useForm<ClaimFormData>();
  const {
    data: insurers,
    isLoading: isLoadingInsurers,
    error: insurersError,
  } = useInsurers();

  const onSubmit = (data: ClaimFormData) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
  };

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const loadGoogleMapsScript = () => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
        if (!apiKey) {
          console.error(
            "Google Maps API key is not defined in environment variables"
          );
          return;
        }

        if (
          !document.querySelector(
            'script[src^="https://maps.googleapis.com/maps/api/js"]'
          )
        ) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      };

      loadGoogleMapsScript();
    }
  }, []);

  if (isLoadingInsurers) {
    return <div>Loading insurers...</div>;
  }

  if (insurersError) {
    return (
      <div>Error loading insurers: {(insurersError as Error).message}</div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* First Row: Carrier/Insurer and Shop Information */}
      <div className="grid grid-cols-2 gap-6">
        {/* Carrier/Insurer Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">
            Carrier/Insurer Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Insurer's Name
              </label>
              <select
                {...register("insurerId")}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                disabled={isLoadingInsurers}
              >
                <option value="">Select Insurer</option>
                {Array.isArray(insurers) &&
                  insurers.map((insurer) => (
                    <option key={insurer.id} value={insurer.id}>
                      {insurer.name} {insurer.code ? `(${insurer.code})` : ""}
                    </option>
                  ))}
              </select>
              {!Array.isArray(insurers) && (
                <p className="text-red-500 text-sm mt-1">
                  Error loading insurers
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insurer Auth #
                </label>
                <input
                  {...register("insurerAuthNumber")}
                  type="text"
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center mt-6">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm text-gray-700">
                  Talked to Insured
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Replacement Cost
                </label>
                <select className="mt-1 block w-full border rounded-md px-3 py-2">
                  <option>Select type</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Claim Initiated By
                </label>
                <select className="mt-1 block w-full border rounded-md px-3 py-2">
                  <option>Select initiator</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy #
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Claim #
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deductible
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Authorization Notes
              </label>
              <textarea className="mt-1 block w-full border rounded-md px-3 py-2 h-24" />
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Shop Information</h2>
            <button className="text-blue-600 hover:text-blue-700">
              <span className="sr-only">Search</span>
              🔍
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact #
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Customer and Vehicle Information */}
      <div className="grid grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address 1
            </label>
            <AddressAutocomplete control={control} setValue={setValue} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address 2
            </label>
            <input
              {...register("address2")}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                {...register("city")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <select
                {...register("province")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select province</option>
                <option value="AB">Alberta</option>
                <option value="BC">British Columbia</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland and Labrador</option>
                <option value="NS">Nova Scotia</option>
                <option value="ON">Ontario</option>
                <option value="PE">Prince Edward Island</option>
                <option value="QC">Quebec</option>
                <option value="SK">Saskatchewan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                {...register("postalCode")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Home Tel #
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Business Tel #
            </label>
            <input
              type="tel"
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Driver's License
            </label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body Style
              </label>
              <select className="mt-1 block w-full border rounded-md px-3 py-2">
                <option>Select style</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              VIN
            </label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plate #
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Odometer
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Province
              </label>
              <select className="mt-1 block w-full border rounded-md px-3 py-2">
                <option>Select province</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Work Order Memo and Internal Notes */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Work Order Memo</h2>
          <textarea className="w-full h-32 border rounded-md px-3 py-2" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Internal Notes</h2>
          <textarea className="w-full h-32 border rounded-md px-3 py-2" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit Claim
        </button>
      </div>
    </form>
  );
};
