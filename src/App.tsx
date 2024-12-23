// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Insurer } from "./pages/Insurer";
import { NewClaimForm } from "./components/claims/NewClaimForm";
import { ClaimInfoTab } from "./components/claims/tabs/ClaimInfoTab";
import { PartsTab } from "./components/claims/tabs/parts/PartsTab";
import { AnnexesTab } from "./components/claims/tabs/AnnexesTab";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
              <Route path="insurer" element={<Insurer />} />
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
