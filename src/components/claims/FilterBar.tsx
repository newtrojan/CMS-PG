// src/components/claims/FilterBar.tsx
interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const FilterBar = ({
  statusFilter,
  onStatusChange,
  onSearchChange,
}: FilterBarProps) => {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border rounded-md py-2 px-3"
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="assessing">Assessing</option>
        <option value="closed">Closed</option>
      </select>

      <input
        type="text"
        placeholder="Search claims..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded-md py-2 px-3"
      />
    </div>
  );
};
