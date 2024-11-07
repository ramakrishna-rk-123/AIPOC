import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        if(username==="" || email===""|| password===""){
            return alert("All fields required")
        }
        try {
            await axios.post('http://localhost:5000/signup', { username, email, password });
            alert('Signup successful');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button onClick={handleSignup}>Sign Up</button>
            </div>
        </div>
    );
}

export default SignupPage;
