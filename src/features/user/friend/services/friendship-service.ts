import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const FRIENDSHIP_API = `${API_ENDPOINTS.SOCIAL_SERVICE}/friendship`;

export const friendshipService = {
  async getFriendships(
    requesterId: string | null,
    page: number = 0,
    size: number = 10,
    ascSort: boolean = true,
    createdDateStart?: string,
    createdDateEnd?: string
  ) {
    try {
      const params: Record<string, any> = {
        page,
        size,
        ascSort,
        createdDateStart,
        createdDateEnd,
      };

      const response = await apiClient.get(FRIENDSHIP_API, {
        headers: {
          "X-Account-Id": requesterId || "",
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching friendships");
    }
  },

  async getFriendshipById(requesterId: string | null, id: string) {
    try {
      const response = await apiClient.get(`${FRIENDSHIP_API}/${id}`, {
        headers: {
          "X-Account-Id": requesterId || "",
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching friendship by ID");
    }
  },

  async getFriendshipWithUser(requesterId: string | null, userId: string) {
    try {
      const response = await apiClient.get(`${FRIENDSHIP_API}/user/${userId}`, {
        headers: {
          "X-Account-Id": requesterId || "",
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching friendship with user");
    }
  },

  async deleteFriendship(requesterId: string | null, id: string) {
    try {
      const response = await apiClient.delete(`${FRIENDSHIP_API}/${id}`, {
        headers: {
          "X-Account-Id": requesterId || "",
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error deleting friendship");
    }
  },
};

export default friendshipService;