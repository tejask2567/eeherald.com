import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";

const UserAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Debounce the search function
  const debouncedSearch = debounce((term) => {
    setCurrentPage(1);
    fetchUserAnalytics(1, term);
  }, 300);

  // Function to fetch user analytics data from backend
  const fetchUserAnalytics = async (page, search = "") => {
    const login = localStorage.getItem("isLoggedIn");
    setLoading(true);
    if (login) {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/user-analytics",
          {
            headers: {
              isAdmin: true,
            },
            params: {
              page,
              limit,
              search: search,
            },
          }
        );
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user analytics:", error);
        setError("Error fetching user analytics");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUserAnalytics(newPage, searchTerm);
  };

  // Styles
  const buttonStyles = {
    base: {
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
    },
    secondary: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  const searchBarStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
      gap: "8px",
      padding: "8px",
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      width: "100%",
      maxWidth: "400px",
    },
    input: {
      border: "none",
      outline: "none",
      width: "100%",
      padding: "4px",
      fontSize: "14px",
    },
  };

  const paginationStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "white",
      borderTop: "1px solid #e5e7eb",
    },
    info: {
      fontSize: "14px",
      color: "#6b7280",
    },
  };

  const tableCellStyles = {
    base: {
      padding: "12px 24px",
      maxWidth: "200px", // Limit maximum width
      overflow: "hidden", // Hide overflow content
      textOverflow: "ellipsis", // Show ellipsis for overflow
      whiteSpace: "normal", // Allow text wrapping
      wordWrap: "break-word", // Break long words
      minWidth: "120px", // Ensure minimum width
      lineHeight: "1.5", // Improve readability
    },
    header: {
      padding: "12px 24px",
      textAlign: "left",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      fontWeight: "600",
      color: "#374151",
    },
  };

  if (loading && users.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "#dc2626",
        }}
      >
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>User Analytics</h1>
      </div>

      {/* Search Bar */}
      <div style={searchBarStyles.container}>
        <Search size={20} color="#6b7280" />
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchBarStyles.input}
        />
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            tableLayout: "fixed", // Add fixed table layout
          }}
        >
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={{ ...tableCellStyles.header, width: "15%" }}>
                User ID
              </th>
              <th style={{ ...tableCellStyles.header, width: "25%" }}>
                Username
              </th>
              <th style={{ ...tableCellStyles.header, width: "35%" }}>
                Viewed Article
              </th>
              <th style={{ ...tableCellStyles.header, width: "25%" }}>
                Viewed at
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userID}
                style={{ borderBottom: "1px solid #e5e7eb" }}
              >
                <td style={tableCellStyles.base}>{user.user_id}</td>
                <td style={tableCellStyles.base}>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.username}
                  </div>
                </td>
                <td style={tableCellStyles.base}>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.viewedArticle}
                  </div>
                </td>
                <td style={tableCellStyles.base}>{user.viewed_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={paginationStyles.container}>
          <div style={paginationStyles.info}>
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalPages)} of {totalPages} results
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                ...(currentPage === 1 ? buttonStyles.disabled : {}),
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                ...(currentPage === totalPages ? buttonStyles.disabled : {}),
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
