// src/components/claims/tabs/parts/PartsTable.tsx
export const PartsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Part Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              List Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Shop Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Carrier Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>
              No parts added yet
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
