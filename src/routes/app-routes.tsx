import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import UserProfilePage from "@/features/user-profile/pages/user-profile-page";
import ConversationPage from "@/features/user/conversation/conversation-page";
import ConversationDetailPage from "@/features/user/conversation/conversation-detail-page";
import FriendPage from "@/features/user/friend/friend-page";
import AdminPage from "@/features/admin/pages/admin-page";
import AdminContentFallback from "@/features/admin/content/admin-content-fallback";
import AdminContentChats from "@/features/admin/content/admin-content-chats";
import AdminContentUsers from "@/features/admin/content/admin-content-users";
import AdminContentUser from "@/features/admin/content/admin-content-user";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/conversations" element={<ConversationPage />} />
            <Route
                path="/conversations/:conversationId"
                element={<ConversationDetailPage />}
            />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            
            <Route path="/admin" element={<AdminPage children={<AdminContentFallback></AdminContentFallback>} />}/>
            <Route path="/admin/users" element={<AdminPage children={<AdminContentUsers></AdminContentUsers>}></AdminPage>}/>
            <Route path="/admin/user/:id" element={<AdminPage children={<AdminContentUser></AdminContentUser>}></AdminPage>}/>
            <Route path="/admin/chats" element={<AdminPage children={<AdminContentChats></AdminContentChats>}></AdminPage>}/>
        </Routes>
    );
};

export default AppRoutes;
