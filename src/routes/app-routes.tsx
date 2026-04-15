import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthLogoutListener } from "@/hooks/use-auth-logout-listener";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import ConversationPage from "@/features/user/conversation/conversation-page";
import ConversationDetailPage from "@/features/user/conversation/conversation-detail-page";
import FriendPage from "@/features/user/friend/friend-page";
import PinCodePage from "@/features/auth/pages/account-authenticate-page";
import AdminContentMessageReports from "@/features/admin/content/analysis/admin-content-message-reports";
import AdminDashboard from "@/features/admin/content/analysis/admin-content-dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";

// Lazy load heavy routes
const GroupPage = lazy(() => import("@/features/user/coming-soon/group-page"));
const MarketplacePage = lazy(() => import("@/features/user/coming-soon/marketplace-page"));
const FindsPage = lazy(() => import("@/features/user/coming-soon/finds-page"));
const AdminPage = lazy(() => import("@/features/admin/pages/admin-page"));
const AdminContentFallback = lazy(() => import("@/features/admin/content/admin-content-fallback"));
const ThemeSettingsPage = lazy(() => import("@/features/user/settings/theme-page"));
const NotificationPage = lazy(() => import("@/features/user/notification/notification-page"));
const ProfileLayout = lazy(() => import("@/features/user/profile/profile-layout"));
const ProfilePage = lazy(() => import("@/features/user/profile/profile-page"));
const ProfileDetailPage = lazy(() => import("@/features/user/profile/profile-detail-page"));
const AdminContentChats = lazy(() => import("@/features/admin/content/chat/admin-content-chats"));
const AdminContentUser = lazy(() => import("@/features/admin/content/user/admin-content-user"));
const AdminContentUsers = lazy(() => import("@/features/admin/content/user/admin-content-users"));
const AdminChatDetails = lazy(() => import("@/features/admin/content/chat/admin-content-chat"));
const AdminContentMessage = lazy(() => import("@/features/admin/content/chat/admin-content-message"));
const AdminContentMessageReports = lazy(() => import("@/features/admin/content/analysis/admin-content-message-reports"));

// Loading fallback component
const RouteLoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
        <Card className="p-8">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm">Loading...</p>
            </div>
        </Card>
    </div>
);

const AppRoutes = () => {
    // Listen for auth logout events from axios interceptor
    useAuthLogoutListener();
    
    return (
        <Routes>
            <Route path="/conversations" element={<ConversationPage />} />
            <Route
                path="/conversations/:conversationId"
                element={<ConversationDetailPage />}
            />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/theme-settings" element={<Suspense fallback={<RouteLoadingFallback />}><ThemeSettingsPage /></Suspense>} />
            <Route path="/notifications" element={<Suspense fallback={<RouteLoadingFallback />}><NotificationPage /></Suspense>} />
            <Route path="/groups" element={<Suspense fallback={<RouteLoadingFallback />}><GroupPage /></Suspense>} />
            <Route path="/marketplace" element={<Suspense fallback={<RouteLoadingFallback />}><MarketplacePage /></Suspense>} />
            <Route path="/finds" element={<Suspense fallback={<RouteLoadingFallback />}><FindsPage /></Suspense>} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/authenticate" element={<PinCodePage />} />
            
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentFallback></AdminContentFallback>} /></Suspense></ProtectedRoute>}/>
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentUsers></AdminContentUsers>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/user/:id" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentUser></AdminContentUser>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/chats" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentChats></AdminContentChats>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/chat/:id" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminChatDetails></AdminChatDetails>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/message/:id" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentMessage></AdminContentMessage>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/report/message" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminContentMessageReports></AdminContentMessageReports>}></AdminPage></Suspense></ProtectedRoute>}/>
            <Route path="/admin/stats" element={<ProtectedRoute requiredRole="ADMIN"><Suspense fallback={<RouteLoadingFallback />}><AdminPage children={<AdminDashboard></AdminDashboard>}></AdminPage></Suspense></ProtectedRoute>}/>
        
            <Route path="profile" element={<Suspense fallback={<RouteLoadingFallback />}><ProfileLayout /></Suspense>}>
                <Route index element={<Suspense fallback={<RouteLoadingFallback />}><ProfilePage /></Suspense>} />
                <Route path=":userId" element={<Suspense fallback={<RouteLoadingFallback />}><ProfileDetailPage /></Suspense>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
