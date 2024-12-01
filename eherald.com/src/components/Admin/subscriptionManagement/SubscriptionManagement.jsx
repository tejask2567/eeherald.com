import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight, UserCheck, UserMinus } from 'lucide-react';
import debounce from 'lodash/debounce';

const SubscriptionManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null);

  // Debounce the search function
  const debouncedSearch = debounce((term) => {
    setCurrentPage(1);
    fetchUsers(1, term);
  }, 300);

  const fetchUsers = async (page, search) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/admin/subscriptions", {
        headers: {
          isAdmin: true,
        },
        params: {
          page: page,
          limit: itemsPerPage,
          user_id: search || undefined,
        },
      });
      setUsers(response.data.data);
      setTotal(response.data.total);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    debouncedSearch(searchUserId);
    return () => debouncedSearch.cancel();
  }, [searchUserId]);

  const handleSubscriptionAction = (user, newAction) => {
    setSelectedUser(user);
    setAction(newAction);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      await axios.put("http://localhost:3000/admin/subscriptions", 
        {
          user_id: selectedUser.id,
          is_subscribed: action === 'subscribe' ? 1 : 0,
        },
        {
          headers: {
            isAdmin: true,
          }
        }
      );
      fetchUsers(currentPage, searchUserId);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsers(newPage, searchUserId);
  };

  // Styles
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
    secondary: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    success: {
      backgroundColor: '#059669',
      color: 'white',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white',
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

  if (loading && users.length === 0) {
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Subscription Management</h1>
      </div>

      {/* Search Bar */}
      <div style={searchBarStyles.container}>
        <Search size={20} color="#6b7280" />
        <input
          type="text"
          placeholder="Search by User ID"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
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
              }}>User ID</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>Username</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>Email</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>Status</th>
              <th style={{ 
                padding: '12px 24px', 
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 24px' }}>{user.id}</td>
                <td style={{ padding: '12px 24px' }}>{user.username}</td>
                <td style={{ padding: '12px 24px' }}>{user.email}</td>
                <td style={{ padding: '12px 24px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.isSubscribed === 1 ? '#def7ec' : '#fde8e8',
                    color: user.isSubscribed === 1 ? '#03543f' : '#9b1c1c',
                    fontSize: '14px'
                  }}>
                    {user.isSubscribed === 1 ? "Subscribed" : "Not Subscribed"}
                  </span>
                </td>
                <td style={{ padding: '12px 24px' }}>
                  {user.isSubscribed === 1 ? (
                    <button
                      onClick={() => handleSubscriptionAction(user, 'unsubscribe')}
                      style={{
                        ...buttonStyles.base,
                        ...buttonStyles.danger,
                      }}
                    >
                      <UserMinus size={16} />
                      Remove Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscriptionAction(user, 'subscribe')}
                      style={{
                        ...buttonStyles.base,
                        ...buttonStyles.success,
                      }}
                    >
                      <UserCheck size={16} />
                      Add Subscription
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={paginationStyles.container}>
          <div style={paginationStyles.info}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} results
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                ...(currentPage === 1 ? buttonStyles.disabled : {})
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
                ...(currentPage === totalPages ? buttonStyles.disabled : {})
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
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
              Confirm {action === 'subscribe' ? 'Subscription' : 'Unsubscription'}
            </h2>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>
              Are you sure you want to {action === 'subscribe' ? 'add' : 'remove'} the subscription for {selectedUser?.username}?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{ ...buttonStyles.base, ...buttonStyles.secondary }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                style={{
                  ...buttonStyles.base,
                  ...(action === 'subscribe' ? buttonStyles.success : buttonStyles.danger)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;