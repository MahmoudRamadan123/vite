import React, { useState, useEffect } from 'react';
import { db } from '../FireBase'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaInfoCircle, FaExclamationTriangle, FaPlusCircle } from 'react-icons/fa';
import '../css/FAQ.css';

const iconMapping = {
    question: <FaQuestionCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationTriangle />,
    plus: <FaPlusCircle />
};

function FAQ() {
    const [faqs, setFaqs] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const q = collection(db, 'faqs');
                const querySnapshot = await getDocs(q);
                const fetchedFAQs = querySnapshot.docs.map(doc => doc.data());
                setFaqs(fetchedFAQs);
            } catch (error) {
                console.error("Error fetching FAQs: ", error);
            }
        };

        fetchFAQs();
    }, []);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="FAQs-container">
            <h1 className="FAQs-title">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div className="FAQs-info-section" key={index}>
                    <div 
                        className="FAQs-question-header" 
                        onClick={() => toggleExpand(index)}
                        aria-expanded={expandedIndex === index}
                        aria-controls={`faq-answer-${index}`}
                    >
                        <div className="FAQs-icon">{iconMapping[faq.icon]}</div>
                        <h2 className="FAQs-question">{faq.question}</h2>
                        <div 
                            className={`FAQs-toggle-icon ${expandedIndex === index ? 'expanded' : ''}`}
                        >
                            {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>
                    <div 
                        id={`faq-answer-${index}`}
                        className={`FAQs-answer ${expandedIndex === index ? 'expanded' : 'collapsed'}`}
                    >
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FAQ;
