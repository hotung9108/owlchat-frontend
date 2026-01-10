import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ChatPage from './features/chat/pages/ChatPage';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path ="/" element = {<LoginPage onLogin={() =>setIsAuthenticated(true)}/>}/>
        <Route path ="/register" element = {<RegisterPage/>}/>
        <Route 
          path ="/chat" 
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />
          }
        />
        
      </Routes>
    </Router>
  )
}

export default App
