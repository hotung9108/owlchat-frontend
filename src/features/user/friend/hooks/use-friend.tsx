import { useCallback, useState } from "react";
import { friendUserService } from "../services/friend-service";
import type {
  FriendRequest,
  FriendRequestCreateUserRequest,
  FriendRequestResponseRequest,
} from "../types/friend.type";

type UseFriendState = {
  loading: boolean;
  error: string | null;
};

export const useFriend = () => {
  const [state, setState] = useState<UseFriendState>({
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }));
  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }));

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFriendRequests = useCallback(
    async (
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
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getFriendRequests(
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestById = useCallback(
    async (requesterId: string, id: string): Promise<FriendRequest> =>
      wrap(() => friendUserService.getFriendRequestById(requesterId, id)),
    [wrap]
  );

  const getSendFriendRequests = useCallback(
    async (
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
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getSendFriendRequests(
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getReceiveFriendRequests = useCallback(
    async (
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
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getReceiveFriendRequests(
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestsWithUser = useCallback(
    async (
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
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getFriendRequestsWithUser(
          requesterId,
          userId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestFromRequesterToUser = useCallback(
    async (requesterId: string, receiverId: string): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.getFriendRequestFromRequesterToUser(
          requesterId,
          receiverId
        )
      ),
    [wrap]
  );

  const getFriendRequestFromUserToRequester = useCallback(
    async (requesterId: string, senderId: string): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.getFriendRequestFromUserToRequester(
          requesterId,
          senderId
        )
      ),
    [wrap]
  );

  const postFriendRequest = useCallback(
    async (
      requesterId: string,
      request: FriendRequestCreateUserRequest
    ): Promise<FriendRequest> =>
      wrap(() => friendUserService.postFriendRequest(requesterId, request)),
    [wrap]
  );

  const patchFriendRequestStatus = useCallback(
    async (
      requesterId: string,
      id: string,
      request: FriendRequestResponseRequest
    ): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.patchFriendRequestStatus(requesterId, id, request)
      ),
    [wrap]
  );

  const deleteFriendRequest = useCallback(
    async (requesterId: string, id: string): Promise<void> =>
      wrap(() => friendUserService.deleteFriendRequest(requesterId, id)),
    [wrap]
  );

  return {
    loading: state.loading,
    error: state.error,
    getFriendRequests,
    getFriendRequestById,
    getSendFriendRequests,
    getReceiveFriendRequests,
    getFriendRequestsWithUser,
    getFriendRequestFromRequesterToUser,
    getFriendRequestFromUserToRequester,
    postFriendRequest,
    patchFriendRequestStatus,
    deleteFriendRequest,
  };
};