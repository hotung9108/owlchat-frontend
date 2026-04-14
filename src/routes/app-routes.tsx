import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import ConversationPage from "@/features/user/conversation/conversation-page";
import ConversationDetailPage from "@/features/user/conversation/conversation-detail-page";
import FriendPage from "@/features/user/friend/friend-page";
import GroupPage from "@/features/user/coming-soon/group-page";
import MarketplacePage from "@/features/user/coming-soon/marketplace-page";
import FindsPage from "@/features/user/coming-soon/finds-page";
import AdminPage from "@/features/admin/pages/admin-page";
import AdminContentFallback from "@/features/admin/content/admin-content-fallback";
import ThemeSettingsPage from "@/features/user/settings/theme-page";
import NotificationPage from "@/features/user/notification/notification-page";

import ProfileLayout from "@/features/user/profile/profile-layout";
import ProfilePage from "@/features/user/profile/profile-page";
import ProfileDetailPage from "@/features/user/profile/profile-detail-page";
import AdminContentChats from "@/features/admin/content/chat/admin-content-chats";
import AdminContentUser from "@/features/admin/content/user/admin-content-user";
import AdminContentUsers from "@/features/admin/content/user/admin-content-users";
import AdminChatDetails from "@/features/admin/content/chat/admin-content-chat";
import AdminContentMessage from "@/features/admin/content/chat/admin-content-message";
import { ProtectedRoute } from "@/components/protected-route";
import PinCodePage from "@/features/auth/pages/account-authenticate-page";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/conversations" element={<ConversationPage />} />
            <Route
                path="/conversations/:conversationId"
                element={<ConversationDetailPage />}
            />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/theme-settings" element={<ThemeSettingsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/finds" element={<FindsPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/authenticate" element={<PinCodePage />} />
{/* <!--             <Route path="/profile" element={<UserProfilePage />} /> --> */}
            
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminContentFallback></AdminContentFallback>} /></ProtectedRoute>}/>
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminContentUsers></AdminContentUsers>}></AdminPage></ProtectedRoute>}/>
            <Route path="/admin/user/:id" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminContentUser></AdminContentUser>}></AdminPage></ProtectedRoute>}/>
            <Route path="/admin/chats" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminContentChats></AdminContentChats>}></AdminPage></ProtectedRoute>}/>
            <Route path="/admin/chat/:id" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminChatDetails></AdminChatDetails>}></AdminPage></ProtectedRoute>}/>
            <Route path="/admin/message/:id" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage children={<AdminContentMessage></AdminContentMessage>}></AdminPage></ProtectedRoute>}/>
            
            <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path=":userId" element={<ProfileDetailPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
