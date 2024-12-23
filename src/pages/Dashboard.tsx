import { ClaimsTable } from "../components/claims/ClaimsTable";
import { FilterBar } from "../components/claims/FilterBar";
import { useState } from "react";

export const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <ClaimsTable />
    </div>
  );
};
