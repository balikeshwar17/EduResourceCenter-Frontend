import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

// Setting workerSrc for pdfjs to avoid loading issues
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MyPendingPaperPage = () => {
    const [papers, setPapers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/papers/my-pending-papers'`, {
                withCredentials: true
            });
            console.log(response);
            if (response.data && response.data.data) {
                setPapers(response.data.data.papers);
                if(response.data.data.totalPages>0){
                    setTotalPages(response.data.data.totalPages);
                }
            } else {
                setPapers([]); // Clear papers if the response format is invalid
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Error fetching papers');
        }
    };

    const handleValid = async (paperId) => {
        console.log(paperId);
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/api/papers/valid/${paperId}`, 
                {}, 
                { 
                    withCredentials: true // Send cookies with the request
                }
            );
            console.log(response);
            if (response.status === 200) {
                setPapers(papers.filter(paper => paper._id !== paperId));
            }
        } catch (error) {
            console.error('Error validating paper:', error);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handleInvalid = async (paperId) => {
        try {
            const response=await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/papers/invalid/${paperId}`, 
            { withCredentials: true }
          );
          console.log(response);
            if(response.status===200){
                setPapers(papers.filter(paper => paper._id !== paperId));
            }
        } catch (error) {
            console.error('Error invalidating paper:', error);
        }
    };

    const handleRemove = async (paperId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/papers/remove/${paperId}`, { withCredentials: true });
            setPapers(papers.filter(paper => paper._id !== paperId));
        } catch (error) {
            console.error('Error removing paper:', error);
        }
    };

    return (
        <Layout>
            <div className="home-page-container">
                <h2>Pending Papers For Verification</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="papers-grid">
                    {papers.length > 0 && (
                        papers.map(paper => (
                            <div key={paper._id} className="paper-item">
                                <div className="pdf-container">
                                    <a href={paper.paper_link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                                        <Document file={paper.paper_link} onLoadError={(error) => console.error('Error while loading document:', error)}>
                                            <Page pageNumber={1} width={250} className="pdf-thumbnail" />
                                        </Document>
                                    </a>
                                </div>
                                <div className="paper-details">
                                    <h3>{paper.paper_name}</h3>
                                    <p>College: {paper.college}</p>
                                    <p>Course: {paper.course}</p>
                                    <p>Department: {paper.department}</p>
                                    <p>Exam Type: {paper.exam_type}</p>
                                    <p>Year: {paper.year}</p>
                                    <p className={paper.status_of_verification ? 'status-verified' : 'status-not-verified'}>
                                        Status: {paper.status_of_verification ? 'Verified' : 'Not Verified'}
                                    </p>
                                    <div className="buttons-container">
                                        <button className="valid-button" onClick={() => handleValid(paper._id)}>Valid</button>
                                        <button className="invalid-button" onClick={() => handleInvalid(paper._id)}>Invalid</button>
                                        <button className="delete-button" onClick={() => handleRemove(paper._id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
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

export default MyPendingPaperPage;
