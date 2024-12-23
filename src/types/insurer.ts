export interface PricingRules {
  id: string;
  insurerId: string;
  domesticWindshield: number;
  domesticTempered: number;
  foreignWindshield: number;
  foreignTempered: number;
  oem: number;
  laborType: "FLAT" | "MULTIPLIER";
  laborTypeValue: number;
  glassLaborRate: number;
  defaultHourlyRate: number;
  laborDomesticWindshield: number;
  laborDomesticTempered: number;
  laborForeignWindshield: number;
  laborForeignTempered: number;
  otherKitFlat: number;
  kitFlat1: number;
  kitFlat1_5: number;
  kitFlat2: number;
  kitFlat2_5: number;
  kitFlat3: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | number | Date;
}

export interface Insurer {
  id: string;
  name: string;
  address: string;
  phone: string;
  billingEmail: string;
  carrierNote?: string;
  pricingRules: PricingRules;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | PricingRules | Date | undefined;
}
