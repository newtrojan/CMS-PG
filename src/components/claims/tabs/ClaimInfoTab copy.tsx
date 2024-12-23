import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AddressAutocomplete } from "../../common/AddressAutocomplete";
import { useInsurers } from "../../../hooks/useInsurers";

interface ClaimFormData {
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
  const { register, control, setValue } = useForm<ClaimFormData>();
  const { data: insurers, isLoading: isLoadingInsurers } = useInsurers();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    if (
      window.google ||
      document.querySelector('script[src*="maps.googleapis.com"]')
    ) {
      setIsGoogleLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is not defined");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      const scriptTag = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, []);

  if (isLoadingInsurers) {
    return <div>Loading insurers...</div>;
  }

  const insurersList = Array.isArray(insurers) ? insurers : [];

  // Your existing JSX remains the same, just update the insurers mapping:
  return (
    <div className="space-y-6">
      {/* ... other parts of your form ... */}

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
          {insurersList.map((insurer) => (
            <option key={insurer.id} value={insurer.id}>
              {insurer.name} {insurer.code ? `(${insurer.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      {isGoogleLoaded && (
        <AddressAutocomplete control={control} setValue={setValue} />
      )}

      {/* ... rest of your form ... */}
    </div>
  );
};
