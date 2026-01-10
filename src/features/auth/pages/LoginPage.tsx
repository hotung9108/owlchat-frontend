import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigative = useNavigate();
    const handleLogin = () => {
        if (email && password) {
            onLogin();
            navigative('/chat');
        }
    }
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2x1 font-bold mb-4 text-center">Login</h2>
                <form>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                </form>
                <p>
                    Don't have and account?
                    <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};
export default LoginPage;