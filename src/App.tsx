import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './providers/theme-provider'
import LoginPage from './features/auth/pages/login-page'
import RegisterPage from './features/auth/pages/register-page'
import ChatPage from './features/chat/pages/chat-page'
import UserProfilePage from './features/user-profile/pages/user-profile-page'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/login"/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/chat' element={<ChatPage/>}></Route>
          <Route path='/profile' element={<UserProfilePage/>}></Route> 
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App