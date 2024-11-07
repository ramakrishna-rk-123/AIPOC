import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(email===""|| password===""){
            return alert("All fields required")
        }
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });
            Cookies.set('accessToken', response.data.token);
            navigate('/tavily-ai');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </div>
    );
}

export default LoginPage;
