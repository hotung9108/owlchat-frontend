import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import LoginPage from "./features/auth/pages/login-page";
import RegisterPage from "./features/auth/pages/register-page";
import UserProfilePage from "./features/user-profile/pages/user-profile-page";
// import ChatPage from "./features/user/chat/pages/chat-page";
// import ConversationPage from "./features/user/conversation/Conversation-page";
import ConversationPage from "./features/user/conversation/conversation-page";
import ConversationDetailPage from "./features/user/conversation/conversation-detail-page";
import FriendPage from "./features/user/friend/friend-page";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/conversations" element={<ConversationPage/>} />
                <Route path="/conversations/:conversationId" element={<ConversationDetailPage/>} />
                {/* 
                <Route path="/user/conversations" element={<ConversationPage/>} />
                <Route path="/user/conversations/:chatId" element={<ConversationDetailPage/>} /> */}
                <Route path="/friends" element={<FriendPage/>} />
                {/* <Route path="/user/friends" element={<FriendPage/>} /> */}
                {/* <Route path="/user/friends/:chatId" element={<FriendPage/>} /> */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<UserProfilePage />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
