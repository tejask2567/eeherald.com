import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import debounce from 'lodash/debounce';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Debounce the search function to avoid too many API calls
  const debouncedSearch = debounce((term) => {
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on search
    fetchNews(1, term);
  }, 300);

  useEffect(() => {
    fetchNews(1, '');
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const fetchNews = async (page, search) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/admin/dashboard', {
        headers: {
            isAdmin: true,
          },
        params: {
          page,
          limit: pagination.limit,
          search
        }
      });
      setNews(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
        limit: response.data.limit
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news');
      setLoading(false);
      console.error('Error fetching news:', err);
    }
  };

  const handlePageChange = (newPage) => {
    fetchNews(newPage, searchTerm);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (newsId) => {
    window.location.href = `/admin/edit/${newsId}`;
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/delete/${selectedNewsId}`,{headers: {
        isAdmin: true,
      },});
      setShowDeleteConfirm(false);
      fetchNews();
    } catch (err) {
      setError('Failed to delete news');
      console.error('Error deleting news:', err);
    }
  }

  const buttonStyles = {
    base: {
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  };

  const searchBarStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      gap: '8px',
      padding: '8px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
      width: '100%',
      maxWidth: '400px',
    },
    input: {
      border: 'none',
      outline: 'none',
      width: '100%',
      padding: '4px',
      fontSize: '14px',
    }
  };

  const paginationStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '16px',
      padding: '16px',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
    },
    info: {
      fontSize: '14px',
      color: '#6b7280',
    }
  };

  if (loading && news.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#dc2626' 
      }}>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>News Management</h1>
        <button 
          onClick={() => window.location.href = '/admin'}
          style={{ ...buttonStyles.base, ...buttonStyles.primary }}
        >
          <Plus size={16} />
          Add New Article
        </button>
      </div>

      {/* Search Bar */}
      <div style={searchBarStyles.container}>
        <Search size={20} color="#6b7280" />
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchTerm}
          onChange={handleSearch}
          style={searchBarStyles.input}
        />
      </div>

      {/* Table */}
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>News ID</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>Title</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'center',
                borderBottom: '1px solid #e5e7eb'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.NPNWID} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 24px' }}>{item.NPNWID}</td>
                <td style={{ padding: '12px 24px' }}>{item['Article Title']}</td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(item.NPNWID)}
                      style={{ ...buttonStyles.base, ...buttonStyles.secondary }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNewsId(item.NPNWID);
                        setShowDeleteConfirm(true);
                      }}
                      style={{ ...buttonStyles.base, ...buttonStyles.danger }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={paginationStyles.container}>
          <div style={paginationStyles.info}>
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                ...(pagination.currentPage === 1 ? buttonStyles.disabled : {})
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                ...(pagination.currentPage === pagination.totalPages ? buttonStyles.disabled : {})
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog - remains the same */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
              Are you sure?
            </h2>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>
              This action cannot be undone. This will permanently delete the news article.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ ...buttonStyles.base, ...buttonStyles.secondary }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ ...buttonStyles.base, ...buttonStyles.danger }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;