import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const MEMBER_BASE_URL = `${API_ENDPOINTS.CHAT_SERVICE}/admin/member`;

/* ---------------- TYPES ---------------- */

export interface CreateMemberRequest {
  memberId: string;
  chatId: string;
  role: string;
  nickname?: string;
  inviterId?: string;
}

export interface UpdateMemberRequest {
  memberId: string;
  chatId: string;
  role: string;
  nickname?: string;
  inviterId?: string;
}

export interface UpdateRoleRequest {
  role: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

/* ---------------- SERVICE ---------------- */

export const memberAdminService = {
  // GET /admin/member
  getAll: () => {
    return apiClient.get(MEMBER_BASE_URL);
  },

  // POST /admin/member
  create: (data: CreateMemberRequest) => {
    return apiClient.post(MEMBER_BASE_URL, data);
  },

  // GET /admin/member/{memberId}/chat/{chatId}
  getById: (memberId: string, chatId: string) => {
    return apiClient.get(
      `${MEMBER_BASE_URL}/${memberId}/chat/${chatId}`
    );
  },

  // PUT /admin/member/{memberId}/chat/{chatId}
  update: (
    memberId: string,
    chatId: string,
    data: UpdateMemberRequest
  ) => {
    return apiClient.put(
      `${MEMBER_BASE_URL}/${memberId}/chat/${chatId}`,
      data
    );
  },

  // DELETE /admin/member/{memberId}/chat/{chatId}
  delete: (memberId: string, chatId: string) => {
    return apiClient.delete(
      `${MEMBER_BASE_URL}/${memberId}/chat/${chatId}`
    );
  },

  // PATCH role
  updateRole: (
    memberId: string,
    chatId: string,
    role: string
  ) => {
    return apiClient.patch(
      `${MEMBER_BASE_URL}/${memberId}/chat/${chatId}/role`,
      { role }
    );
  },

  // PATCH nickname
  updateNickname: (
    memberId: string,
    chatId: string,
    nickname: string
  ) => {
    return apiClient.patch(
      `${MEMBER_BASE_URL}/${memberId}/chat/${chatId}/nickname`,
      { nickname }
    );
  },

  // GET /admin/member/{memberId}
  getChatsByMember: (memberId: string) => {
    return apiClient.get(`${MEMBER_BASE_URL}/${memberId}`);
  },

  // GET /admin/member/chat/{chatId}
  getMembersByChat: (chatId: string) => {
    return apiClient.get(`${MEMBER_BASE_URL}/chat/${chatId}`);
  },
};