// src/pages/Dashboard.tsx
import { useState } from "react";
import { FilterBar } from "../components/claims/FilterBar";
import { ClaimsTable } from "../components/claims/ClaimsTable";

export const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <ClaimsTable />
    </div>
  );
};
