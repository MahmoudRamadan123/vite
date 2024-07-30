import React, { useState, useEffect } from 'react';
import { db, storage, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, ref, uploadBytes, getDownloadURL } from './FireBase'; // Import Firebase functions
import './css/ManagePlanPage.css'; // For custom styling

function ManagePlanPage() {
    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        zip: '',
        planName: '',
        imageUrl: '',
        imageFile: null
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansRef = collection(db, 'plans');
                const querySnapshot = await getDocs(plansRef);
                const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPlans(plansData);
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, []);

    const openPopup = (plan = null) => {
        setCurrentPlan(plan);
        setFormData({
            zip: plan ? plan.zip : '',
            planName: plan ? plan.planName : '',
            imageUrl: plan ? plan.imageUrl : '',
            imageFile: null
        });
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setCurrentPlan(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, imageFile: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.imageUrl;

        if (formData.imageFile) {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `images/${formData.imageFile.name}`);
            await uploadBytes(storageRef, formData.imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const planData = {
            zip: formData.zip,
            planName: formData.planName,
            imageUrl
        };

        if (currentPlan) {
            // Update existing plan
            const planRef = doc(db, 'plans', currentPlan.id);
            await updateDoc(planRef, planData);
        } else {
            // Add new plan
            await addDoc(collection(db, 'plans'), planData);
        }

        const updatedPlans = await getDocs(collection(db, 'plans'));
        const plansData = updatedPlans.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);
        closePopup();
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'plans', id));
        const updatedPlans = await getDocs(collection(db, 'plans'));
        const plansData = updatedPlans.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);
    };

    return (
        <div className="manage-plan-page">
            <header className="page-header">
                <h1>Manage Plans</h1>
                <button className="btn btn-primary" onClick={() => openPopup()}>Add New Plan</button>
            </header>

            <div className="plans-container">
                {plans.map(plan => (
                    <div key={plan.id} className="plan-card">
                        <div className="plan-card-header">
                            <h2 className="plan-name">Plan Name: {plan.planName}</h2>
                            <h3 className="plan-zip">ZIP: {plan.zip}</h3>
                        </div>
                        {plan.imageUrl && (
                            <div className="plan-image">
                                <img src={plan.imageUrl} alt="Plan" className="plan-image-img" />
                            </div>
                        )}
                        <div className="plan-actions">
                            <button className="btn btn-secondary" onClick={() => openPopup(plan)}>Update</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(plan.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>{currentPlan ? 'Update Plan' : 'Add New Plan'}</h2>
                        <form onSubmit={handleSubmit} className="plan-form">
                            <div className="form-group">
                                <label htmlFor="planName">Plan Name</label>
                                <input
                                    type="text"
                                    id="planName"
                                    name="planName"
                                    value={formData.planName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip">ZIP Code</label>
                                <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL or File</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="Enter image URL"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">{currentPlan ? 'Update Plan' : 'Add Plan'}</button>
                                <button type="button" className="btn btn-secondary" onClick={closePopup}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagePlanPage;
