// src/components/ManageFAQsPage.jsx
import React, { useState, useEffect } from 'react';
import './css/ManageFAQs.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from './FireBase'; // Import Firebase functions

const ManageFAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [editFAQ, setEditFAQ] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    useEffect(() => {
        // Fetch FAQs from Firestore
        const unsubscribe = onSnapshot(collection(db, "faqs"), (snapshot) => {
            const faqsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFaqs(faqsData);
        });

        return () => unsubscribe();
    }, []);

    const handleAdd = async () => {
        if (newQuestion && newAnswer) {
            try {
                await addDoc(collection(db, "faqs"), { question: newQuestion, answer: newAnswer });
                setNewQuestion('');
                setNewAnswer('');
                setShowPopup(false);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    const handleUpdate = async () => {
        if (editFAQ && newQuestion && newAnswer) {
            try {
                await updateDoc(doc(db, "faqs", editFAQ.id), { question: newQuestion, answer: newAnswer });
                setEditFAQ(null);
                setNewQuestion('');
                setNewAnswer('');
                setShowPopup(false);
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    const handleEdit = (faq) => {
        setEditFAQ(faq);
        setNewQuestion(faq.question);
        setNewAnswer(faq.answer);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "faqs", id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <div className="manage-container">
            <h2>Manage FAQs</h2>
            <button className="add-button" onClick={() => { setEditFAQ(null); setShowPopup(true); }}>
                <FaPlus /> Add New FAQ
            </button>
            <div className="faq-list">
                {faqs.map(faq => (
                    <div className="faq-item" key={faq.id}>
                        <div className="faq-question">{faq.question}</div>
                        <div className="faq-answer">{faq.answer}</div>
                        <div className="actions">
                            <button onClick={() => handleEdit(faq)}><FaEdit /></button>
                            <button onClick={() => handleDelete(faq.id)}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{editFAQ ? 'Update FAQ' : 'Add New FAQ'}</h3>
                        <label>Question</label>
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter question"
                        />
                        <label>Answer</label>
                        <textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Enter answer"
                        />
                        <button onClick={editFAQ ? handleUpdate : handleAdd}>
                            {editFAQ ? 'Update' : 'Add'}
                        </button>
                        <button onClick={() => setShowPopup(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFAQsPage;
