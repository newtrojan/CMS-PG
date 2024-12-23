// src/hooks/useInsurers.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Insurer {
  id: string;
  name: string;
  code: string | null;
}

export const useInsurers = () => {
  return useQuery<Insurer[]>({
    queryKey: ["insurers"],
    queryFn: async () => {
      const { data } = await axios.get("/api/insurers");
      return data;
    },
  });
};
