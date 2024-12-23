import { useEffect, useRef, useState } from "react";
import { UseFormSetValue, Control, Controller } from "react-hook-form";
import type { ClaimFormData } from "../claims/tabs/ClaimInfoTab";

// Add type definitions for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

interface AddressAutocompleteProps {
  control: Control<ClaimFormData>;
  setValue: UseFormSetValue<ClaimFormData>;
  disabled?: boolean;
}

export const AddressAutocomplete = ({
  control,
  setValue,
  disabled = false,
}: AddressAutocompleteProps) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!window.google || !inputRef.current) {
        setError("Google Maps API not loaded");
        return;
      }

      try {
        const options: google.maps.places.AutocompleteOptions = {
          componentRestrictions: { country: "ca" },
          fields: ["address_components", "formatted_address", "geometry"],
        };

        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        autoCompleteRef.current.addListener("place_changed", () => {
          const place = autoCompleteRef.current?.getPlace();

          if (!place?.address_components) {
            setError("Invalid address selected");
            return;
          }

          const addressData = {
            street: "",
            city: "",
            province: "",
            postalCode: "",
          };

          place.address_components.forEach(
            (component: google.maps.GeocoderAddressComponent) => {
              const type = component.types[0];
              if (type === "street_number") {
                addressData.street = component.long_name;
              }
              if (type === "route") {
                addressData.street += " " + component.long_name;
              }
              if (type === "locality") {
                addressData.city = component.long_name;
              }
              if (type === "administrative_area_level_1") {
                addressData.province = component.short_name;
              }
              if (type === "postal_code") {
                addressData.postalCode = component.long_name;
              }
            }
          );

          setValue("address1", addressData.street.trim());
          setValue("city", addressData.city);
          setValue("province", addressData.province);
          setValue("postalCode", addressData.postalCode);
          setError(null);
        });
      } catch (err) {
        setError("Error initializing Google Maps Autocomplete");
        console.error("Error initializing Google Maps Autocomplete:", err);
      }
    };

    // Initialize autocomplete when the script is loaded
    if (window.google) {
      initializeAutocomplete();
    } else {
      // Add event listener for when the script loads
      const handleScriptLoad = () => {
        initializeAutocomplete();
      };
      window.addEventListener("google-maps-loaded", handleScriptLoad);
      return () => {
        window.removeEventListener("google-maps-loaded", handleScriptLoad);
      };
    }

    return () => {
      if (autoCompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autoCompleteRef.current
        );
      }
    };
  }, [setValue]);

  return (
    <div>
      <Controller
        name="address1"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            ref={(e) => {
              inputRef.current = e;
              field.ref(e);
            }}
            type="text"
            className="mt-1 block w-full border rounded-md px-3 py-2"
            placeholder="Start typing to search address..."
            disabled={disabled}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
