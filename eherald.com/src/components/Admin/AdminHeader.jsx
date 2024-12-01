import React from 'react'
import { Link ,useNavigate} from "react-router-dom";
import logo from "../../assets/Images/eeherald-logo.png";
import './AdminHeader.css'
import useAuth from '../../hooks/useAuth';
const AdminHeader = () => {
  const { auth, setAuth } = useAuth();
  let username=localStorage.getItem('username');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    setAuth({});
    navigate("/")
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/admin">
            <img src={logo} alt="EEherald Logo" />
          </Link>
        </div>
        <span className="username">Welcome admin, {username}</span>
        <div className="admin-info">
          
          <nav className="admin-nav">
            <Link to="/admin/new-management">Edit News</Link>
            <Link to="/admin/user-analytics">User Analytics</Link>
            <Link to="/admin/article-analytics">Article Analytics</Link>
            <Link to="/admin/Subscription-Management">Subscription Management</Link>
            <Link to="/">User Page</Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader