import { useState } from "react";
import {
  messageAdminService as messageService,
  type MessageQueryParams,
  type CreateMessageRequest,
  type EditMessageRequest,
} from "../services/message-admin-service";

export function useMessageService() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageDetail, setMessageDetail] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchAll = async (params?: MessageQueryParams) => {
    try {
      setLoading(true);
      const res = await messageService.getAll(params);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchById = async (messageId: string) => {
    try {
      setLoading(true);
      const res = await messageService.getById(messageId);
      setMessageDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- SEND -------- */
  const send = async (data: CreateMessageRequest) => {
    return messageService.send(data);
  };

  /* -------- EDIT -------- */
  const edit = async (messageId: string, data: EditMessageRequest) => {
    return messageService.edit(messageId, data);
  };

  /* -------- DELETE -------- */
  const deleteHard = async (messageId: string) => {
    return messageService.deleteHard(messageId);
  };

  const deleteSoft = async (messageId: string) => {
    return messageService.deleteSoft(messageId);
  };

  const activate = async (messageId: string) => {
    try {
      setLoading(true);
      const res = await messageService.activate(messageId)
      setMessageDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FILTER -------- */
  const fetchByChat = async (
    chatId: string,
    params?: MessageQueryParams
  ) => {
    try {
      setLoading(true);
      const res = await messageService.getByChat(chatId, params);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySender = async (
    senderId: string,
    params?: MessageQueryParams
  ) => {
    try {
      setLoading(true);
      const res = await messageService.getBySender(senderId, params);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FILE -------- */
  const uploadFile = async (
    file: File,
    senderId: string,
    chatId: string,
    type: string
  ) => {
    return messageService.uploadFile(file, senderId, chatId, type);
  };

  const getResource = async (messageId: string) => {
    return messageService.getResource(messageId);
  };

  return {
    loading,
    messages,
    messageDetail,

    fetchAll,
    fetchById,
    send,
    edit,

    deleteHard,
    deleteSoft,
    activate,

    fetchByChat,
    fetchBySender,

    uploadFile,
    getResource,
  };
}