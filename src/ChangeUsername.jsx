// src/components/ChangeUsername.jsx
import React, { useState, useEffect } from 'react';
import './css/ChangeUsername.css';
import { FaUserEdit } from 'react-icons/fa';
import { db, doc, getDoc, updateDoc } from './FireBase'; // Import Firestore functions

const ChangeUsernamePage = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    // Fetch the current username from Firestore when the component mounts
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const docRef = doc(db, 'admin', 'profile'); // Document reference
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUsername(docSnap.data().username || '');
                }
            } catch (error) {
                console.error("Error fetching username: ", error);
                setMessage('Failed to fetch username. Please try again.');
            }
        };

        fetchUsername();
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim()) {
            try {
                const docRef = doc(db, 'admin', 'profile'); // Document reference
                await updateDoc(docRef, { username: username });
                setMessage(`Username changed to: ${username}`);
            } catch (error) {
                console.error("Error updating username: ", error);
                setMessage('Failed to update username. Please try again.');
            }
        } else {
            setMessage('Please enter a valid username.');
        }
    };

    return (
        <div className="change-username-container">
            <h2>Change Username</h2>
            <div className="icon-container">
                <FaUserEdit />
            </div>
            <form onSubmit={handleSubmit} className="change-username-form">
                <label htmlFor="username">New Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter new username"
                />
                <button type="submit" className="submit-button">
                    Update Username
                </button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default ChangeUsernamePage;
