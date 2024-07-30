import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './css/Dashboard.css'; // For custom styling (optional)
import ManageQuotePage from './ManageQuote';
import ChangePhoneNumberPage from './ChangePhoneNumber';
import ManageZipCodesLocations from './ManageZipCodesLocations';
import ManageFAQsPage from './ManageFAQs';
import ChangeUsernamePage from './ChangeUsername';
import ChangePasswordPage from './ChangePassword';
import ContactUsPage from './ContactUsPage';
import ManagePLanPage from './ManagePLanPage';
import ManageTermsPage from './ManageTermsPage';
import ManagePolicyPage from './ManagePolicyPage';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('manageQuote');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        // Clear session storage or any authentication state
        sessionStorage.removeItem('userProfile');

        // Redirect to login page
        navigate('/');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'manageQuote':
                return <ManageQuote />;
            case 'changePhone':
                return <ChangePhoneNumber />;
            case 'manageZip':
                return <ManageZipCodes />;
            case 'manageFAQs':
                return <ManageFAQs />;
            case 'changeUsername':
                return <ChangeUsername />;
            case 'changePassword':
                return <ChangePassword />;
            case 'contactUs':
                return <ContactUs />;
            case 'managePlan':
                return <ManagePLan />;
            case 'manageTerms':
                return <ManageTerms />;
            case 'managePolicy':
                return <ManagePolicy />;
            default:
                return <ManageQuote />;
            
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h2 className="sidebar-title">Dashboard</h2>
                <ul className="sidebar-menu">
                    <li className={`sidebar-item ${activeSection === 'manageQuote' ? 'active' : ''}`} onClick={() => setActiveSection('manageQuote')}>Manage Quote</li>
                    <li className={`sidebar-item ${activeSection === 'changePhone' ? 'active' : ''}`} onClick={() => setActiveSection('changePhone')}>Change Phone Number</li>
                    <li className={`sidebar-item ${activeSection === 'manageZip' ? 'active' : ''}`} onClick={() => setActiveSection('manageZip')}>Manage Zip Codes & Locations</li>
                    <li className={`sidebar-item ${activeSection === 'manageFAQs' ? 'active' : ''}`} onClick={() => setActiveSection('manageFAQs')}>Manage FAQs</li>
                    <li className={`sidebar-item ${activeSection === 'changeUsername' ? 'active' : ''}`} onClick={() => setActiveSection('changeUsername')}>Change Username</li>
                    <li className={`sidebar-item ${activeSection === 'changePassword' ? 'active' : ''}`} onClick={() => setActiveSection('changePassword')}>Change Password</li>
                    <li className={`sidebar-item ${activeSection === 'contactUs' ? 'active' : ''}`} onClick={() => setActiveSection('contactUs')}>Message</li>
                    <li className={`sidebar-item ${activeSection === 'managePlan' ? 'active' : ''}`} onClick={() => setActiveSection('managePlan')}>Manage Plan</li>  
                    <li className={`sidebar-item ${activeSection === 'manageTerms' ? 'active' : ''}`} onClick={() => setActiveSection('manageTerms')}>Manage Terms</li>
                    <li className={`sidebar-item ${activeSection === 'managePolicy' ? 'active' : ''}`} onClick={() => setActiveSection('managePolicy')}>Manage Policy</li>          
                    <li className={`sidebar-item ${activeSection === 'logout' ? 'active' : ''}`} onClick={() =>handleLogout()}>Logout</li>
                </ul>

            </aside>
            <main className="dashboard-content">
                {renderContent()}
            </main>
        </div>
    );
};

const ManageQuote = () => <ManageQuotePage />;
const ChangePhoneNumber = () => <ChangePhoneNumberPage />;
const ManageZipCodes = () => <ManageZipCodesLocations />;
const ManageFAQs = () => <ManageFAQsPage />;
const ChangeUsername = () => <ChangeUsernamePage />;
const ChangePassword = () => <ChangePasswordPage />;
const ContactUs = () => <ContactUsPage />;
const ManagePLan=()=> <ManagePLanPage/>;
const ManageTerms=()=> <ManageTermsPage/>;
const ManagePolicy=()=> <ManagePolicyPage/>;
export default Dashboard;
