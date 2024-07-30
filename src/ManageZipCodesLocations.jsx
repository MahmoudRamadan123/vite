// src/components/ManageZipCodesLocations.jsx
import React, { useState, useEffect } from 'react';
import './css/ManageZipCodesLocations.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from './FireBase'; // Import Firebase functions

const ManageZipCodesLocations = () => {
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [newZip, setNewZip] = useState('');
    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        // Fetch data from Firestore
        const unsubscribe = onSnapshot(collection(db, "zipCodes"), (snapshot) => {
            const zipCodesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(zipCodesData);
        });

        return () => unsubscribe();
    }, []);

    const handleAdd = async () => {
        if (newZip && newLocation) {
            try {
                await addDoc(collection(db, "zipCodes"), { zip: newZip, location: newLocation });
                setNewZip('');
                setNewLocation('');
                setShowPopup(false);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    const handleUpdate = async () => {
        if (editItem && newZip && newLocation) {
            try {
                await updateDoc(doc(db, "zipCodes", editItem.id), { zip: newZip, location: newLocation });
                setEditItem(null);
                setNewZip('');
                setNewLocation('');
                setShowPopup(false);
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setNewZip(item.zip);
        setNewLocation(item.location);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "zipCodes", id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <div className="manage-container">
            <h2>Manage Zip Codes & Locations</h2>
            <button className="add-button" onClick={() => { setEditItem(null); setShowPopup(true); }}>
                <FaPlus /> Add New
            </button>
            <div className="data-table">
                <div className="header">
                    <span>Zip Code</span>
                    <span>Location</span>
                    <span>Actions</span>
                </div>
                {data.map(item => (
                    <div className="row" key={item.id}>
                        <span>{item.zip}</span>
                        <span>{item.location}</span>
                        <div className="actions">
                            <button onClick={() => handleEdit(item)}><FaEdit /></button>
                            <button onClick={() => handleDelete(item.id)}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{editItem ? 'Update Zip Code & Location' : 'Add New Zip Code & Location'}</h3>
                        <label>Zip Code</label>
                        <input
                            type="text"
                            value={newZip}
                            onChange={(e) => setNewZip(e.target.value)}
                            placeholder="Enter zip code"
                        />
                        <label>Location</label>
                        <input
                            type="text"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            placeholder="Enter location"
                        />
                        <button onClick={editItem ? handleUpdate : handleAdd}>
                            {editItem ? 'Update' : 'Add'}
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

export default ManageZipCodesLocations;
