import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './FireBase'; // Adjust the import based on your Firebase setup
import './css/TermsAndConditions.css';

const Terms = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const termsCollectionRef = collection(db, 'teams'); // Adjust the collection name as needed

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const querySnapshot = await getDocs(termsCollectionRef);
        const termsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setTerms(termsData);
      } catch (error) {
        console.error("Error fetching terms: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) return <div className="terms-loading">Loading...</div>;

  if (terms.length === 0) return <div className="terms-no-terms">No terms available</div>;

  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms and Conditions</h1>
      <div className="terms-list">
        {terms.map((term) => {
          const { title, content, contentType, id } = term;
          return (
            <div key={id} className="term-item">
              <h2 className="term-item-title">{title}</h2>
              <div className="term-item-content">
                {contentType === 'text' && <p className="term-text">{content}</p>}
                {contentType === 'list' && (
                  <ul className="term-list">
                    {content.split('\n').map((item, index) => <li key={index} className="term-list-item">{item}</li>)}
                  </ul>
                )}
                {contentType === 'image' && <img src={content} alt={title} className="term-image" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Terms;
