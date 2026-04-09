import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import ConversationPage from "@/features/user/conversation/conversation-page";
import ConversationDetailPage from "@/features/user/conversation/conversation-detail-page";
import FriendPage from "@/features/user/friend/friend-page";
import AdminPage from "@/features/admin/pages/admin-page";
import AdminContentFallback from "@/features/admin/content/admin-content-fallback";
import ProfileLayout from "@/features/user/profile/profile-layout";
import ProfilePage from "@/features/user/profile/profile-page";
import ProfileDetailPage from "@/features/user/profile/profile-detail-page";
import AdminContentChats from "@/features/admin/content/chat/admin-content-chats";
import AdminContentUser from "@/features/admin/content/user/admin-content-user";
import AdminContentUsers from "@/features/admin/content/user/admin-content-users";
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
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage children={<AdminContentFallback></AdminContentFallback>} />}/>
                <Route path="/admin/users" element={<AdminPage children={<AdminContentUsers></AdminContentUsers>}></AdminPage>}/>
                <Route path="/admin/user/:id" element={<AdminPage children={<AdminContentUser></AdminContentUser>}></AdminPage>}/>
                <Route path="/admin/chats" element={<AdminPage children={<AdminContentChats></AdminContentChats>}></AdminPage>}/>
                <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path=":userId" element={<ProfileDetailPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
