// src/components/ForgotPassword.jsx

import React, { useState } from 'react';
import './forgotPass.css'
const Forgot_password = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // API call to request password reset
            const response = await fetch('http://localhost:3000/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                alert('Password reset link has been sent to your email.');
            } else {
                alert('Failed to send reset link!');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className='btn' type="submit">Send Reset Link</button>
            </form>
            <a href="/login"><button className='btn' >Login</button></a>
        </div>
    );
};

export default Forgot_password;
