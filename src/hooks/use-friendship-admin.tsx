import { useState } from "react";
import {
  friendshipAdminService as friendshipService,
  type CreateFriendshipRequest,
} from "../services/friendship-admin-service";

/* ---------------- HOOK ---------------- */

export function useFriendshipAdminService() {
  const [loading, setLoading] = useState(false);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [friendshipDetail, setFriendshipDetail] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await friendshipService.getAll();
      setFriendships(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchById = async (id: string) => {
    try {
      setLoading(true);
      const res = await friendshipService.getById(id);
      setFriendshipDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const create = async (data: CreateFriendshipRequest) => {
    return friendshipService.create(data);
  };

  /* -------- DELETE -------- */
  const remove = async (id: string) => {
    return friendshipService.delete(id);
  };

  /* -------- GET BY USER -------- */
  const fetchByUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await friendshipService.getByUser(userId);
      setFriendships(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CHECK -------- */
  const checkFriendship = async (
    firstUserId: string,
    secondUserId: string
  ) => {
    return friendshipService.checkFriendship(firstUserId, secondUserId);
  };

  return {
    loading,
    friendships,
    friendshipDetail,

    fetchAll,
    fetchById,
    create,
    remove,
    fetchByUser,
    checkFriendship,
  };
}