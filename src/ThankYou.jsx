// src/ThankYou.js
import React from 'react';
import './css/ThankYou.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div className="thank-you-page">
            <h1>Thank You!</h1>
            <p>Your quote has been submitted successfully.</p>
            <div className="button-container">
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default ThankYou;
