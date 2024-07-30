// src/components/ChangePhoneNumberPage.jsx
import React, { useState, useEffect } from 'react';
import './css/ChangePhoneNumber.css';
import { db } from './FireBase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ChangePhoneNumberPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const phoneDocId = 'uniquePhoneDocId'; // Use the unique document ID of your phone document

    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const phoneDocRef = doc(db, 'phone', phoneDocId);
                const phoneDoc = await getDoc(phoneDocRef);

                if (phoneDoc.exists()) {
                    setPhoneNumber(phoneDoc.data().phoneNumber || '');
                } else {
                    setMessage('No phone number found.');
                }
            } catch (error) {
                console.error('Error fetching phone number:', error);
                setMessage('Failed to fetch phone number. Please try again.');
            }
        };

        fetchPhoneNumber();
    }, []);

    const handleChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const phoneDocRef = doc(db, 'phone', phoneDocId);
            await updateDoc(phoneDocRef, { phoneNumber });
            setMessage('Phone number updated successfully!');
        } catch (error) {
            console.error('Error updating phone number:', error);
            setMessage('Failed to update phone number. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="change-phone-number-container">
            <h2>Change Your Phone Number</h2>
            <form onSubmit={handleSubmit} className="phone-number-form">
                <label htmlFor="phone-number">New Phone Number</label>
                <input
                    type="tel"
                    id="phone-number"
                    value={phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your new phone number"
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Phone Number'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ChangePhoneNumberPage;
