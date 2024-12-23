// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Insurer } from "./pages/Insurer";
import { NewClaimForm } from "./components/claims/NewClaimForm";
import { ClaimInfoTab } from "./components/claims/tabs/ClaimInfoTab";
import { PartsTab } from "./components/claims/tabs/parts/PartsTab";
import { AnnexesTab } from "./components/claims/tabs/AnnexesTab";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Placeholder components for routes without content yet
const Reports = () => <div className="p-4">Reports Page Coming Soon</div>;
const Customers = () => <div className="p-4">Customers Page Coming Soon</div>;
const Settings = () => <div className="p-4">Settings Page Coming Soon</div>;

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="insurer" element={<Insurer />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
              <Route path="claims/new" element={<NewClaimForm />}>
                <Route path="claim-info" element={<ClaimInfoTab />} />
                <Route path="parts" element={<PartsTab />} />
                <Route path="annexes" element={<AnnexesTab />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
