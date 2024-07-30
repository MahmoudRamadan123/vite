import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './FireBase'; // Adjust the import based on your Firebase setup
import './css/Privacy.css';

const Privacy = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const privacyPoliciesCollectionRef = collection(db, 'policies'); // Adjust the collection name as needed

  useEffect(() => {
    const fetchPrivacyPolicies = async () => {
      try {
        const querySnapshot = await getDocs(privacyPoliciesCollectionRef);
        const policiesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setPrivacyPolicies(policiesData);
      } catch (error) {
        console.error("Error fetching privacy policies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacyPolicies();
  }, []);

  if (loading) return <div className="privacy-loading">Loading...</div>;

  if (privacyPolicies.length === 0) return <div className="privacy-no-policies">No privacy policies available</div>;

  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policies</h1>
      <div className="privacy-policy-list">
        {privacyPolicies.map(policy => {
          const { title, content, contentType, id } = policy;
          return (
            <div key={id} className="privacy-policy-item">
              <h2 className="privacy-policy-title">{title}</h2>
              <div className="privacy-policy-content">
                {contentType === 'text' && <p className="privacy-text">{content}</p>}
                {contentType === 'list' && (
                  <ul className="privacy-list">
                    {content.split('\n').map((item, index) => <li key={index} className="privacy-list-item">{item}</li>)}
                  </ul>
                )}
                {contentType === 'image' && <img src={content} alt={title} className="privacy-image" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Privacy;
