import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const BLOCK_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/admin/block`;

/* ---------------- TYPES ---------------- */

export interface BlockQueryParams {
  page?: number;
  size?: number;
  ascSort?: boolean;
  createdDateStart?: string;
  createdDateEnd?: string;
}

export interface CreateBlockRequest {
  blockerId: string;
  blockedId: string;
}

/* ---------------- SERVICE ---------------- */

export const blockAdminService = {
  // GET /admin/block
  getAll: (params?: BlockQueryParams) => {
    return apiClient.get(BLOCK_BASE_URL, { params });
  },

  // GET /admin/block/{id}
  getById: (id: string) => {
    return apiClient.get(`${BLOCK_BASE_URL}/${id}`);
  },

  // POST /admin/block
  create: (data: CreateBlockRequest) => {
    return apiClient.post(BLOCK_BASE_URL, data);
  },

  // DELETE /admin/block/{id}
  delete: (id: string) => {
    return apiClient.delete(`${BLOCK_BASE_URL}/${id}`);
  },

  // GET /admin/block/user/{userId}/blocker
  getBlockersOfUser: (userId: string) => {
    return apiClient.get(`${BLOCK_BASE_URL}/user/${userId}/blocker`);
  },

  // GET /admin/block/user/{userId}/blocked
  getBlockedByUser: (userId: string) => {
    return apiClient.get(`${BLOCK_BASE_URL}/user/${userId}/blocked`);
  },

  // GET /admin/block/blocker/{blockerId}/blocked/{blockedId}
  checkBlock: (blockerId: string, blockedId: string) => {
    return apiClient.get(
      `${BLOCK_BASE_URL}/blocker/${blockerId}/blocked/${blockedId}`
    );
  },
};