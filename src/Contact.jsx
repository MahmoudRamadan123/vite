import React, { useState, useEffect, useRef } from 'react';
import './css/ContactUs.css'; // Import the CSS file
import { db, collection, addDoc, serverTimestamp } from './FireBase'; // Import Firestore functions

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comments: ''
  });

  const [errors, setErrors] = useState({});
  
  // Refs for scroll animations
  const infoCardsRef = useRef(null);
  const mapRef = useRef(null);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.subject) tempErrors.subject = 'Subject is required';
    if (!formData.firstName) tempErrors.firstName = 'First name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last name is required';
    if (!formData.phone) tempErrors.phone = 'Phone number is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.comments) tempErrors.comments = 'Comments are required';
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Add a new document with a timestamp
        await addDoc(collection(db, 'messages'), {
          ...formData,
          timestamp: serverTimestamp() // Add timestamp
        });
        console.log('Form data submitted:', formData);
        // Clear form data after submission
        setFormData({
          subject: '',
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          comments: ''
        });
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        } else {
          entry.target.classList.remove('animate-fadeIn');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (infoCardsRef.current) {
      observer.observe(infoCardsRef.current);
    }
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }
    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (infoCardsRef.current) {
        observer.unobserve(infoCardsRef.current);
      }
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-intro">Fill out the form below to get in touch with us.</p>
      
      <div className="contact-info-cards" ref={infoCardsRef}>
        <div className="info-card animate-slideInFromLeft">
          <h2 className="card-header">Phone Number</h2>
          <p className="card-body">+1 234 567 890</p>
        </div>
        <div className="info-card animate-slideInFromRight">
          <h2 className="card-header">Email Address</h2>
          <p className="card-body">contact@example.com</p>
        </div>
      </div>



      <form onSubmit={handleSubmit} className="contact-form" ref={formRef}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject*</label>
            <select
              id="subject"
              name="subject"
              className="form-select"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Support Request">Support Request</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comments" className="form-label">Comments*</label>
          <textarea
            id="comments"
            name="comments"
            className="form-textarea"
            value={formData.comments}
            onChange={handleChange}
            required
          />
          {errors.comments && <span className="form-error">{errors.comments}</span>}
        </div>
        
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
