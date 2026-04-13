import { useState, useCallback } from "react";
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
        try {
            const data = await userProfileService.getProfileById(id);
            // Don't modify profile state - just return the fetched data
            // profile state should only be modified by fetchUserProfile (current user)
            return data; 
        } catch (err: any) {
            console.error("Failed to fetch profile:", err.message);
            return null;
        }
    }, []);

    const fetchUserProfile = useCallback(async (accountId: string | null = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userProfileService.getUserProfile(accountId);
            setProfile(data);
            return data;
        } catch (err: any) {
            setError(err.message || "Failed to fetch user profile");
        } finally {
            setLoading(false);
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
        } catch (err: any) {
            setError(err.message || "Failed to delete profile");
        } finally {
            setLoading(false);
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
    };
};
