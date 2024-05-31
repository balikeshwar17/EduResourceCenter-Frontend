import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import './PendingAccountPage.css';

const PendingAccountPage = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admins/pending-requests`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
            if (response.data && response.data.data) {
                setRequests(response.data.data.requests);
                if(response.data.data.totalPages>0) setTotalPages(response.data.data.totalPages);
            } else {
                setRequests([]);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Error fetching pending requests');
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };


    const handleAccept = async (adminId) => {
        setLoading({ ...loading, [adminId]: true });
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admins/accept/${adminId}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setRequests(requests.filter(request => request._id !== adminId));
            }
        } catch (error) {
            console.error('Error accepting admin:', error);
        } finally {
            setLoading({ ...loading, [adminId]: false });
        }
    };

    const handleDecline = async (adminId) => {
        setLoading({ ...loading, [adminId]: true });
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admins/decline/${adminId}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setRequests(requests.filter(request => request._id !== adminId));
            }
        } catch (error) {
            console.error('Error declining admin:', error);
        } finally {
            setLoading({ ...loading, [adminId]: false });
        }
    };

    return (
        <Layout>
            <div className="pending-account-page-container">
                <h2>Pending Requests</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="requests-grid">
                    {(requests && requests.length > 0) ? (
                        requests.map(request => (
                            <div key={request._id} className="request-item">
                                <div className="request-details">
                                    <h3>{request.name}</h3>
                                    <p>Username: {request.username}</p>
                                    <p>Email: {request.email}</p>
                                    <p>Contact: {request.contact}</p>
                                    <div className="buttons-container">
                                        <button
                                            className="accept-button"
                                            onClick={() => handleAccept(request._id)}
                                            disabled={loading[request._id]}
                                        >
                                            {loading[request._id] ? 'Processing...' : 'Accept'}
                                        </button>
                                        <button
                                            className="decline-button"
                                            onClick={() => handleDecline(request._id)}
                                            disabled={loading[request._id]}
                                        >
                                            {loading[request._id] ? 'Processing...' : 'Decline'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No pending requests</p>
                    )}
                </div>
                <div className="pagination-box">
                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="pagination-buttons">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PendingAccountPage;
