import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const FRIENDSHIP_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/admin/friendship`;

/* ---------------- TYPES ---------------- */

export interface CreateFriendshipRequest {
  firstUserId: string;
  secondUserId: string;
}

/* ---------------- SERVICE ---------------- */

export const friendshipAdminService = {
  // GET /admin/friendship
  getAll: () => {
    return apiClient.get(FRIENDSHIP_BASE_URL);
  },

  // GET /admin/friendship/{id}
  getById: (id: string) => {
    return apiClient.get(`${FRIENDSHIP_BASE_URL}/${id}`);
  },

  // POST /admin/friendship
  create: (data: CreateFriendshipRequest) => {
    return apiClient.post(FRIENDSHIP_BASE_URL, data);
  },

  // DELETE /admin/friendship/{id}
  delete: (id: string) => {
    return apiClient.delete(`${FRIENDSHIP_BASE_URL}/${id}`);
  },

  // GET /admin/friendship/user/{userId}
  getByUser: (userId: string) => {
    return apiClient.get(`${FRIENDSHIP_BASE_URL}/user/${userId}`);
  },

  // GET /admin/friendship/first-user/{firstUserId}/second-user/{secondUserId}
  checkFriendship: (firstUserId: string, secondUserId: string) => {
    return apiClient.get(
      `${FRIENDSHIP_BASE_URL}/first-user/${firstUserId}/second-user/${secondUserId}`
    );
  },
};