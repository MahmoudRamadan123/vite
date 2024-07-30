import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../FireBase';
import { locations } from './locations'; // Import predefined locations
import '../css/Plan.css';

const Plan = () => {
    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);
    const [partners, setPartners] = useState([]);
    const [quoteCount, setQuoteCount] = useState(null);
    const navigate = useNavigate();

    // Handle ZIP Code input change
    const handleZipCodeChange = (e) => {
        setZipCode(e.target.value);
    };

    // Calculate distance between two coordinates
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    // Find the closest location from predefined list
    const findClosestLocation = (latitude, longitude) => {
        let closestLocation = null;
        let minDistance = Infinity;

        locations.forEach(location => {
            const distance = getDistance(latitude, longitude, location.latitude, location.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                closestLocation = location;
            }
        });

        return closestLocation ? closestLocation.name : 'Unknown Location';
    };

    // Fetch ZIP code by location name from Firebase
    const fetchZipCodeByLocation = async (location) => {
        try {
            const locationsRef = collection(db, 'zipCodes');
            const q = query(locationsRef, where('location', '==', location));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('ZIP code not found');
                return '';
            }

            const doc = querySnapshot.docs[0].data();
            return doc.zipCode;
        } catch (error) {
            console.error('Error fetching ZIP code by location: ', error);
            setError('An error occurred while fetching ZIP code');
            return '';
        }
    };

    // Handle Auto-Fill ZIP Code by Location button click
    const handleAutoFillZipCode = async () => {
        setLocationLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const locationName = findClosestLocation(latitude, longitude);

                const zipCodeFromLocation = await fetchZipCodeByLocation(locationName);
                if (zipCodeFromLocation) {
                    setZipCode(zipCodeFromLocation);
                    setError('');
                }
                setLocationLoading(false);
            }, (error) => {
                console.error('Error fetching location: ', error);
                setError('Unable to retrieve location');
                setLocationLoading(false);
            });
        } else {
            setError('Geolocation is not supported by this browser');
            setLocationLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const zipCodeCollection = collection(db, 'zipCodes');
            const q = query(zipCodeCollection, where('zip', '==', zipCode));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('ZIP Code not found');
            } else {
                navigate(`/questions?zip=${zipCode}`);
            }
        } catch (error) {
            console.error("Error checking ZIP code: ", error);
            setError('An error occurred while checking ZIP code');
        }
    };

    useEffect(() => {
        // Fetch quote count
        const fetchQuoteCount = async () => {
            try {
                const quotesRef = collection(db, 'quotes');
                const querySnapshot = await getDocs(quotesRef);
                const count = querySnapshot.size;
                setQuoteCount(count);
            } catch (error) {
                console.error('Error fetching quote count: ', error);
            }
        };

        fetchQuoteCount();
    }, []);

    // Format number with commas
    const formatNumber = (number) => {
        return number.toLocaleString();
    };

    // Fetch partner data from Firebase
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const partnersRef = collection(db, 'plans');
                const querySnapshot = await getDocs(partnersRef);
                const partnersData = querySnapshot.docs.map(doc => doc.data());
                setPartners(partnersData);
            } catch (error) {
                console.error('Error fetching partners: ', error);
            }
        };

        fetchPartners();
    }, []);

    return (
        <div className='Plan'>
            <div className='Plan-header animate-on-scroll' data-animation-in="animate-slideInFromTop" data-animation-out="animate-slideOutToTop">
                <h1 className='Plan-title'>Health Plan Options 2024</h1>
                <h3 className='Plan-subtitle'>Enter your ZIP Code & compare rates to find how much you may save!</h3>
            </div>
            <div className='Plan-content animate-on-scroll' data-animation-in="animate-slideInFromBottom" data-animation-out="animate-slideOutToBottom">
                <form onSubmit={handleSubmit} className='Plan-form'>
                    <div className='Plan-input-group'>
                        <input
                            type='text'
                            id='zipCode'
                            className='Plan-input'
                            placeholder='ZIP Code'
                            value={zipCode}
                            onChange={handleZipCodeChange}
                        />
                        <label htmlFor='zipCode' className='Plan-input-label'>ZIP Code</label>
                    </div>
                    <div className='Plan-button-container'>
                        <button type='button' className='Plan-button' onClick={handleAutoFillZipCode} disabled={locationLoading}>
                            {locationLoading ? 'Locating...' : 'Auto-Fill ZIP Code'}
                        </button>
                        <button type='submit' className='Plan-button'>Start My Quote</button>
                    </div>
                </form>
                {error && <p className='Plan-error-text'>{error}</p>}
                <div className='Plan-info'>
                    <p className='Plan-info-text'>
                        Find the best health plan options tailored to your needs by entering your ZIP code.
                    </p>
                </div>
            </div>
            <div className='Plan-statistics animate-on-scroll' data-animation-in="animate-fadeIn" data-animation-out="animate-fadeOut">
                <p className='Plan-statistics-text'>
                    We've helped {formatNumber(quoteCount || 0)} people this month.
                </p>
                <p className='Plan-partners-text'>
                    We work with {partners.length} partners to offer plans.
                </p>
                {partners.length > 0 && (
                    <div className='Plan-partners-logos'>
                        {partners.map((partner, index) => (
                            <Link
                                key={index}
                                to={`/questions?zip=${partner.zip}`} 
                                className='Plan-partner-logo-link'
                            >
                                <img 
                                    src={partner.imageUrl} 
                                    alt={partner.name} 
                                    className='Plan-partner-logo' 
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <div className='Plan-footer animate-on-scroll' data-animation-in="animate-zoomIn" data-animation-out="animate-zoomOut">
                <p className='Plan-footer-text'>
                    *Savings and options may vary based on location and eligibility.
                </p>
            </div>
        </div>
    );
};

export default Plan;
