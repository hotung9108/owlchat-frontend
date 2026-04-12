import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const CHAT_API = `${API_ENDPOINTS.CHAT_SERVICE}/admin/chat`;

/* ---------------- TYPES ---------------- */

export interface ChatQueryParams {
  keywords?: string;
  page?: number;
  size?: number;
  ascSort?: boolean;
  status?: boolean;
  type?: string;
  initiatorId?: string;
  createdDateStart?: string;
  createdDateEnd?: string;
}

export interface CreateChatRequest {
  type: string;
  name: string;
  initiatorId: string;
}

export interface UpdateChatRequest {
  type: string;
  name: string;
  initiatorId: string;
}

/* ---------------- API FUNCTIONS ---------------- */

export const chatAdminService = {
  // GET /admin/chat
  getChats: (params?: ChatQueryParams) => {
    return apiClient.get(CHAT_API, { params });
  },

  // GET /admin/chat/{chatId}
  getChatById: (chatId: string) => {
    return apiClient.get(`${CHAT_API}/${chatId}`);
  },

  // POST /admin/chat
  createChat: (data: CreateChatRequest) => {
    return apiClient.post(CHAT_API, data);
  },

  // PUT /admin/chat/{chatId}
  updateChat: (chatId: string, data: UpdateChatRequest) => {
    return apiClient.put(`${CHAT_API}/${chatId}`, data);
  },

  // DELETE /admin/chat/{chatId}
  deleteChat: (chatId: string) => {
    return apiClient.delete(`${CHAT_API}/${chatId}`);
  },

  // PATCH /admin/chat/{chatId}/status
  updateStatus: (chatId: string, status: boolean) => {
    return apiClient.patch(`${CHAT_API}/${chatId}/status`, status);
  },
};