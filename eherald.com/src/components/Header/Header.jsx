import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../assets/application.css";
import logo from "../../assets/Images/eeherald-logo.png";
import header_ad from "../../assets/Images/header_ad.jpg";
import "./Header.css";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");
      const storedRoles = localStorage.getItem("roles");

      if (token && storedUsername && storedRoles) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setAuth({ username: storedUsername, roles: storedRoles });
        
        try {
          const response = await axios.get("http://localhost:3000/auth/profile");
          if (response.data.username) {
            setUsername(response.data.username);
            setAuth({
              username: response.data.username,
              roles: response.data.roles
            });
          }
        } catch (error) {
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };

    checkAuth();
  }, [setAuth]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setAuth({});
    navigate("/")
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery } });
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="full-container">
        <div className="header-wrapper container wrapper">
          <div className="row m-0">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-5 p-0">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="Eeherald logo" />
                </Link>
              </div>
            </div>
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-7 p-0">
              <nav className="navbar navbar-default">
                <div className="container-fluid p-0">
                  <div className="p-0 nav-top-bar">
                    {/* Existing navigation */}
                    <ul className="nav navbar-nav other-nav-links">
                      <li className={location.pathname === "/" ? "active" : ""}>
                        <Link to="/">Home</Link>
                      </li>
                      <li className={location.pathname === "/about" ? "active" : ""}>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li className={location.pathname === "/contact" ? "active" : ""}>
                        <Link to="/contact">Contact Us</Link>
                      </li>
                      <li className={location.pathname === "/advertise" ? "active" : ""}>
                        <Link to="/advertise">Advertise</Link>
                      </li>
                      <li className={location.pathname === "/subscribe" ? "active" : ""}>
                        <Link to="/subscribe">Subscribe Newsletter</Link>
                      </li>
                    </ul>

                    

                    {/* User Profile or Login/Sign-up Section */}
                    <ul className="nav navbar-nav navbar-right login">
                      {!isLoggedIn ? (
                        <li className="login-holder">
                          <Link className="login-btn" to="/login">
                            Login / Register
                          </Link>
                        </li>
                      ) : (
                        <li className="user-profile">
                          <span className="username-icon">
                            <i className="fa fa-user" aria-hidden="true"></i>
                            {username}
                          </span>
                          {auth?.roles === "admin" && (
                            <li className="admin-link">
                              <Link to="/admin">Admin</Link>
                            </li>
                          )}
                          <li>
                            <button className="logout-btn" onClick={handleLogout}>
                              Logout
                            </button>
                          </li>
                        </li>
                      )}
                    </ul>
                    <div className="closed-menu-icon js-menu-icon">
                      <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <div className="header-ad-wrapper">
              <img src={header_ad} alt="Header ad" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Rest of the header remains the same */}
      <section className="full-container main-header-wrapper">
        <div className="menu-wrapper container wrapper">
          <nav className="navbar navbar-default">
            <div className="container-fluid p-0">
              <div className="p-0">
                <ul className="nav navbar-nav main-menu">
                  <li>
                    <Link to="/news">NEWS</Link>
                  </li>
                  <li>
                    <Link to="/products">PRODUCTS</Link>
                  </li>
                  <li>
                    <Link to="/design-guides">DESIGN GUIDE</Link>
                  </li>
                  <li>
                    <Link to="/component-engg">COMPONENT ENG</Link>
                  </li>
                  <li>
                    <Link to="/students">STUDENT SECTION</Link>
                  </li>
                  <li>
                    <Link to="/events">EVENTS</Link>
                  </li>
                  <li>
                    <Link to="/whats-new">WHAT'S NEW</Link>
                  </li>
                </ul>
                {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-form">
                      <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      <button type="submit" className="search-button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </>
  );
};

export default Header;