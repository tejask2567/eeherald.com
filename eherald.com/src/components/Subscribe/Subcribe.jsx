import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios directly
import "./subcribe.css";
const Subcribe = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    userType: "guest", // default to guest, can be changed based on subscription
    subscription: false, // default to no subscription
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value }); // Using e.target.name instead of e.target.username
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call to backend (FastAPI) to create the user using Axios
      const response = await axios.post(
        "http://localhost:3000/auth/subcribe",
        userData
      ); // Adjust the URL based on your backend API

      if (response.status === 201) {
        // Check for successful creation
        alert("Subcription successful!");
      } else {
        alert("Signup failed!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed! Please try again.");
    }
  };

  return (
    <>
      <section class="full-container products-list-page">
        <div class="container wrapper">
          <div class="brud-crumb">
            <span>
              <a href="/">Home</a>
              <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </span>
            <span class="text">Subscribe Newsletter</span>
          </div>
        </div>
      </section>
      <section class="full-container products-list">
        <div class="container wrapper login-wrapper">
          <div class="row">
            <div class="col-md-4 login-container min-height-container">
              <div class="app-heading subscribe-heading">
                Subscribe Newsletter
              </div>
              <div className="signup-container">
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
                  <button className="btn" type="submit">
                    Subcribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Subcribe;
