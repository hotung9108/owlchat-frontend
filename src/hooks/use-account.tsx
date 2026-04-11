import { useState } from "react";
import {
  accountService,
  type AccountQueryParams,
  type CreateAccountRequest,
  type UpdateAccountRequest,
} from "../services/real-account-service";

/* ---------------- HOOK ---------------- */

export function useAccountService() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountDetail, setAccountDetail] = useState<any>(null);

  /* -------- FETCH LIST -------- */
  const fetchAccounts = async (params?: AccountQueryParams) => {
    try {
      setLoading(true);
      const res = await accountService.getAccounts(params);
      setAccounts(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH DETAIL -------- */
  const fetchAccountById = async (id: string) => {
    try {
      setLoading(true);
      const res = await accountService.getAccountById(id);
      setAccountDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const createAccount = async (data: CreateAccountRequest) => {
    return accountService.createAccount(data);
  };

  /* -------- UPDATE -------- */
  const updateAccount = async (id: string, data: UpdateAccountRequest) => {
    return accountService.updateAccount(id, data);
  };

  /* -------- DELETE -------- */
  const deleteAccount = async (id: string) => {
    return accountService.deleteAccount(id);
  };

  /* -------- STATUS -------- */
  const updateStatus = async (id: string, status: boolean) => {
    return accountService.updateStatus(id, status);
  };

  return {
    loading,
    accounts,
    accountDetail,

    fetchAccounts,
    fetchAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    updateStatus,
  };
}