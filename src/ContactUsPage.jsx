import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, updateDoc, doc, deleteDoc } from './FireBase'; // Import Firestore functions
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt, FaTrash, FaCheck } from 'react-icons/fa'; // Import React Icons
import './css/ContactUsPage.css'; // Import CSS file for styling

const ContactUsPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create a query to fetch messages from Firestore
    const q = query(collection(db, 'messages'));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesArray);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    const messageDoc = doc(db, 'messages', id);
    await updateDoc(messageDoc, { isNew: false });
  };

  const deleteMessage = async (id) => {
    const messageDoc = doc(db, 'messages', id);
    await deleteDoc(messageDoc);
  };

  return (
    <div className="admin-contact-us-page">
      <h1 className="page-title">Contact Messages</h1>
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-card ${message.isNew ? 'new-message' : 'read-message'}`}
          >
            <div className="message-header">
              <h2 className="message-subject">{message.subject}</h2>
              <div className="admin-actions">
                {message.isNew && (
                  <button onClick={() => markAsRead(message.id)} className="action-button mark-as-read">
                    <FaCheck /> Mark as Read
                  </button>
                )}
                <button onClick={() => deleteMessage(message.id)} className="action-button delete-message">
                  <FaTrash /> Delete
                </button>
              </div>
              <span className={`status ${message.isNew ? 'new' : 'read'}`}>
                {message.isNew ? 'New' : 'Read'}
              </span>
            </div>
            <div className="message-body">
              <p><FaUser /> {message.firstName} {message.lastName}</p>
              <p><FaPhone /> {message.phone}</p>
              <p><FaEnvelope /> {message.email}</p>
              <p><FaCalendarAlt /> {new Date(message.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="message-comments">{message.comments}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUsPage;
