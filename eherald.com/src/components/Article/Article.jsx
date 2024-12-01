import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import placeholderImage from "../../assets/Images/placeholder.png";
import useAuth from "../../hooks/useAuth";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState("");
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Login to view article ");//no token 
          setIsLoading(false);
          return;
        }

        console.log("Fetching article with token:", token); // Debug log

        const response = await axios.get(
          `http://localhost:3000/home/article/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("API Response:", response.data); // Debug log

        if (response.data.article) {
          setArticle(response.data.article);
          setError(null);
        } else {
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("Error details:", error.response || error); // Debug log

        if (error.response?.status === 403) {
          setPreview(error.response.data.preview || "");
          setError("subscription_required");
        } else if (error.response?.status === 401) {
          setError("login_required");
        } else {
          setError("An error occurred while fetching the article");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="loading">Loading article...</div>;
  }

  if (error === "login_required") {
    return (
      <div className="error-container">
        <p>Please log in to read this article</p>
        <button 
          onClick={() => navigate("/login", { 
            state: { previousUrl: `/article/${id}` } 
          })}
          className="login-button"
        >
          Log In
        </button>
      </div>
    );
  }

  if (error === "subscription_required") {
    return (
      <div className="error-container">
        <div className="preview-section">
          <h2>{article?.["Article Title"]}</h2>
          <p>{preview}</p>
        </div>
        <div className="subscription-prompt">
          <p>This article requires a subscription to read in full</p>
          <button 
            onClick={() => navigate("/subscribe")}
            className="subscribe-button"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="error-container">
        <p>{error || "Article not found"}</p>
        <button 
          onClick={() => navigate("/login", { 
            state: { previousUrl: `/article/${id}` } 
          })}
          className="login-button"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <article className="article-container">
      <header className="article-header">
        <h1>{article["Article Title"]}</h1>
        <time dateTime={article["Date of Publication"]}>
          {formatDate(article["Date of Publication"])}
        </time>
      </header>

      {article.topstoryimagename && (
        <figure className="article-image-container">
          <img
            src={`/path/to/images/${article.topstoryimagename}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
            alt={article["Article Title"]}
            className="article-image"
          />
        </figure>
      )}

      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article["Description"] }}
      />
    </article>
  );
};

export default Article;