import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type { TextMessageUserRequest } from "@/types/message.type";
import type { MessagesStatsResponse, MessagesTotalResponse } from "@/types/admin-stats.type";

const MESSAGE_BASE_URL = `${API_ENDPOINTS.CHAT_SERVICE}/admin/message`;

/* ---------------- TYPES ---------------- */

export interface MessageQueryParams {
  keywords?: string;
  page?: number;
  size?: number;
  ascSort?: boolean;
  status?: boolean;
  state?: string;
  type?: string;
  sentDateStart?: string;
  sentDateEnd?: string;
  removedDateStart?: string;
  removedDateEnd?: string;
  createdDateStart?: string;
  createdDateEnd?: string;
}

export interface CreateMessageRequest {
  chatId: string;
  content: string;
  senderId: string;
}

export interface EditMessageRequest {
  content: string;
}

/* ---------------- SERVICE ---------------- */

export const messageAdminService = {
    getStats: (from?: string, to?: string) =>
    apiClient.get<MessagesStatsResponse>(`${MESSAGE_BASE_URL}/stats`, {
      params: { from, to },
    }),

  getTotal: () =>
    apiClient.get<MessagesTotalResponse>(`${MESSAGE_BASE_URL}/stats/total`),

  // GET /admin/message
  getAll: (params?: MessageQueryParams) => {
    return apiClient.get(MESSAGE_BASE_URL, { params });
  },

  // POST /admin/message
  send: (data: CreateMessageRequest) => {
    return apiClient.post(MESSAGE_BASE_URL, data);
  },

  // POST /admin/message/system
  systemSend: (data: TextMessageUserRequest) => {
    return apiClient.post(`${MESSAGE_BASE_URL}/system`, data);
  },

  // GET /admin/message/{messageId}
  getById: (messageId: string) => {
    return apiClient.get(`${MESSAGE_BASE_URL}/${messageId}`);
  },

  // PUT /admin/message/{messageId}/edit
  edit: (messageId: string, data: EditMessageRequest) => {
    return apiClient.put(
      `${MESSAGE_BASE_URL}/${messageId}/edit`,
      data
    );
  },

  // DELETE hard
  deleteHard: (messageId: string) => {
    return apiClient.delete(`${MESSAGE_BASE_URL}/${messageId}`);
  },

  // DELETE soft
  deleteSoft: (messageId: string) => {
    return apiClient.delete(`${MESSAGE_BASE_URL}/${messageId}/remove`);
  },

  // PATCH activate
  activate: (messageId: string) => {
    return apiClient.patch(`${MESSAGE_BASE_URL}/${messageId}/activate`);
  },

  // GET by chat
  getByChat: (chatId: string, params?: MessageQueryParams) => {
    return apiClient.get(`${MESSAGE_BASE_URL}/chat/${chatId}`, {
      params,
    });
  },

  // GET by sender
  getBySender: (senderId: string, params?: MessageQueryParams) => {
    return apiClient.get(`${MESSAGE_BASE_URL}/sender/${senderId}`, {
      params,
    });
  },

  // POST upload file
  uploadFile: (
    file: File,
    senderId: string,
    chatId: string,
    type: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post(
      `${MESSAGE_BASE_URL}/resource/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          senderId,
          chatId,
          type,
        },
      }
    );
  },

  // GET file resource
  getResource: (messageId: string) => {
    return apiClient.get(
      `${MESSAGE_BASE_URL}/${messageId}/resource`,
      {
        responseType: "blob", // important for file
      }
    );
  },
};