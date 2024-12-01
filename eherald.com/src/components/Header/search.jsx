import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./search.css"; // Import the existing news CSS
import placeholderImage from "../../assets/Images/placeholder.png";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 50;
  const location = useLocation();

  useEffect(() => {
    const searchQuery = location.state?.query;
    
    const fetchSearchResults = async () => {
      if (!searchQuery) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/home/search`, {
          params: {
            query: searchQuery,
            page: currentPage,
            limit: articlesPerPage
          }
        });
        
        setSearchResults(response.data.articles);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results');
        setSearchResults([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.state?.query, currentPage]);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to generate truncated page numbers (same as in News component)
  const getTruncatedPageNumbers = () => {
    const totalNumbers = 5;
    const pageNumbers = [];

    if (totalPages <= totalNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading) return <div>Loading search results...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-page-container">
      <div className="news-section">
        <h2>Search Results for "{location.state?.query}"</h2>
        
        {searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <div className="article-list">
              {searchResults.map((article, index) => (
                <ArticleRow
                  key={index}
                  title={article["Article Title"] || "No Title"}
                  description={article["Description"]}
                  image={article.image || placeholderImage}
                  date={article["Date of Publication"]}
                  route={`/article/${article.ID}`}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="pagination">
              {getTruncatedPageNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() => number !== "..." && handlePageChange(number)}
                  className={number === currentPage ? "active-page" : ""}
                  disabled={number === "..."}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Google Ads Section */}
      <div className="google-ads-section">
        <div className="google-ad">Google Ad 1</div>
        <div className="google-ad">Google Ad 2</div>
      </div>
    </div>
  );
};

// Reusable component to render each article in a row (same as in News component)
const ArticleRow = ({ title, description, image, date, route }) => {
  const formattedDate = formatDate(date);

  return (
    <div className="article-row" onClick={() => (window.location.href = route)}>
      <img src={image} alt={title} className="article-image" />
      <div className="article-details">
        <div className="article-date">{formattedDate}</div>
        <h3 className="article-title">{title}</h3>
        <div className="article-description">{description}</div>
      </div>
    </div>
  );
};

// Helper function to format the date (same as in News component)
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default SearchResults;