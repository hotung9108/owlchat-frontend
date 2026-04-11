import { useState } from "react";
import {
  friendRequestAdminService as friendRequestService,
  type CreateFriendRequest,
  type FriendRequestQueryParams,
  type FriendRequestResponseType,
} from "../services/friend-request-admin-service";

export function useFriendRequestService() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [requestDetail, setRequestDetail] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchAll = async (params?: FriendRequestQueryParams) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getAll(params);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchById = async (id: string) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getById(id);
      setRequestDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const create = async (data: CreateFriendRequest) => {
    return friendRequestService.create(data);
  };

  /* -------- DELETE -------- */
  const remove = async (id: string) => {
    return friendRequestService.delete(id);
  };

  /* -------- RESPOND -------- */
  const respond = async (
    id: string,
    response: FriendRequestResponseType
  ) => {
    return friendRequestService.respond(id, response);
  };

  /* -------- FILTER METHODS -------- */

  const fetchByUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getByUser(userId);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySender = async (senderId: string) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getBySender(senderId);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchByReceiver = async (receiverId: string) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getByReceiver(receiverId);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchBetweenUsers = async (
    firstUserId: string,
    secondUserId: string
  ) => {
    try {
      setLoading(true);
      const res = await friendRequestService.getBetweenUsers(
        firstUserId,
        secondUserId
      );
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    requests,
    requestDetail,

    fetchAll,
    fetchById,
    create,
    remove,
    respond,

    fetchByUser,
    fetchBySender,
    fetchByReceiver,
    fetchBetweenUsers,
  };
}