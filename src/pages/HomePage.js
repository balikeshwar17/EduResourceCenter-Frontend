import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { useNavigate } from 'react-router-dom';

// Setting workerSrc for pdfjs to avoid loading issues
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const HomePage = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        college: '',
        department: '',
        course: '',
        semester: '',
        year: '',
        exam_type: ''
    });
    const [collegeInput, setCollegeInput] = useState('');
    const [collegeSuggestions, setCollegeSuggestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPapers();
    }, [filters, currentPage]);

    const fetchPapers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/papers`,
                {
                    params: { ...filters, page: currentPage },
                    withCredentials: true // Send cookies with the request
                }
            );
            console.log(response);
            if (response.data && response.data.data) {
                setPapers(response.data.data.papers);
                if(response.data.data.totalPages) setTotalPages(response.data.data.totalPages);
            } else {
                navigate('/');
                setPapers([]); // Clear papers if the response format is invalid
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Error fetching papers');
        }
    };

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [id]: value
        }));
    };

    const handleCollegeInputChange = (e) => {
        const value = e.target.value;
        setCollegeInput(value);
        if (value.trim()) {
            fetchCollegeSuggestions(value);
        } else {
            setCollegeSuggestions([]);
        }
        setFilters(prevFilters => ({
            ...prevFilters,
            college: value
        }));
    };

    const fetchCollegeSuggestions = async (query) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/papers/colleges?search=${query}`,
                {
                    withCredentials:true
                }
            );
            setCollegeSuggestions(response.data.data);
        } catch (error) {
            setError('Error fetching college suggestions');
        }
    };

    const handleCollegeSelect = (college) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            college: college
        }));
        setCollegeInput(college);
        setCollegeSuggestions([]);
    };

    const handleCollegeInputFocus = () => {
        if (collegeInput.trim()) {
            fetchCollegeSuggestions(collegeInput);
        }
    };

    const handleCollegeInputKeyPress = (e) => {
        if (e.key === 'Enter' && collegeSuggestions.length > 0) {
            handleCollegeSelect(collegeSuggestions[0]);
        }
    };

    const getLastSixYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
            years.push(i);
        }
        return years;
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    return (
        <Layout>
            <div className="home-page-container">
                <div className='filter-bar'>
                    <div className="filter-group">
                        <label htmlFor="college">Search College:</label>
                        <input
                            type="text"
                            id="college"
                            value={collegeInput}
                            placeholder="Search college..."
                            onChange={handleCollegeInputChange}
                            onKeyPress={handleCollegeInputKeyPress}
                            onFocus={handleCollegeInputFocus}
                        />
                        {collegeSuggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {collegeSuggestions.map((college, index) => (
                                    <li key={index} onClick={() => handleCollegeSelect(college)}>
                                        {college}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="filter-group">
                        <label htmlFor="department">Department:</label>
                        <select id="department" onChange={handleFilterChange}>
                            <option value="">Select department</option>
                            <option value="cse">CSE</option>
                            <option value="ece">ECE</option>
                            <option value="mech">Mechanical</option>
                            <option value="civil">Civil</option>
                            <option value="electrical">Electrical</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="course">Course:</label>
                        <select id="course" onChange={handleFilterChange}>
                            <option value="">Select course</option>
                            <option value="btech">B.Tech</option>
                            <option value="mtech">M.Tech</option>
                            <option value="msc">M.Sc</option>
                            <option value="mba">MBA</option>
                            <option value="phd">PhD</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="semester">Semester:</label>
                        <select id="semester" onChange={handleFilterChange}>
                            <option value="">Select semester</option>
                            {[...Array(10).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="year">Year:</label>
                        <select id="year" onChange={handleFilterChange}>
                            <option value="">Select year</option>
                            {getLastSixYears().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="exam_type">Exam Type:</label>
                        <select id="exam_type" onChange={handleFilterChange}>
                            <option value="">Select exam type</option>
                            <option value="midsem">Mid-Semester</option>
                            <option value="endsem">End-Semester</option>
                            <option value="quiz1">Quiz 1</option>
                            <option value="quiz2">Quiz 2</option>
                            <option value="assignment">Assignment</option>
                        </select>
                    </div>
                </div>
                <div className="papers-grid">
                    {papers.length > 0 ? (
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
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No papers found</p>
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

export default HomePage;
