// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewClaimForm } from "./components/claims/NewClaimForm";
import { ClaimInfoTab } from "./components/claims/tabs/ClaimInfoTab";
import { PartsTab } from "./components/claims/tabs/parts/PartsTab";
import { AnnexesTab } from "./components/claims/tabs/AnnexesTab";

// Create a client
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
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/claims/new" element={<NewClaimForm />}>
              <Route path="claim-info" element={<ClaimInfoTab />} />
              <Route path="parts" element={<PartsTab />} />
              <Route path="annexes" element={<AnnexesTab />} />
            </Route>
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
