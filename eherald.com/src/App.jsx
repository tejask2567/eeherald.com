import { useState } from "react";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import LayoutOuter from "./components/Layout/LayoutOuter";
import Missing from "./components/Missing/Missing";
//user imports
import LayoutHeaderFooter from "./components/Layout/LayoutHeaderFooter";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Forgot_password from "./components/forgot-password/Forgot_password";
import RequestPasswordReset from "./components/forgot-password/RequestPasswordReset";
import ResetPassword from "./components/forgot-password/ResetPassword";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Advertise from "./components/Advertise/Advertise";
import Subcribe from "./components/Subscribe/Subcribe";
import Article from "./components/Article/Article";
import { Verify_email } from "./components/login/verify_email";
import SearchResults from "./components/Header/search"
//section imports
import News from "./sections/News/News";
import Product from "./sections/new_product/Product";
import Engg from "./sections/Engineering_students/Engg";

//Admin Imports
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./components/Admin/Dashboard";
import UserAnalytics from "./components/Admin/userAnalytics/UserAnalytics";
import ArticleAnalytics from "./components/Admin/articleAnalytics/AricleAnalytics";
import SubscriptionManagement from "./components/Admin/subscriptionManagement/SubscriptionManagement";
import EditArticle from "./components/Admin/EditArticle";
import RequireAuth from "./features/RequireAuth";

import axios from "axios";
import NewsManagement from "./components/Admin/newsMaganement/NewsManagement";
function App() {
  const ROLES = {
    User: "user",
    Editor: "editor",
    Admin: "admin",
  };

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return (
    <Routes>
      <Route path="/" element={<LayoutOuter />}>
        {/* Public Routes */}
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<Verify_email />} />
        
        <Route path="/" element={<LayoutHeaderFooter />}>
          {/* User Routes */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Advertise" element={<Advertise />} />
          <Route path="/Subscribe" element={<Subcribe />} />
          <Route path="/news" element={<News />} />
          <Route path="/products" element={<Product />} />
          <Route path="/students" element={<Engg />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
        {/*header footer layout*/}

        {/* Admin Routes 
       
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<Dashboard/>}/>
          </Route>
        </Route>
          */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="user-analytics" element={<UserAnalytics />} />
            <Route path="article-analytics" element={<ArticleAnalytics />} />
            <Route path="new-management" element={<NewsManagement/>}/>
            <Route path="edit/:id" element={<EditArticle/>}/>
      
            <Route
              path="Subscription-Management"
              element={<SubscriptionManagement />}
            />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
      {/*Outer layout*/}
    </Routes>
  );
}

export default App;
