import { useCallback, useState } from "react";
import { messageAdminService } from "@/services/message-admin-service";
import { reportAdminService } from "@/services/report-admin-service";
import { friendshipAdminService } from "@/services/friendship-admin-service";
import { userProfileService } from "@/services/user-profile-service";

export function useAdminStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const wrap = async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Messages ──
  const getMessagesStats = useCallback(
    (from?: string, to?: string) =>
      wrap(() => messageAdminService.getStats(from, to)),
    []
  );

  const getMessagesTotal = useCallback(
    () => wrap(() => messageAdminService.getTotal()),
    []
  );

  // ── Reports ──
  const getReportsStats = useCallback(
    (from?: string, to?: string) =>
      wrap(() => reportAdminService.getStats(from, to)),
    []
  );

  const getReportsTotal = useCallback(
    () => wrap(() => reportAdminService.getTotal()),
    []
  );

  // ── Friendship ──
  const getSocialGrowth = useCallback(
    (from?: string, to?: string) =>
      wrap(() => friendshipAdminService.getGrowth(from, to)),
    []
  );

  // ── Users ──
  const getUsersStats = useCallback(
    (from?: string, to?: string) =>
      wrap(() => userProfileService.getStats(from, to)),
    []
  );

  const getUsersGrowth = useCallback(
    (from?: string, to?: string) =>
      wrap(() => userProfileService.getGrowth(from, to)),
    []
  );

  const getUsersGender = useCallback(
    () => wrap(() => userProfileService.getGender()),
    []
  );

  const getUsersTotal = useCallback(
    () => wrap(() => userProfileService.getTotal()),
    []
  );

  const getUsersGrowthToday = useCallback(
    () => wrap(() => userProfileService.getGrowthToday()),
    []
  );

  return {
    loading,
    error,

    // message
    getMessagesStats,
    getMessagesTotal,

    // report
    getReportsStats,
    getReportsTotal,

    // social
    getSocialGrowth,

    // user
    getUsersStats,
    getUsersGrowth,
    getUsersGender,
    getUsersTotal,
    getUsersGrowthToday,
  };
}