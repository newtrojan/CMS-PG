// src/components/claims/ClaimsTable.tsx
import { StatusBadge } from "./StatusBadge";

export const ClaimsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Claim ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Deductible
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Shop Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Last Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              First Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Your table rows here */}
          <tr>
            <td className="px-6 py-4">#CL-2025001</td>
            <td className="px-6 py-4">$500</td>
            <td className="px-6 py-4">AutoFix Pro</td>
            <td className="px-6 py-4">Smith</td>
            <td className="px-6 py-4">John</td>
            <td className="px-6 py-4">+1 234-567-8900</td>
            <td className="px-6 py-4">
              <StatusBadge status="open" />
            </td>
          </tr>
          {/* More rows... */}
        </tbody>
      </table>
    </div>
  );
};
