// src/components/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios directly
import './signup.css';

const Signup = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone:'',
        password: '',
        userType: 'guest', // default to guest, can be changed based on subscription
        subscription: false // default to no subscription
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value }); // Using e.target.name instead of e.target.username
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // API call to backend (FastAPI) to create the user using Axios
            const response = await axios.post('http://localhost:3000/auth/register', userData); // Adjust the URL based on your backend API

            if (response.status === 201) { // Check for successful creation
                alert('Signup successful!, Please verify email');
                navigate('/login');
            } else {
                alert('Signup failed!');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Signup failed! Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className='btn' type="submit">Sign Up</button>
            </form>
            <a href="/login"><button className='btn'>Login</button></a>
        </div>
    );
};

export default Signup;
