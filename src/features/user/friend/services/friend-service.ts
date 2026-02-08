import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type { FriendRequest, FriendRequestCreateUserRequest, FriendRequestResponseRequest } from "../types/friend.type";

const FRIEND_REQUEST_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/friend-request`;

export const friendUserService = {
  async getFriendRequests(
    requesterId: string,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string
  ): Promise<FriendRequest[]> {
    const params = {
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    };
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}`, {
      headers: { requesterId },
      params,
    });
    return response.data;
  },

  async getFriendRequestById(requesterId: string, id: string): Promise<FriendRequest> {
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/${id}`, {
      headers: { requesterId },
    });
    return response.data;
  },

  async getSendFriendRequests(
    requesterId: string,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string
  ): Promise<FriendRequest[]> {
    const params = {
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    };
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/send`, {
      headers: { requesterId },
      params,
    });
    return response.data;
  },

  async getReceiveFriendRequests(
    requesterId: string,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string
  ): Promise<FriendRequest[]> {
    const params = {
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    };
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/receive`, {
      headers: { requesterId },
      params,
    });
    return response.data;
  },

  async getFriendRequestsWithUser(
    requesterId: string,
    userId: string,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string
  ): Promise<FriendRequest[]> {
    const params = {
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    };
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/user/${userId}`, {
      headers: { requesterId },
      params,
    });
    return response.data;
  },

  async getFriendRequestFromRequesterToUser(requesterId: string, receiverId: string): Promise<FriendRequest> {
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/receiver/${receiverId}`, {
      headers: { requesterId },
    });
    return response.data;
  },

  async getFriendRequestFromUserToRequester(requesterId: string, senderId: string): Promise<FriendRequest> {
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/sender/${senderId}`, {
      headers: { requesterId },
    });
    return response.data;
  },

  async postFriendRequest(requesterId: string, request: FriendRequestCreateUserRequest): Promise<FriendRequest> {
    const response = await apiClient.post(`${FRIEND_REQUEST_BASE_URL}`, request, {
      headers: { requesterId },
    });
    return response.data;
  },

  async patchFriendRequestStatus(requesterId: string, id: string, request: FriendRequestResponseRequest): Promise<FriendRequest> {
    const response = await apiClient.patch(`${FRIEND_REQUEST_BASE_URL}/${id}/response`, request, {
      headers: { requesterId },
    });
    return response.data;
  },
  async deleteFriendRequest(requesterId: string, id: string): Promise<void> {
    await apiClient.delete(`${FRIEND_REQUEST_BASE_URL}/${id}`, {
      headers: { requesterId },
    });
  },
};