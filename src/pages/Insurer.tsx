import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types/auth";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// Zod schema for pricing rules
const pricingRulesSchema = z.object({
  domesticWindshield: z.number().min(0),
  domesticTempered: z.number().min(0),
  foreignWindshield: z.number().min(0),
  foreignTempered: z.number().min(0),
  oem: z.number().min(0),
  laborType: z.enum(["FLAT", "MULTIPLIER"]),
  laborTypeValue: z.number().min(0),
  glassLaborRate: z.number().min(0),
  defaultHourlyRate: z.number().min(0),
  laborDomesticWindshield: z.number().min(0),
  laborDomesticTempered: z.number().min(0),
  laborForeignWindshield: z.number().min(0),
  laborForeignTempered: z.number().min(0),
  otherKitFlat: z.number().min(0),
  kitFlat1: z.number().min(0),
  kitFlat1_5: z.number().min(0),
  kitFlat2: z.number().min(0),
  kitFlat2_5: z.number().min(0),
  kitFlat3: z.number().min(0),
});

// Zod schema for insurer form
const insurerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  billingEmail: z.string().email("Invalid email address"),
  carrierNote: z.string().optional(),
  pricingRules: pricingRulesSchema,
});

type InsurerFormData = z.infer<typeof insurerFormSchema>;

export const Insurer = () => {
  const { user } = useAuth();
  const [insurers, setInsurers] = useState<any[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InsurerFormData>({
    resolver: zodResolver(insurerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      billingEmail: "",
      carrierNote: "",
      pricingRules: {
        domesticWindshield: 0,
        domesticTempered: 0,
        foreignWindshield: 0,
        foreignTempered: 0,
        oem: 1,
        laborType: "FLAT",
        laborTypeValue: 0,
        glassLaborRate: 0,
        defaultHourlyRate: 0,
        laborDomesticWindshield: 0,
        laborDomesticTempered: 0,
        laborForeignWindshield: 0,
        laborForeignTempered: 0,
        otherKitFlat: 0,
        kitFlat1: 0,
        kitFlat1_5: 0,
        kitFlat2: 0,
        kitFlat2_5: 0,
        kitFlat3: 0,
      },
    },
  });

  const canModify =
    user?.role && [Role.CCM, Role.ADMIN, Role.SUDO].includes(user.role);

  useEffect(() => {
    fetchInsurers();
  }, []);

  const fetchInsurers = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/insurers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setInsurers(data.data);
      } else {
        setError(data.message || "Failed to fetch insurers");
      }
    } catch (error) {
      console.error("Failed to fetch insurers:", error);
      setError("Failed to fetch insurers. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: InsurerFormData) => {
    if (!canModify) return;

    setIsLoading(true);
    try {
      const url = selectedInsurer
        ? `/api/v1/insurers/${selectedInsurer}`
        : "/api/v1/insurers";

      const response = await fetch(url, {
        method: selectedInsurer ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        fetchInsurers();
        form.reset();
        setSelectedInsurer(null);
      }
    } catch (error) {
      console.error("Failed to save insurer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Insurers Management</h1>

      {/* Loading State */}
      {isLoadingData && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insurers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Insurers List */}
      {!isLoadingData && !error && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Existing Insurers</h2>
            {canModify && (
              <Button
                onClick={() => {
                  setSelectedInsurer(null);
                  form.reset();
                }}
                variant="outline"
              >
                Add New Insurer
              </Button>
            )}
          </div>

          {insurers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No insurers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insurers.map((insurer) => (
                <div
                  key={insurer.id}
                  className={`p-4 border rounded-lg hover:shadow-md ${
                    canModify ? "cursor-pointer" : ""
                  } ${
                    selectedInsurer === insurer.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => {
                    if (canModify) {
                      setSelectedInsurer(insurer.id);
                      form.reset({
                        name: insurer.name,
                        address: insurer.address,
                        phone: insurer.phone,
                        billingEmail: insurer.billingEmail,
                        carrierNote: insurer.carrierNote,
                        pricingRules: insurer.pricingRules,
                      });
                    }
                  }}
                >
                  <h3 className="font-semibold">{insurer.name}</h3>
                  <p className="text-sm text-gray-600">{insurer.address}</p>
                  <p className="text-sm text-gray-600">{insurer.phone}</p>
                  <p className="text-sm text-gray-600">
                    {insurer.billingEmail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insurer Form */}
      {canModify && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carrierNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier Note</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Rules */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pricing Rules</h2>
                {/* Add pricing rule fields here */}
                {/* Example of a pricing rule field */}
                <FormField
                  control={form.control}
                  name="pricingRules.laborType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labor Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select labor type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FLAT">Flat</SelectItem>
                          <SelectItem value="MULTIPLIER">Multiplier</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add more pricing rule fields similarly */}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !canModify}
              className="w-full md:w-auto"
            >
              {isLoading
                ? "Saving..."
                : selectedInsurer
                ? "Update Insurer"
                : "Create Insurer"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
