import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import debounce from 'lodash/debounce';

const ArticleAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('');

    // Debounce the search function
    const debouncedSearch = debounce((term) => {
        setCurrentPage(1); // Reset to first page on search
        fetchData(1, term);
    }, 300);

    const fetchData = async (page, search) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/admin/article-analytics`, {
                headers: {
                    isAdmin: true,
                },
                params: {
                    page: page,
                    limit: itemsPerPage,
                    search: search,
                    sort: sort
                },
            });
            setAnalyticsData(response.data.data);
            setTotal(response.data.total);
            setLoading(false);
        } catch (error) {
            setError("Error fetching article analytics");
            setLoading(false);
            console.error("Error fetching article analytics:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage, searchTerm);
    }, [currentPage, sort]);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(total / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    if (loading && analyticsData.length === 0) {
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Article Analytics</h1>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {/* Search Bar */}
                <div style={searchBarStyles.container}>
                    <Search size={20} color="#6b7280" />
                    <input
                        type="text"
                        placeholder="Search by Article ID"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={searchBarStyles.input}
                    />
                </div>

                {/* Sort Dropdown */}
                <select 
                    onChange={handleSortChange} 
                    value={sort}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        fontSize: '14px',
                    }}
                >
                    <option value="">No sort</option>
                    <option value="asc">Sort by Total Users Ascending</option>
                    <option value="desc">Sort by Total Users Descending</option>
                </select>
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
                            }}>Article ID</th>
                            <th style={{ 
                                padding: '12px 24px', 
                                textAlign: 'left',
                                borderBottom: '1px solid #e5e7eb'
                            }}>Total Users</th>
                            <th style={{ 
                                padding: '12px 24px', 
                                textAlign: 'left',
                                borderBottom: '1px solid #e5e7eb'
                            }}>User IDs</th>
                            <th style={{ 
                                padding: '12px 24px', 
                                textAlign: 'left',
                                borderBottom: '1px solid #e5e7eb'
                            }}>Usernames</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analyticsData.length > 0 ? (
                            analyticsData.map((article) => (
                                <tr key={article.article_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 24px' }}>{article.article_id}</td>
                                    <td style={{ padding: '12px 24px' }}>{article.total_users}</td>
                                    <td style={{ padding: '12px 24px' }}>{article.user_ids}</td>
                                    <td style={{ padding: '12px 24px' }}>{article.usernames}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '12px 24px', textAlign: 'center' }}>
                                    No data available
                                </td>
                            </tr>
                        )}
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
        </div>
    );
};

export default ArticleAnalytics;