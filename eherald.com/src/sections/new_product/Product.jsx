import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import placeholderImage from "../../assets/Images/placeholder.png";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Page number state
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const articlesPerPage = 50; // Limit of 50 articles per page
  const [ ID ,setID]=useState('');
  // Fetch paginated articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/home/product-all", {
          params: {
            page: currentPage,
            limit: articlesPerPage,
          },
        });

        setArticles(response.data.articles); // Store the articles for the current page
        setTotalPages(response.data.totalPages); // Total number of pages
        setID(response.data.ID)
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [currentPage]); // Fetches articles again when currentPage changes

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const placeHolderTitle='No Title'
  // Function to generate truncated page numbers
  const getTruncatedPageNumbers = () => {
    const totalNumbers = 5; // Maximum number of page links to display (excluding ellipses)
    const pageNumbers = [];

    // If total pages are less than the total numbers, just return all page numbers
    if (totalPages <= totalNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      // Always include the first and last page
      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers around the current page
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

  return (
    <div className="news-page-container">
      {/* Main content (news articles) */}
      <div className="news-section">
        <h2>Product News</h2>
        <div className="article-list">
          {articles.map((article, index) => (
            <ArticleRow
              key={index}
              title={article["Article Title"] || placeHolderTitle}
              description={article["Description"]}
              image={article.image || placeholderImage}
              date={article["Date of Publication"]}
              route={`/article/${ID}`}
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
      </div>

      {/* Google Ads Section */}
      <div className="google-ads-section">
        <div className="google-ad">Google Ad 1</div>
        <div className="google-ad">Google Ad 2</div>
      </div>
    </div>
  );
};

// Reusable component to render each article in a row
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

// Helper function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default News;
