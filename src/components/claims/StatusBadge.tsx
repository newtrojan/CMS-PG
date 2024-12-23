// src/components/claims/StatusBadge.tsx
interface StatusBadgeProps {
  status: "open" | "assessing" | "closed";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "assessing":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
