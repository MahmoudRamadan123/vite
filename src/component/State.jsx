import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/State.css';
import { FaArrowRight } from 'react-icons/fa';
import { db, collection, getDocs } from '../FireBase'; 

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1',  '#FFD700'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function State() {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const q = collection(db, 'zipCodes'); // Replace 'zipCodes' with your collection name
                const querySnapshot = await getDocs(q);
                const statesList = querySnapshot.docs.map(doc => doc.data());
                setStates(statesList);
            } catch (error) {
                console.error('Error fetching states: ', error);
            }
        };

        fetchStates();
    }, []);

    const handleSelectChange = (e) => {
        setSelectedState(e.target.value);
    };

    return (
        <div className="call-container-state">
            <div className="call-header-state">
                <h1 className="call-title">Click your state below</h1>
                <h3 className="call-subtitle">To get FREE health plan quotes & save!</h3>
            </div>
            <div className="call-content">
                <div className="call-states">
                    {states.map((state, index) => (
                        <div
                            className="call-state-item"
                            key={state.zip}
                            
                        >
                            <Link style={{
                                backgroundColor: getRandomColor(),
                                animationDelay: `${index * 0.1}s`,
                                color: 'white' // Ensure text is readable
                            }} to={`/questions?state=${state.location}&zip=${state.zip}`} className="call-state-button">
                                {state.location}
                                <FaArrowRight className="call-arrow-icon" />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="call-mobile">
                    <select className="call-select" value={selectedState} onChange={handleSelectChange}>
                        <option value="">Select your state</option>
                        {states.map((state) => (
                            <option key={state.zip} value={state.zip}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                    <Link to={`/questions?state=${states.find(state => state.zip === selectedState)?.name}&zip=${selectedState}`} className="call-select-button">
                        <FaArrowRight className="call-arrow-icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default State;
