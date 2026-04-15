import { useState, useCallback, useRef } from "react";
import { userProfileService } from "@/services/user-profile-service";
import type {
    UserProfile,
    UserProfileCreateRequest,
    UserProfileRequest,
} from "@/types/user-profile.type";

export const useUserProfile = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Cache and deduplication for profile fetching
    const profileCacheRef = useRef<Map<string, UserProfile>>(new Map());
    const inFlightRequestsRef = useRef<Map<string, Promise<UserProfile | null>>>(new Map());
    const currentUserProfileRef = useRef<UserProfile | null>(null);
    const currentUserProfileRequestRef = useRef<Promise<UserProfile | null> | null>(null);

    const fetchProfiles = useCallback(
        async (
            keywords: string = "",
            page: number = 0,
            size: number = 10,
            gender: number = 0,
            dateOfBirthStart?: string,
            dateOfBirthEnd?: string,
            ascSort: boolean = true,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const response = await userProfileService.getProfiles(
                    keywords,
                    page,
                    size,
                    gender,
                    dateOfBirthStart,
                    dateOfBirthEnd,
                    ascSort,
                );
                setProfiles(response.content);
                setCurrentPage(response.currentPage);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                setPageSize(response.pageSize);
            } catch (err: any) {
                setError(err.message || "Failed to fetch profiles");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const fetchAllProfiles = useCallback(
        async (
            keywords: string = "",
            gender: number = 0,
            dateOfBirthStart?: string,
            dateOfBirthEnd?: string,
            ascSort: boolean = true,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const allProfiles = await userProfileService.getAllProfiles(
                    keywords,
                    gender,
                    dateOfBirthStart,
                    dateOfBirthEnd,
                    ascSort,
                );
                setProfiles(allProfiles);
                setCurrentPage(0);
                setTotalElements(allProfiles.length);
                setTotalPages(1); // Will be calculated in component based on page size
                setPageSize(12); // Default page size for discovery
            } catch (err: any) {
                setError(err.message || "Failed to fetch all profiles");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const fetchProfileById = useCallback(async (id: string) => {
        // Return from cache if available
        if (profileCacheRef.current.has(id)) {
            return profileCacheRef.current.get(id)!;
        }

        // Return existing in-flight request to avoid duplicate API calls
        if (inFlightRequestsRef.current.has(id)) {
            return inFlightRequestsRef.current.get(id)!;
        }

        // Create new request and cache it
        const newRequest = userProfileService
            .getProfileById(id)
            .then((data) => {
                profileCacheRef.current.set(id, data);
                inFlightRequestsRef.current.delete(id);
                return data;
            })
            .catch((err: any) => {
                inFlightRequestsRef.current.delete(id);
                console.error("Failed to fetch profile:", err.message);
                return null;
            });

        inFlightRequestsRef.current.set(id, newRequest);
        return newRequest;
    }, []);

    const fetchUserProfile = useCallback(async (accountId: string | null = null) => {
        // Return cached profile if available (accountId = null means current user)
        if (accountId === null && currentUserProfileRef.current) {
            setProfile(currentUserProfileRef.current);
            return currentUserProfileRef.current;
        }

        // Return existing in-flight request to avoid duplicate API calls
        if (accountId === null && currentUserProfileRequestRef.current) {
            return currentUserProfileRequestRef.current;
        }

        // Only set loading for first request
        if (!currentUserProfileRequestRef.current) {
            setLoading(true);
        }
        setError(null);
        
        try {
            const request = userProfileService.getUserProfile(accountId)
                .then((data) => {
                    if (accountId === null) {
                        currentUserProfileRef.current = data;
                    }
                    setProfile(data);
                    if (accountId === null) {
                        currentUserProfileRequestRef.current = null;
                    }
                    return data;
                })
                .catch((err: any) => {
                    setError(err.message || "Failed to fetch user profile");
                    if (accountId === null) {
                        currentUserProfileRequestRef.current = null;
                    }
                    throw err;
                })
                .finally(() => {
                    setLoading(false);
                });

            if (accountId === null) {
                currentUserProfileRequestRef.current = request;
            }
            return request;
        } catch (err: any) {
            setLoading(false);
            throw err;
        }
    }, []);

    const createProfile = useCallback(
        async (userProfileCreateRequest: UserProfileCreateRequest) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileService.addNewProfile(
                    userProfileCreateRequest,
                );
                setProfile(data);
            } catch (err: any) {
                setError(err.message || "Failed to create profile");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const updateProfile = useCallback(
        async (id: string, userProfileRequest: UserProfileRequest) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileService.updateProfile(
                    id,
                    userProfileRequest,
                );
                setProfile(data);
                // Invalidate cache for this profile
                profileCacheRef.current.delete(id);
                return data;
            } catch (err: any) {
                setError(err.message || "Failed to update profile");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const deleteProfile = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await userProfileService.deleteProfile(id);
            setProfile(null);
            // Invalidate cache for this profile
            profileCacheRef.current.delete(id);
        } catch (err: any) {
            setError(err.message || "Failed to delete profile");
        } finally {
            setLoading(false);
        }
    }, []);

    // Cache management utilities
    const clearProfileCache = useCallback((id?: string) => {
        if (id) {
            profileCacheRef.current.delete(id);
        } else {
            profileCacheRef.current.clear();
            // Also clear current user profile cache
            currentUserProfileRef.current = null;
            currentUserProfileRequestRef.current = null;
        }
    }, []);

    const uploadAvatar = useCallback(async (id: string, avatarFile: File) => {
        setLoading(true);
        setError(null);
        try {
            const avatarUrl = await userProfileService.uploadUserAvatar(
                id,
                avatarFile,
            );
            return avatarUrl;
        } catch (err: any) {
            setError(err.message || "Failed to upload avatar");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAvatar = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const avatarBlob = await userProfileService.getUserAvatar(id);
            return avatarBlob;
        } catch (err: any) {
            setError(err.message || "Failed to fetch avatar");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        profiles,
        profile,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        fetchProfiles,
        fetchAllProfiles,
        fetchProfileById,
        fetchUserProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        uploadAvatar,
        fetchAvatar,
        clearProfileCache,
    };
};
