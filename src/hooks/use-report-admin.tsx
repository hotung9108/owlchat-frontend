import { useEffect, useState } from "react";
import {
  getReports,
  getReportById,
  createReport,
  deleteReport,
  patchReportContent,
} from "@/services/report-admin-service";

import type {
  GetReportsParams,
  MessageReportAdminRequest,
  MessageReportRequest,
  ReportListResponse,
  ReportResponse,
} from "@/types/chat-report.type";

export function useReportAdmin() {
  // =========================
  // LIST STATE
  // =========================
  const [list, setList] = useState<ReportListResponse | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // =========================
  // DETAIL STATE
  // =========================
  const [detail, setDetail] = useState<ReportResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // =========================
  // MUTATION STATE
  // =========================
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // =========================
  // FETCH LIST
  // =========================
  const fetchReports = async (params?: GetReportsParams) => {
    try {
      setListLoading(true);
      setListError(null);

      const res = await getReports(params);
      setList(res);

      return res;
    } catch (err: any) {
      setListError(err?.message || "Failed to fetch reports");
      throw err;
    } finally {
      setListLoading(false);
    }
  };

  // =========================
  // FETCH DETAIL
  // =========================
  const fetchReportById = async (id: string) => {
    try {
      setDetailLoading(true);

      const res = await getReportById(id);
      setDetail(res);

      return res;
    } finally {
      setDetailLoading(false);
    }
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data: MessageReportAdminRequest) => {
    try {
      setActionLoading(true);
      setActionError(null);

      return await createReport(data);
    } catch (err: any) {
      setActionError(err?.message || "Create failed");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true);
      setActionError(null);

      return await deleteReport(id);
    } catch (err: any) {
      setActionError(err?.message || "Delete failed");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // PATCH
  // =========================
  const handlePatch = async (
    id: string,
    data: MessageReportRequest
  ) => {
    try {
      setActionLoading(true);
      setActionError(null);

      return await patchReportContent(id, data);
    } catch (err: any) {
      setActionError(err?.message || "Update failed");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    // list
    list,
    listLoading,
    listError,
    fetchReports,

    // detail
    detail,
    detailLoading,
    fetchReportById,

    // actions
    handleCreate,
    handleDelete,
    handlePatch,
    actionLoading,
    actionError,
  };
}