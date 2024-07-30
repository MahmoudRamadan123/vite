import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/QuestionsPage.css';
import { db, collection, addDoc } from './FireBase';

const Questions = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const location = useLocation();
    const [answers, setAnswers] = useState({
        coverage: '',
        householdSize: '',
        income: '',
        gender: '',
        dob: { day: '', month: '', year: '' },
        address: '',
        name: { firstName: '', lastName: '' },
        contact: { email: '', phone: '+961' },
        zip: ''
    });
    const [errors, setErrors] = useState({});

    const questions = [
        {
            id: 1,
            text: 'Are you looking for individual or family coverage?',
            type: 'radio',
            options: ['Individual', 'Family'],
            key: 'coverage'
        },
        {
            id: 2,
            text: "What's your household size?",
            type: 'select',
            options: ['1', '2', '3', '4', '5', '6+'],
            key: 'householdSize'
        },
        {
            id: 3,
            text: "What's your household income?",
            type: 'text',
            key: 'income'
        },
        {
            id: 4,
            text: "What's your gender?",
            type: 'radio',
            options: ['Male', 'Female'],
            key: 'gender'
        },
        {
            id: 5,
            text: "What's your date of birth?",
            type: 'date',
            key: 'dob'
        },
        {
            id: 6,
            text: "What's your home address?",
            type: 'text',
            key: 'address'
        },
        {
            id: 7,
            text: "What's your full name?",
            type: 'name',
            key: 'name'
        },
        {
            id: 8,
            text: "Thanks for your information! Where do we send your quote?",
            type: 'contact',
            key: 'contact'
        }
    ];

    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const zip = params.get('zip');
        if (zip) {
            setAnswers(prevAnswers => ({ ...prevAnswers, zip }));
        }
    }, [location]);
    const validateDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        const isValidDate = date.getDate() === parseInt(day) && date.getMonth() === month - 1 && date.getFullYear() === parseInt(year);
        const age = new Date().getFullYear() - date.getFullYear();
        return isValidDate && age >= 18;
    };

    const validatePhone = (phone) => {
        // Ensure the phone number starts with +961 and is followed by 8 digits
        return /^\+961\d{8}$/.test(phone);
    };

    const handleInputChange = (e, questionKey) => {
        const { value } = e.target;
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionKey]: value
        }));
        validateField(questionKey, value);
    };

    const handleRadioChange = (value, questionKey) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionKey]: value
        }));
        validateField(questionKey, value);
    };

    const handleDateChange = (e, unit) => {
        const { value } = e.target;
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            dob: {
                ...prevAnswers.dob,
                [unit]: value
            }
        }));
        if (unit === 'day' || unit === 'month' || unit === 'year') {
            validateDate(answers.dob.day, answers.dob.month, answers.dob.year);
        }
    };

    const handleNameChange = (e, field) => {
        const { value } = e.target;
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            name: {
                ...prevAnswers.name,
                [field]: value
            }
        }));
        validateField('name', answers.name);
    };

    const handleContactChange = (e, field) => {
        const { value } = e.target;
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            contact: {
                ...prevAnswers.contact,
                [field]: value
            }
        }));
        validateField('contact', answers.contact);
    };

    const validateField = (key, value) => {
        let error = '';

        switch (key) {
            case 'dob':
                const { day, month, year } = answers.dob;
                if (!validateDate(day, month, year)) {
                    error = 'Invalid date or age. Must be at least 18 years old.';
                }
                break;
            case 'income':
                if (!/^\d+(\.\d{1,2})?(\$|L\.L)$/.test(value)) {
                    error = 'Income must be a number ending with $ or L.L';
                }
                break;
            case 'address':
                if (value.trim() === '') {
                    error = 'Address cannot be empty.';
                }
                break;
            case 'contact':
                const { email, phone } = answers.contact;
                if (!/^\S+@\S+\.\S+$/.test(email)) {
                    error = 'Invalid email address.';
                } else if (!validatePhone(phone)) {
                    error = 'Phone number must be 8 digits starting with +961.';
                }
                break;
            case 'name':
                const { firstName, lastName } = answers.name;
                if (firstName.trim() === '' || lastName.trim() === '') {
                    error = 'Full name cannot be empty.';
                }
                break;
            default:
                if (value.trim() === '') {
                    error = 'This field cannot be empty.';
                }
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [key]: error
        }));
    };

    const handleNext = () => {
        if (!validateCurrentQuestion()) {
            return;
        }
        setCurrentQuestion(prev => (prev < questions.length - 1 ? prev + 1 : prev));
    };

    const handleBack = () => {
        setCurrentQuestion(prev => (prev > 0 ? prev - 1 : prev));
    };

    const validateCurrentQuestion = () => {
        const currentKey = questions[currentQuestion].key;
        const currentValue = answers[currentKey];

        if (questions[currentQuestion].type === 'date') {
            const { day, month, year } = answers.dob;
            return validateDate(day, month, year);
        }

        if (questions[currentQuestion].type === 'contact') {
            const { email, phone } = answers.contact;
            return /^\S+@\S+\.\S+$/.test(email) && validatePhone(phone);
        }

        if (currentValue === '' || errors[questions[currentQuestion].key]) {
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (Object.values(answers).every(value => value !== '') && Object.values(errors).every(error => error === '')) {
            try {
                const quotesRef = collection(db, 'quotes');
                await addDoc(quotesRef, {
                    ...answers,
                    timestamp: new Date()
                });
                setAnswers({
                    coverage: '',
                    householdSize: '',
                    income: '',
                    gender: '',
                    dob: { day: '', month: '', year: '' },
                    address: '',
                    name: { firstName: '', lastName: '' },
                    contact: { email: '', phone: '+961' },
                     zip: ''
                });
                setCurrentQuestion(0);
                navigate('/thank-you');
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Failed to submit quote. Please try again.');
            }
        } else {
            alert('Please fill in all fields correctly.');
        }
    };

    return (
        <div className="questions-page">
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
            </div>
            <div className="question-container">
                <h2 className="question-text">{questions[currentQuestion].text}</h2>
                {questions[currentQuestion].type === 'radio' && (
                    <div className="radio-buttons">
                        {questions[currentQuestion].options.map(option => (
                            <button
                                key={option}
                                className={`radio-button ${answers[questions[currentQuestion].key] === option ? 'selected' : ''}`}
                                onClick={() => handleRadioChange(option, questions[currentQuestion].key)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {questions[currentQuestion].type === 'select' && (
                    <select
                        className="select-box"
                        value={answers[questions[currentQuestion].key]}
                        onChange={(e) => handleInputChange(e, questions[currentQuestion].key)}
                    >
                        {questions[currentQuestion].options.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
                {questions[currentQuestion].type === 'text' && (
                    <input
                        type="text"
                        className="text-input"
                        value={answers[questions[currentQuestion].key]}
                        onChange={(e) => handleInputChange(e, questions[currentQuestion].key)}
                        placeholder={questions[currentQuestion].text}
                    />
                )}
                {questions[currentQuestion].type === 'date' && (
                    <div className="date-inputs">
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={answers.dob.day}
                            onChange={(e) => handleDateChange(e, 'day')}
                            placeholder="Day"
                        />
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={answers.dob.month}
                            onChange={(e) => handleDateChange(e, 'month')}
                            placeholder="Month"
                        />
                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={answers.dob.year}
                            onChange={(e) => handleDateChange(e, 'year')}
                            placeholder="Year"
                        />
                    </div>
                )}
                {questions[currentQuestion].type === 'name' && (
                    <div className="name-inputs">
                        <input
                            type="text"
                            className="text-input"
                            value={answers.name.firstName}
                            onChange={(e) => handleNameChange(e, 'firstName')}
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            className="text-input"
                            value={answers.name.lastName}
                            onChange={(e) => handleNameChange(e, 'lastName')}
                            placeholder="Last Name"
                        />
                    </div>
                )}
                {questions[currentQuestion].type === 'contact' && (
                    <div className="contact-inputs">
                        <input
                            type="email"
                            className="text-input"
                            value={answers.contact.email}
                            onChange={(e) => handleContactChange(e, 'email')}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            className="text-input"
                            value={answers.contact.phone}
                            onChange={(e) => handleContactChange(e, 'phone')}
                            placeholder="Phone (+961...)"
                        />
                    </div>
                )}
                {errors[questions[currentQuestion].key] && (
                    <p className="error-message">{errors[questions[currentQuestion].key]}</p>
                )}
                <div className="navigation-buttons">
                    {currentQuestion > 0 && <button className="nav-button" onClick={handleBack}>Back</button>}
                    {currentQuestion < questions.length - 1 ? (
                        <button className="nav-button" onClick={handleNext}>Next</button>
                    ) : (
                        <button className="nav-button" onClick={handleSubmit}>Submit</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questions;
