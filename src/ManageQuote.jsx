import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, deleteDoc, doc, updateDoc } from './FireBase'; // Import Firestore functions
import './css/ManageQuote.css'; // For custom styling
import { FaEye, FaTrash, FaEyeSlash } from 'react-icons/fa'; // Icons for view and delete

const ManageQuotePage = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedField, setSelectedField] = useState('name'); // Default field to search
    const [searchValue, setSearchValue] = useState('');
    const [filterGender, setFilterGender] = useState('all'); // Default filter value

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const quotesCollection = collection(db, 'quotes');
                const querySnapshot = await getDocs(quotesCollection);
                const quotesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setQuotes(quotesList);
            } catch (error) {
                console.error("Error fetching quotes: ", error);
            }
        };

        fetchQuotes();
    }, []);

    const toggleView = async (id) => {
        const quoteToUpdate = quotes.find(quote => quote.id === id);
        if (quoteToUpdate) {
            const updatedQuote = {
                ...quoteToUpdate,
                visible: !quoteToUpdate.visible,
                viewed: true
            };

            // Update Firestore
            try {
                await updateDoc(doc(db, 'quotes', id), {
                    visible: updatedQuote.visible,
                    viewed: updatedQuote.viewed
                });

                // Update local state
                setQuotes(prevQuotes =>
                    prevQuotes.map(quote =>
                        quote.id === id ? updatedQuote : quote
                    )
                );
            } catch (error) {
                console.error("Error updating quote: ", error);
            }
        }
    };

    const deleteQuote = async (id) => {
        try {
            await deleteDoc(doc(db, 'quotes', id));
            setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== id));
        } catch (error) {
            console.error("Error deleting quote: ", error);
        }
    };

    // Helper function to format dates
    const formatDate = (date) => {
        const day = String(date.day).padStart(2, '0');
        const month = String(date.month).padStart(2, '0');
        const year = date.year;
        return `${day}/${month}/${year}`;
    };

    // Helper function to get field value as string
    const getFieldValueAsString = (quote, field) => {
        if (field === 'dob') {
            return formatDate(quote.dob);
        } else if (field.includes('.')) {
            // Handle nested fields
            const [mainField, subField] = field.split('.');
            return quote[mainField] ? quote[mainField][subField] || '' : '';
        } else {
            // Handle top-level fields
            return quote[field] || '';
        }
    };

    // Filter quotes based on selected field and filter
    const filteredQuotes = quotes.filter(quote => {
        const fieldValue = getFieldValueAsString(quote, selectedField);
        const fieldValueStr = String(fieldValue).toLowerCase();

        // Check if the fieldValue contains the searchValue
        const matchesSearchValue = fieldValueStr.includes(searchValue.toLowerCase());
        const matchesGenderFilter = filterGender === 'all' || quote.gender === filterGender;

        return matchesSearchValue && matchesGenderFilter;
    });

    return (
        <div className="manage-quote-container">
            <h2>Manage Quotes</h2>
            <div className="search-filter">
                <div className="filter-controls">
                    <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="coverage">Coverage</option>
                        <option value="householdSize">Household Size</option>
                        <option value="income">Income</option>
                        <option value="gender">Gender</option>
                        <option value="zip">Zip</option>
                        <option value="dob">Date of Birth</option>
                        <option value="address">Address</option>
                        <option value="contact.email">Contact Email</option>
                        <option value="contact.phone">Contact Phone</option>
                    </select>
                    {selectedField === 'dob' ? (
                        <input
                            type="text"
                            placeholder="Search by dd/mm/yyyy"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    ) : (
                        <input
                            type="text"
                            placeholder={`Search by ${selectedField}...`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    )}

                </div>
            </div>
            <div className="quote-list">
                {filteredQuotes.map(quote => (
                    <div key={quote.id} className="quote-item">
                        <p className="quote-title">
                            {quote.name.firstName} {quote.name.lastName}
                        </p>
                        <div className="quote-actions">
                            <button onClick={() => toggleView(quote.id)} className="view-button">
                                {quote.visible ? 'Hide Details' : 'View Details'}
                            </button>
                            <button onClick={() => deleteQuote(quote.id)} className="delete-button">
                                <FaTrash />
                            </button>
                            {quote.viewed ? <FaEye className="viewed-icon" /> : <FaEyeSlash className="not-viewed-icon" />}
                        </div>
                        {quote.visible && (
                            <div className="quote-details">
                                <p><strong>Coverage:</strong> {quote.coverage}</p>
                                <p><strong>Household Size:</strong> {quote.householdSize}</p>
                                <p><strong>Income:</strong> {quote.income}</p>
                                <p><strong>Gender:</strong> {quote.gender}</p>
                                <p><strong>Date of Birth:</strong> {formatDate(quote.dob)}</p>
                                <p><strong>Address:</strong> {quote.address}</p>
                                <p><strong>Full Name:</strong> {quote.name.firstName} {quote.name.lastName}</p>
                                <p><strong>Contact Email:</strong> {quote.contact.email}</p>
                                <p><strong>Contact Phone:</strong> {quote.contact.phone}</p>
                                <p><strong>Zip Code:</strong> {quote.zip}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageQuotePage;
