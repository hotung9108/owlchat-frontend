import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import ConversationPage from "@/features/user/conversation/conversation-page";
import ConversationDetailPage from "@/features/user/conversation/conversation-detail-page";
import FriendPage from "@/features/user/friend/friend-page";
import ProfileLayout from "@/features/user/profile/profile-layout";
import ProfilePage from "@/features/user/profile/profile-page";
import ProfileDetailPage from "@/features/user/profile/profile-detail-page";
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
            <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path=":userId" element={<ProfileDetailPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
