// src/components/ChangePassword.jsx
import React, { useState } from 'react';
import './css/ChangePassword.css';
import { FaLock } from 'react-icons/fa';
import { db, doc, getDoc, updateDoc } from './FireBase'; // Import Firestore functions

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setMessage('New password must be at least 8 characters long.');
            return;
        }

        try {
            const docRef = doc(db, 'admin', 'profile'); // Document reference
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Fetch current password from Firestore (if stored)
                const data = docSnap.data();
                const currentStoredPassword = data.password; // Assumes the password is stored in Firestore

                if (currentPassword !== currentStoredPassword) {
                    setMessage('Current password is incorrect.');
                    return;
                }

                // Update password in Firestore
                await updateDoc(docRef, { password: newPassword });
                setMessage('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage('User not found.');
            }
        } catch (error) {
            console.error("Error updating password: ", error);
            setMessage('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <div className="icon-container">
                <FaLock />
            </div>
            <form onSubmit={handleSubmit} className="change-password-form">
                <label htmlFor="current-password">Current Password</label>
                <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                />
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
                <button type="submit" className="submit-button">
                    Change Password
                </button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default ChangePasswordPage;
