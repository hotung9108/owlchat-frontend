import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ChevronLeft, ChevronRight } from "lucide-react";
import { useFriend } from "@/hooks/use-friend";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { UserProfile } from "@/types/user-profile.type";
import LoadingLogo from "@/components/shared/loading-logo";

const DiscoveryFriendCard = ({
    profile,
    onAddFriend,
}: {
    profile: UserProfile;
    onAddFriend: (id: string) => void;
}) => {
    const { fetchAvatar } = useUserProfile();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.avatar) {
            fetchAvatar(profile.id)
                .then((blob) => {
                    if (blob && blob.size > 0) {
                        setAvatarUrl(URL.createObjectURL(blob));
                    }
                })
                .catch((err) => console.error("Error fetching avatar:", err));
        }
    }, [profile?.avatar, profile.id, fetchAvatar]);

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
        };
    }, [avatarUrl]);

    return (
        <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted overflow-hidden">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-10 h-10" />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-primary">
                        {profile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {profile.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {profile.phoneNumber || "No phone number"}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        className="px-4 py-2"
                        onClick={() => onAddFriend(profile.id)}
                    >
                        Add Friend
                    </Button>
                    <Button className="px-4 py-2">Profile</Button>
                </div>
                <div>
                    <Button variant="ghost" className="">
                        ...
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const ITEMS_PER_PAGE = 12;

export default function FriendDiscoveryFriendPage() {
    const {
        profiles: allProfiles,
        fetchAllProfiles,
        loading: profilesLoading,
    } = useUserProfile();
    const { profile } = useUserProfileContext();
    const {
        postFriendRequest,
        loading: friendLoading,
    } = useFriend();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Load all profiles on mount
    useEffect(() => {
        fetchAllProfiles();
    }, [fetchAllProfiles]);
    
    // Filter profiles based on search term and exclude current user
    const filteredProfiles = useMemo(() => {
        return allProfiles.filter(
            (p) =>
                p.id !== profile?.id &&
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allProfiles, profile?.id, searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
    
    // Get current page items
    const currentPageProfiles = useMemo(() => {
        const startIndex = currentPageIndex * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredProfiles.slice(startIndex, endIndex);
    }, [filteredProfiles, currentPageIndex]);

    // Handle search
    const handleSearch = useCallback((keywords: string) => {
        setSearchTerm(keywords);
        setCurrentPageIndex(0); // Reset to first page
    }, []);

    // Handle pagination - next page
    const handleNextPage = useCallback(() => {
        if (currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    }, [currentPageIndex, totalPages]);

    // Handle pagination - previous page
    const handlePrevPage = useCallback(() => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    }, [currentPageIndex]);

    // Handle direct page click
    const handlePageClick = useCallback((pageNum: number) => {
        setCurrentPageIndex(pageNum);
    }, []);
    
    // Handle add friend
    const handleAddFriend = async (userId: string) => {
        try {
            await postFriendRequest(null, null, { receiverId: userId });
            setErrorMessage("Failed to send friend request.");
        } catch (error) {
            setErrorMessage("Failed to send friend request.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };
    
    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friends..."
                    className="w-full"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {profilesLoading || friendLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingLogo />
                </div>
            ) : currentPageProfiles.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">
                        {searchTerm ? "No users found matching your search" : "No users found"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {currentPageProfiles.map((p) => (
                            <DiscoveryFriendCard
                                key={p.id}
                                profile={p}
                                onAddFriend={handleAddFriend}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 py-4">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPageIndex + 1} of {totalPages} 
                                {filteredProfiles.length > 0 && ` • ${filteredProfiles.length} total users`}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevPage}
                                    disabled={currentPageIndex === 0}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    
                                </Button>

                                <div className="flex items-center gap-2 px-4">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = Math.max(0, currentPageIndex - 2) + i;
                                        if (pageNum >= totalPages) return null;
                                        
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === currentPageIndex ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageClick(pageNum)}
                                            >
                                                {pageNum + 1}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPageIndex >= totalPages - 1}
                                    className="gap-1"
                                >
                                    
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                            {errorMessage}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
