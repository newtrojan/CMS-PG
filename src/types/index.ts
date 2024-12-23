export type ClaimStatus = "Open" | "Assessing" | "Closed";

export interface Claim {
  id: string;
  claimId: string;
  deductible: string;
  shopName: string;
  lastName: string;
  firstName: string;
  contact: string;
  status: ClaimStatus;
}
