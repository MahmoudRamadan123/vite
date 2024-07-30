import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, query, where } from './FireBase'; // Import Firestore functions
import { FaPhone, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function CallCtaSection() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isValid, setIsValid] = useState(true); // Track validation state
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Fetch phone number from Firebase
    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const phoneRef = collection(db, 'phone'); // Collection name for phone numbers
                const querySnapshot = await getDocs(phoneRef);
                const phoneData = querySnapshot.docs.map(doc => doc.data());
                if (phoneData.length > 0) {
                    setPhoneNumber(phoneData[0].phoneNumber); // Assume the phone number is in the first document
                }
            } catch (error) {
                console.error('Error fetching phone number: ', error);
            }
        };

        fetchPhoneNumber();
    }, []);

    // Check if ZIP code exists in Firestore
    const checkZipCode = async () => {
        try {
            const zipRef = collection(db, 'zipCodes'); // Collection name for ZIP codes
            const q = query(zipRef, where('zip', '==', zipCode));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // ZIP code exists, navigate to /questions
                setIsValid(true);
                setErrorMessage('');
                navigate(`/questions?zip=${zipCode}`);
            } else {
                // ZIP code does not exist
                setIsValid(false);
                setErrorMessage('ZIP code not found. Please enter a valid ZIP code.');
            }
        } catch (error) {
            console.error('Error checking ZIP code: ', error);
            setIsValid(false);
            setErrorMessage('An error occurred while validating the ZIP code.');
        }
    };

    const handleZipCodeChange = (e) => {
        setZipCode(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        checkZipCode();
    };

    return (
        <div className="last-info-content">
            <div className="last-info-left">
                <h2 className="last-info-title">Compare health insurance quotes</h2>
                <p className="last-info-subtitle">No obligation to enroll</p>
                <div className="last-plan-content">
                    <div className="last-plan-form">
                        <form onSubmit={handleSubmit}>
                            <div className="last-plan-input-group">
                                <input
                                    type="text"
                                    className={`last-plan-input ${!isValid ? 'input-error' : ''}`}
                                    id="zipCode"
                                    placeholder=" "
                                    value={zipCode}
                                    onChange={handleZipCodeChange}
                                />
                                <label htmlFor="zipCode" className="last-plan-input-label">
                                    ZIP CODE
                                </label>
                                
                            </div>
                            <div className="last-plan-button-container">
                                <button type="submit" className="last-plan-button">
                                    START MY QUOTE
                                </button>
                            </div>
                            
                        </form>{!isValid && (
                                    <div className="error-message Plan-error-text">
                                        <FaExclamationCircle className="error-icon" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}
                    </div>
                </div>
            </div>
            <div className="last-info-right animate-on-scroll" data-animation-in="animate-fadeIn" data-animation-out="animate-fadeOut">
                <h1 className="last-call-title">Or give us a call</h1>
                <p className="last-call-subtitle">The easier, faster way to get quotes</p>
                <a className="call-phone-link" href={`tel:${phoneNumber}`}>
                    <FaPhone className="call-phone-icon" />
                    <span className="call-phone-text">{phoneNumber}</span>
                </a>
                <div className="last-cta-section" data-animation-in="animate-zoomIn" data-animation-out="animate-zoomOut">
                    <div className="last-pulsing-icon"></div>
                    <button className="last-cta-button">
                        Call for free live assistance
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CallCtaSection;
