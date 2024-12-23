// src/components/claims/tabs/parts/FinancialSummary.tsx
export const FinancialSummary = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (13%)</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>
    </div>
  );
};
