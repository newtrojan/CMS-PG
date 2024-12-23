const API_BASE_URL = "/api/v1";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.json();
    } catch (error) {
      console.error("API Request failed");
      throw error;
    }
  },

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("API Request failed");
      throw error;
    }
  },

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("API Request failed");
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.json();
    } catch (error) {
      console.error("API Request failed");
      throw error;
    }
  },
};
