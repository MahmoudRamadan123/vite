import React, { useState, useEffect } from 'react';
import { db, collection, doc, getDoc } from '../FireBase'; // Import Firestore functions
import logo from '../assets/logo.webp';
import {useNavigate} from 'react-router-dom'
const Navbar = () => {
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

    return (
        <header className='header'>
            <div className="priv-header">
                <b>Doman name</b> is not a government website and is privately owned. this website is not active
            </div>
            <div className="header-sub">
                <img src={logo} alt="Techright" className='logo' />
                <a href={`tel:${phoneNumber}`} className="contact">
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z" fill="#1C274C"/>
                        <path d="M8.03759 7.31617L8.6866 8.4791C9.2723 9.52858 9.03718 10.9053 8.11471 11.8278C8.11471 11.8278 8.11471 11.8278 8.11471 11.8278C8.11459 11.8279 6.99588 12.9468 9.02451 14.9755C11.0525 17.0035 12.1714 15.8861 12.1722 15.8853C12.1722 15.8853 12.1722 15.8853 12.1722 15.8853C13.0947 14.9628 14.4714 14.7277 15.5209 15.3134L16.6838 15.9624C18.2686 16.8468 18.4557 19.0692 17.0628 20.4622C16.2258 21.2992 15.2004 21.9505 14.0669 21.9934C12.1588 22.0658 8.91828 21.5829 5.6677 18.3323C2.41713 15.0817 1.93421 11.8412 2.00655 9.93309C2.04952 8.7996 2.7008 7.77423 3.53781 6.93723C4.93076 5.54428 7.15317 5.73144 8.03759 7.31617Z" fill="#1C274C"/>
                    </svg>
                    <p>{phoneNumber}</p>
                </a>
            </div>
        </header>
    );
};

export default Navbar;
