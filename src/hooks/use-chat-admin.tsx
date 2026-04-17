import { useState } from "react";
import {
  chatAdminService,
  type ChatQueryParams,
  type CreateChatRequest,
  type UpdateChatRequest,
} from "../services/chat-admin-service";

/* ---------------- HOOK ---------------- */

export function useChatAdminService() {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [chatDetail, setChatDetail] = useState<any>(null);

  /* -------- FETCH LIST -------- */
  const fetchChats = async (params?: ChatQueryParams) => {
    try {
      setLoading(true);
      const res = await chatAdminService.getChats(params);
      setChats(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH LIST -------- */
  const fetchChatsByMemberId = async (memberId: string, params?: ChatQueryParams) => {
    try {
      setLoading(true);
      const res = await chatAdminService.getChatsByMemberId(memberId, params);
      setChats(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH DETAIL -------- */
  const fetchChatById = async (chatId: string) => {
    try {
      setLoading(true);
      const res = await chatAdminService.getChatById(chatId);
      setChatDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const createChat = async (data: CreateChatRequest) => {
    return chatAdminService.createChat(data);
  };

  /* -------- UPDATE -------- */
  const updateChat = async (chatId: string, data: UpdateChatRequest) => {
    return chatAdminService.updateChat(chatId, data);
  };

  /* -------- DELETE -------- */
  const deleteChat = async (chatId: string) => {
    return chatAdminService.deleteChat(chatId);
  };

  /* -------- UPDATE STATUS -------- */
  const updateStatus = async (chatId: string, status: boolean) => {
    return chatAdminService.updateStatus(chatId, status);
  };

  return {
    loading,
    chats,
    chatDetail,

    fetchChats,
    fetchChatsByMemberId,
    fetchChatById,
    createChat,
    updateChat,
    deleteChat,
    updateStatus,
  };
}