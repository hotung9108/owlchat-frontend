import { useState } from "react";
import {
  blockAdminService as blockService,
  type BlockQueryParams,
  type CreateBlockRequest,
} from "../services/block-admin-service";

/* ---------------- HOOK ---------------- */

export function useBlockService() {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockDetail, setBlockDetail] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchAll = async (params?: BlockQueryParams) => {
    try {
      setLoading(true);
      const res = await blockService.getAll(params);
      setBlocks(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchById = async (id: string) => {
    try {
      setLoading(true);
      const res = await blockService.getById(id);
      setBlockDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const create = async (data: CreateBlockRequest) => {
    return blockService.create(data);
  };

  /* -------- DELETE -------- */
  const remove = async (id: string) => {
    return blockService.delete(id);
  };

  /* -------- GET BLOCKERS -------- */
  const fetchBlockersOfUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await blockService.getBlockersOfUser(userId);
      setBlocks(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- GET BLOCKED -------- */
  const fetchBlockedByUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await blockService.getBlockedByUser(userId);
      setBlocks(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CHECK BLOCK -------- */
  const checkBlock = async (blockerId: string, blockedId: string) => {
    return blockService.checkBlock(blockerId, blockedId);
  };

  return {
    loading,
    blocks,
    blockDetail,

    fetchAll,
    fetchById,
    create,
    remove,

    fetchBlockersOfUser,
    fetchBlockedByUser,
    checkBlock,
  };
}