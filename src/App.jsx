import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './Home';
import Terms from './Terms';
import Privacy from './Privacy';
import ContactUs from './Contact';
import Questions from './Questions';
import LoginPage from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import LoadingScreen from './component/LoadingScreen';
import NotFound from './component/NotFound';
import './App.css';
import ThankYou from './ThankYou';

function App() {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = sessionStorage.getItem('userProfile'); 

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timeout duration as needed
    
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/login-techright" element={<LoginPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path='/dashboard'
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route path='/thank-you' element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
