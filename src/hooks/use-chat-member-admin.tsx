import { useState } from "react";
import {
  memberAdminService as memberService,
  type CreateMemberRequest,
  type UpdateMemberRequest,
} from "../services/chat-member-admin-service";

export function useMemberAdminService() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [memberDetail, setMemberDetail] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await memberService.getAll();
      setMembers(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchById = async (memberId: string, chatId: string) => {
    try {
      setLoading(true);
      const res = await memberService.getById(memberId, chatId);
      setMemberDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const create = async (data: CreateMemberRequest) => {
    return memberService.create(data);
  };

  /* -------- UPDATE -------- */
  const update = async (
    memberId: string,
    chatId: string,
    data: UpdateMemberRequest
  ) => {
    return memberService.update(memberId, chatId, data);
  };

  /* -------- DELETE -------- */
  const remove = async (memberId: string, chatId: string) => {
    return memberService.delete(memberId, chatId);
  };

  /* -------- PATCH ROLE -------- */
  const updateRole = async (
    memberId: string,
    chatId: string,
    role: string
  ) => {
    return memberService.updateRole(memberId, chatId, role);
  };

  /* -------- PATCH NICKNAME -------- */
  const updateNickname = async (
    memberId: string,
    chatId: string,
    nickname: string
  ) => {
    return memberService.updateNickname(memberId, chatId, nickname);
  };

  /* -------- FETCH BY MEMBER -------- */
  const fetchChatsByMember = async (memberId: string) => {
    try {
      setLoading(true);
      const res = await memberService.getChatsByMember(memberId);
      setMembers(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY CHAT -------- */
  const fetchMembersByChat = async (chatId: string) => {
    try {
      setLoading(true);
      const res = await memberService.getMembersByChat(chatId);
      setMembers(res.data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    members,
    memberDetail,

    fetchAll,
    fetchById,
    create,
    update,
    remove,

    updateRole,
    updateNickname,

    fetchChatsByMember,
    fetchMembersByChat,
  };
}