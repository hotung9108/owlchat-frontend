import { useState } from "react";
import { reportMessage } from "@/services/report-service";
import type { MessageReportRequest } from "@/types/chat.type";

export function useReportMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReport = async (
    messageId: string,
    data: MessageReportRequest,
    options?: {
      onSuccess?: (data: string) => void;
      onError?: (err: unknown) => void;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await reportMessage(messageId, data);

      options?.onSuccess?.(res);

      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Report failed";

      setError(message);
      options?.onError?.(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendReport,
    loading,
    error,
  };
}