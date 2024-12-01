import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
const Login = () => {
  const { setAuth } = useAuth(); // Set auth context from your useAuth hook
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.previousUrl || "/";

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/auth/login", credentials);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("roles", response.data.row.roles);
        localStorage.setItem("username", response.data.row.username);
  
        setAuth({ 
          username: response.data.row.username, 
          roles: response.data.row.roles 
        });
  
        if (response.data.row.roles === "admin") {
          console.log("posting adminsession")
          await axios.post("http://localhost:3000/admin/setAdminSession", { 
            isAdmin: true 
          });
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      <p>
        Forgot your password? <a href="/forgot-password">Click here</a>
      </p>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      <p>
        Back to home <a href="/">Home</a>
      </p>
    </div>
  );
};

export default Login;
