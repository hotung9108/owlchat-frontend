import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type {
  GetReportsParams,
  MessageReportAdminRequest,
  MessageReportRequest,
  ReportResponse,
  ReportListResponse,
} from "@/types/chat-report.type";

const REPORT_BASE_URL = `${API_ENDPOINTS.CHAT_SERVICE}/admin/report`;

// ===== GET list =====
export async function getReports(
  params?: GetReportsParams
): Promise<ReportListResponse> {
  const response = await apiClient.get<ReportListResponse>(
    REPORT_BASE_URL,
    { params }
  );
  return response.data;
}

// ===== GET by id =====
export async function getReportById(id: string): Promise<ReportResponse> {
  const response = await apiClient.get<ReportResponse>(
    `${REPORT_BASE_URL}/${id}`
  );
  return response.data;
}

// ===== CREATE =====
export async function createReport(
  data: MessageReportAdminRequest
): Promise<ReportResponse> {
  const response = await apiClient.post<ReportResponse>(
    REPORT_BASE_URL,
    data
  );
  return response.data;
}

// ===== DELETE =====
export async function deleteReport(id: string): Promise<ReportResponse> {
  const response = await apiClient.delete<ReportResponse>(
    `${REPORT_BASE_URL}/${id}`
  );
  return response.data;
}

// ===== PATCH content =====
export async function patchReportContent(
  id: string,
  data: MessageReportRequest
): Promise<ReportResponse> {
  const response = await apiClient.patch<ReportResponse>(
    `${REPORT_BASE_URL}/${id}`,
    data
  );
  return response.data;
}