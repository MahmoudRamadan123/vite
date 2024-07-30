import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, deleteDoc, updateDoc, doc, getDocs } from './FireBase';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import './css/ManagePolicyPage.css';

const ManagePolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ title: '', contentType: 'text', content: '' });
  const [editingPolicy, setEditingPolicy] = useState(null);

  const policiesCollection = collection(db, 'policies');

  // Fetch Policies
  useEffect(() => {
    const fetchPolicies = async () => {
      const snapshot = await getDocs(policiesCollection);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPolicies(data);
    };
    fetchPolicies();
  }, []);

  // Add Policy
  const addPolicy = async () => {
    try {
      await addDoc(policiesCollection, newPolicy);
      setNewPolicy({ title: '', contentType: 'text', content: '' });
    } catch (error) {
      console.error("Error adding policy: ", error);
    }
  };

  // Update Policy
  const updatePolicy = async () => {
    if (editingPolicy) {
      const policyRef = doc(db, 'policies', editingPolicy.id);
      try {
        await updateDoc(policyRef, editingPolicy);
        setEditingPolicy(null);
      } catch (error) {
        console.error("Error updating policy: ", error);
      }
    }
  };

  // Delete Policy
  const deletePolicy = async (id) => {
    try {
      const policyRef = doc(db, 'policies', id);
      await deleteDoc(policyRef);
    } catch (error) {
      console.error("Error deleting policy: ", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingPolicy(prev => ({ ...prev, [name]: value }));
  };

  // Select content type
  const handleContentTypeChange = (e) => {
    const { value } = e.target;
    setNewPolicy(prev => ({ ...prev, contentType: value }));
  };

  return (
    <div className="managepolicy-page">
      <h1>Manage Policy Page</h1>
      
      <div className="managepolicy-form">
        <h2>{editingPolicy ? 'Edit Policy' : 'Add New Policy'}</h2>
        
        <input
          type="text"
          name="title"
          value={editingPolicy ? editingPolicy.title : newPolicy.title}
          onChange={editingPolicy ? handleEditingChange : handleInputChange}
          placeholder="Policy Title"
          className="managepolicy-input"
        />

        <select
          name="contentType"
          value={editingPolicy ? editingPolicy.contentType : newPolicy.contentType}
          onChange={editingPolicy ? handleEditingChange : handleContentTypeChange}
          className="managepolicy-select"
        >
          <option value="text">Text</option>
          <option value="list">List</option>
          <option value="image">Image</option>
        </select>

        { (editingPolicy ? editingPolicy.contentType : newPolicy.contentType) === 'text' && (
          <textarea
            name="content"
            value={editingPolicy ? editingPolicy.content : newPolicy.content}
            onChange={editingPolicy ? handleEditingChange : handleInputChange}
            placeholder="Policy Content"
            className="managepolicy-textarea"
          />
        )}

        { (editingPolicy ? editingPolicy.contentType : newPolicy.contentType) === 'list' && (
          <textarea
            name="content"
            value={editingPolicy ? editingPolicy.content : newPolicy.content}
            onChange={editingPolicy ? handleEditingChange : handleInputChange}
            placeholder="List items (one per line)"
            className="managepolicy-textarea"
          />
        )}

        { (editingPolicy ? editingPolicy.contentType : newPolicy.contentType) === 'image' && (
          <input
            type="file"
            name="content"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64File = reader.result;
                  setEditingPolicy(prev => ({ ...prev, content: base64File }));
                };
                reader.readAsDataURL(file);
              }
            }}
            className="managepolicy-file-input"
          />
        )}

        <button onClick={editingPolicy ? updatePolicy : addPolicy} className="managepolicy-button">
          {editingPolicy ? 'Update Policy' : 'Add Policy'}
        </button>

        {editingPolicy && (
          <button onClick={() => setEditingPolicy(null)} className="managepolicy-button managepolicy-cancel-button">
            <FaTimes /> Cancel Edit
          </button>
        )}
      </div>

      <div className="managepolicy-list">
        <h2>Existing Policies</h2>
        {policies.map(policy => (
          <div key={policy.id} className="managepolicy-item">
            <h3>{policy.title}</h3>
            {policy.contentType === 'text' && <p>{policy.content}</p>}
            {policy.contentType === 'list' && (
              <ul>
                {policy.content.split('\n').map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            )}
            {policy.contentType === 'image' && <img src={policy.content} alt={policy.title} className="managepolicy-image" />}
            
            <div className="managepolicy-item-actions">
              <button onClick={() => setEditingPolicy(policy)} className="managepolicy-item-button managepolicy-edit-button">
                <FaEdit /> Edit
              </button>
              <button onClick={() => deletePolicy(policy.id)} className="managepolicy-item-button managepolicy-delete-button">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePolicyPage;
