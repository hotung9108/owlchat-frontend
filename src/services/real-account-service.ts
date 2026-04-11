import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const USER_PROFILE_BASE_URL = `${API_ENDPOINTS.USER_SERVICE}/account`;

/* ---------------- TYPES ---------------- */

export interface AccountQueryParams {
  keywords?: string;
  page?: number;
  size?: number;
  status?: number; // backend uses integer
  ascSort?: boolean;
}

export interface CreateAccountRequest {
  role: string;
  username: string;
  password: string;
}

export interface UpdateAccountRequest {
  role: string;
  username: string;
  password: string;
}

/* ---------------- SERVICE ---------------- */

export const accountService = {
  // GET /account
  getAccounts: (params?: AccountQueryParams) => {
    return apiClient.get(USER_PROFILE_BASE_URL, { params });
  },

  // GET /account/{id}
  getAccountById: (id: string) => {
    return apiClient.get(`${USER_PROFILE_BASE_URL}/${id}`);
  },

  // POST /account
  createAccount: (data: CreateAccountRequest) => {
    return apiClient.post(USER_PROFILE_BASE_URL, data);
  },

  // PUT /account/{id}
  updateAccount: (id: string, data: UpdateAccountRequest) => {
    return apiClient.put(`${USER_PROFILE_BASE_URL}/${id}`, data);
  },

  // DELETE /account/{id}
  deleteAccount: (id: string) => {
    return apiClient.delete(`${USER_PROFILE_BASE_URL}/${id}`);
  },

  // PATCH /account/{id}/status/{status}
  updateStatus: (id: string, status: boolean) => {
    console.log(`${USER_PROFILE_BASE_URL}/${id}/status/${status}`);
    return apiClient.patch(
      `${USER_PROFILE_BASE_URL}/${id}/status/${status}`
    );
  },
};