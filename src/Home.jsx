import React, { useState, useEffect } from 'react';
import './css/Home.css';
import Plan from './component/Plan';
import State from './component/State';
import FAQ from './component/FAQ';
import { Link } from 'react-router-dom';
import { db, collection, doc, getDoc } from './FireBase'; // Import Firestore functions
import { FaClock, FaPhone, FaShieldAlt, FaStar } from 'react-icons/fa';
import expertImage from './assets/expert.png';
import CallCtaSection from './CallCtaSection';
const Home = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const docRef = doc(collection(db, 'phone'), 'uniquePhoneDocId'); // Adjust doc ID accordingly
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPhoneNumber(docSnap.data().phoneNumber);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error("Error fetching phone number: ", error);
            }
        };

        fetchPhoneNumber();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
                const isOut = rect.top > window.innerHeight || rect.bottom < 0;

                if (inView) {
                    el.classList.add(el.dataset.animationIn);
                    el.classList.remove(el.dataset.animationOut);
                } else if (isOut) {
                    el.classList.add(el.dataset.animationOut);
                    el.classList.remove(el.dataset.animationIn);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to handle initial view
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Plan />
            <div className='feature'>
                <div className='feature-item animate-on-scroll' data-animation-in="animate-slideInFromLeft" data-animation-out="animate-slideOutToLeft">
                    <FaClock className='feature-icon' />
                    <div className='feature-text'>
                        Compare in Minutes
                    </div>
                </div>
                <div className='feature-item animate-on-scroll' data-animation-in="animate-slideInFromTop" data-animation-out="animate-slideOutToTop">
                    <FaStar className='feature-icon' />
                    <div className='feature-text'>
                        Top Carriers & Brokers
                    </div>
                </div>
                <div className='feature-item animate-on-scroll' data-animation-in="animate-slideInFromRight" data-animation-out="animate-slideOutToRight">
                    <FaShieldAlt className='feature-icon' />
                    <div className='feature-text'>
                        100% Safe & Secure
                    </div>
                </div>
            </div>

            <State />
            <div className="call-cta-section animate-on-scroll" data-animation-in="animate-zoomIn" data-animation-out="animate-zoomOut">
                 <div className="call-image-container">
                    <img src={expertImage} alt="Expert Assistance" className="call-image"/>
                </div><div className="sectionss">
                                    <h1 className="call-title">Prefer to speak with an expert?</h1>
                <p className="call-description">Speak with a licensed agent and get knowledgeable advice on choosing a plan that's right for you.</p>
                <a className="call-phone-link" href={`tel:${phoneNumber}`}>
            <FaPhone className="call-phone-icon" />
            <span className="call-phone-text">{phoneNumber}</span>
        </a>
                <div className="call-button-container">
                    <div className="pulsing-icon"></div>
                    <button className="call-cta-button">Call for free live assistance</button>
                </div>
                </div>

               
            </div>
            <FAQ />
            <div className="last-info-container animate-on-scroll" data-animation-in="animate-fadeIn" data-animation-out="animate-fadeOut">
                <CallCtaSection/>
            </div>
        </>
    );
};

export default Home;
