import React, { useState } from 'react';
import './css/LoginPage.css'; // For custom styling (optional)
import logo from './assets/logo.webp';
import { db, doc, getDoc } from './FireBase'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch admin credentials from Firestore
            const credentialsDocRef = doc(db, 'admin', 'profile');
            const docSnap = await getDoc(credentialsDocRef);

            if (docSnap.exists()) {
                const { username: storedUsername, password: storedPassword } = docSnap.data();

                if (username === storedUsername && password === storedPassword) {
                    // Save user profile data to session
                    sessionStorage.setItem('userProfile', JSON.stringify({ username: storedUsername }));

                    // Redirect or perform any additional actions
                    console.log('Login successful!', { username: storedUsername });
                    navigate('/dashboard'); // Use navigate to change the route
                } else {
                    setError('Invalid username or password');
                }
            } else {
                setError('Admin credentials not found');
            }
        } catch (error) {
            console.error("Error during login: ", error);
            setError('An error occurred during login');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-login" />
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">Login</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
