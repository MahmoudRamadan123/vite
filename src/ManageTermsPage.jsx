import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, deleteDoc, updateDoc, doc, getDocs } from './FireBase';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import './css/ManageTermsPage.css';

const ManageTermsPage = () => {
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ title: '', contentType: 'text', content: '' });
  const [editingSection, setEditingSection] = useState(null);

  const sectionsCollection = collection(db, 'teams');

  // Fetch Sections
  useEffect(() => {
    const fetchSections = async () => {
      const snapshot = await getDocs(sectionsCollection);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSections(data);
    };
    fetchSections();
  }, []);

  // Add Section
  const addSection = async () => {
    try {
      await addDoc(sectionsCollection, newSection);
      setNewSection({ title: '', contentType: 'text', content: '' });
    } catch (error) {
      console.error("Error adding section: ", error);
    }
  };

  // Update Section
  const updateSection = async () => {
    if (editingSection) {
      const sectionRef = doc(db, 'teams', editingSection.id);
      try {
        await updateDoc(sectionRef, editingSection);
        setEditingSection(null);
      } catch (error) {
        console.error("Error updating section: ", error);
      }
    }
  };

  // Delete Section
  const deleteSection = async (id) => {
    try {
      const sectionRef = doc(db, 'teams', id);
      await deleteDoc(sectionRef);
    } catch (error) {
      console.error("Error deleting section: ", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingSection(prev => ({ ...prev, [name]: value }));
  };

  // Select content type
  const handleContentTypeChange = (e) => {
    const { value } = e.target;
    setNewSection(prev => ({ ...prev, contentType: value }));
  };

  return (
    <div className="manageterms-page">
      <header className="manageterms-page-header">
        <h1>Manage Terms</h1>
      </header>
      
      <section className="manageterms-section-form">
        <div className="manageterms-form-header">
          <h2>{editingSection ? 'Edit Section' : 'Add New Section'}</h2>
        </div>
        
        <div className="manageterms-form-group">
          <input
            type="text"
            name="title"
            value={editingSection ? editingSection.title : newSection.title}
            onChange={editingSection ? handleEditingChange : handleInputChange}
            placeholder="Section Title"
            className="manageterms-form-input"
          />
        </div>

        <div className="manageterms-form-group">
          <select
            name="contentType"
            value={editingSection ? editingSection.contentType : newSection.contentType}
            onChange={editingSection ? handleEditingChange : handleContentTypeChange}
            className="manageterms-form-select"
          >
            <option value="text">Text</option>
            <option value="list">List</option>
            <option value="image">Image</option>
          </select>
        </div>

        { (editingSection ? editingSection.contentType : newSection.contentType) === 'text' && (
          <div className="manageterms-form-group">
            <textarea
              name="content"
              value={editingSection ? editingSection.content : newSection.content}
              onChange={editingSection ? handleEditingChange : handleInputChange}
              placeholder="Section Content"
              className="manageterms-form-textarea"
            />
          </div>
        )}

        { (editingSection ? editingSection.contentType : newSection.contentType) === 'list' && (
          <div className="manageterms-form-group">
            <textarea
              name="content"
              value={editingSection ? editingSection.content : newSection.content}
              onChange={editingSection ? handleEditingChange : handleInputChange}
              placeholder="List items (one per line)"
              className="manageterms-form-textarea"
            />
          </div>
        )}

        { (editingSection ? editingSection.contentType : newSection.contentType) === 'image' && (
          <div className="manageterms-form-group">
            <input
              type="file"
              name="content"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64File = reader.result;
                    setEditingSection(prev => ({ ...prev, content: base64File }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="manageterms-form-file-input"
            />
          </div>
        )}

        <div className="manageterms-form-actions">
          <button onClick={editingSection ? updateSection : addSection} className="manageterms-form-button">
            {editingSection ? 'Update Section' : 'Add Section'}
          </button>

          {editingSection && (
            <button onClick={() => setEditingSection(null)} className="manageterms-form-button manageterms-cancel-button">
              <FaTimes /> Cancel Edit
            </button>
          )}
        </div>
      </section>

      <section className="manageterms-section-list">
        <div className="manageterms-list-header">
          <h2>Existing Sections</h2>
        </div>
        {sections.map(section => (
          <div key={section.id} className="manageterms-section-item">
            <h3>{section.title}</h3>
            {section.contentType === 'text' && <p>{section.content}</p>}
            {section.contentType === 'list' && (
              <ul>
                {section.content.split('\n').map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            )}
            {section.contentType === 'image' && <img src={section.content} alt={section.title} className="manageterms-section-image" />}
            
            <div className="manageterms-item-actions">
              <button onClick={() => setEditingSection(section)} className="manageterms-item-button manageterms-edit-button">
                <FaEdit /> Edit
              </button>
              <button onClick={() => deleteSection(section.id)} className="manageterms-item-button manageterms-delete-button">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ManageTermsPage;
