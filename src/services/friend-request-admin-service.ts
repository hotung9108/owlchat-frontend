import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const FRIEND_REQUEST_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/admin/friend-request`;

/* ---------------- TYPES ---------------- */

export interface FriendRequestQueryParams {
  keywords?: string;
  page?: number;
  size?: number;
  status?: string;
  ascSort?: boolean;
}

export interface CreateFriendRequest {
  senderId: string;
  receiverId: string;
}

export type FriendRequestResponseType = "ACCEPTED" | "REJECTED";

/* ---------------- SERVICE ---------------- */

export const friendRequestAdminService = {
  // GET /admin/friend-request
  getAll: (params?: FriendRequestQueryParams) => {
    return apiClient.get(FRIEND_REQUEST_BASE_URL, { params });
  },

  // GET /admin/friend-request/{id}
  getById: (id: string) => {
    return apiClient.get(`${FRIEND_REQUEST_BASE_URL}/${id}`);
  },

  // POST /admin/friend-request
  create: (data: CreateFriendRequest) => {
    return apiClient.post(FRIEND_REQUEST_BASE_URL, data);
  },

  // DELETE /admin/friend-request/{id}
  delete: (id: string) => {
    return apiClient.delete(`${FRIEND_REQUEST_BASE_URL}/${id}`);
  },

  // PATCH /admin/friend-request/{id}/response
  respond: (id: string, response: FriendRequestResponseType) => {
    return apiClient.patch(
      `${FRIEND_REQUEST_BASE_URL}/${id}/response`,
      { response }
    );
  },

  // GET /admin/friend-request/user/{userId}
  getByUser: (userId: string) => {
    return apiClient.get(`${FRIEND_REQUEST_BASE_URL}/user/${userId}`);
  },

  // GET /admin/friend-request/sender/{senderId}
  getBySender: (senderId: string) => {
    return apiClient.get(`${FRIEND_REQUEST_BASE_URL}/sender/${senderId}`);
  },

  // GET /admin/friend-request/receiver/{receiverId}
  getByReceiver: (receiverId: string) => {
    return apiClient.get(`${FRIEND_REQUEST_BASE_URL}/receiver/${receiverId}`);
  },

  // GET /admin/friend-request/sender/{senderId}/receiver/{receiverId}
  getBySenderReceiver: (senderId: string, receiverId: string) => {
    return apiClient.get(
      `${FRIEND_REQUEST_BASE_URL}/sender/${senderId}/receiver/${receiverId}`
    );
  },

  // GET /admin/friend-request/first-user/{firstUserId}/second-user/{secondUserId}
  getBetweenUsers: (firstUserId: string, secondUserId: string) => {
    return apiClient.get(
      `${FRIEND_REQUEST_BASE_URL}/first-user/${firstUserId}/second-user/${secondUserId}`
    );
  },
};