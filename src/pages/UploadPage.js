import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const UploadPage = () => {
    const [paperData, setPaperData] = useState({
        paper_name: '',
        college: '',
        college_email: '',
        college_contact: '',
        course: '', // New state
        department: '', // New state
        semester: '', // New state
        exam_type: '',
        year: '',
        paper_file: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaperData({
            ...paperData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setPaperData({
            ...paperData,
            paper_file: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('paper_name', paperData.paper_name);
        formData.append('college', paperData.college);
        formData.append('college_email', paperData.college_email);
        formData.append('college_contact', paperData.college_contact);
        formData.append('course', paperData.course);
        formData.append('department', paperData.department);
        formData.append('semester', paperData.semester);
        formData.append('exam_type', paperData.exam_type);
        formData.append('year', paperData.year);
        formData.append('pdf', paperData.paper_file);

        try {
            console.log(formData);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/papers/upload`, formData,
             {
                withCredentials:true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful:', response.data);
            // Clear the form after successful upload
            setPaperData({
                paper_name: '',
                college: '',
                college_email: '',
                college_contact: '',
                course: '',
                department: '',
                semester: '',
                exam_type: '',
                year: '',
                paper_file: null // Clear the file input
            });

        //   use navigate to redirect to mypost page 

        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <Layout>
        <div className="upload-container">
            <h2 className="upload-title">Upload Paper</h2>
            <form className="upload-form" onSubmit={handleSubmit}>
                <label className="upload-label" htmlFor="paper_name">Paper Name:</label>
                <input className="upload-input" type="text" id="paper_name" name="paper_name" value={paperData.paper_name} onChange={handleChange} required />

                <label className="upload-label" htmlFor="college">College:</label>
                <input className="upload-input" type="text" id="college" name="college" value={paperData.college} onChange={handleChange} required />

                <label className="upload-label" htmlFor="college_email">College Email:</label>
                <input className="upload-input" type="email" id="college_email" name="college_email" value={paperData.college_email} onChange={handleChange} required />

                <label className="upload-label" htmlFor="college_contact">College Contact:</label>
                <input className="upload-input" type="tel" id="college_contact" name="college_contact" value={paperData.college_contact} onChange={handleChange} required />

                <label className="upload-label" htmlFor="course">Course:</label>
                <select className="upload-select" id="course" name="course" value={paperData.course} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    <option value="btech">B.Tech</option>
                    <option value="mtech">M.Tech</option>
                    <option value="bsc">B.Sc</option>
                </select>

                <label className="upload-label" htmlFor="department">Department:</label>
                <select className="upload-select" id="department" name="department" value={paperData.department} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    <option value="cse">Computer Science</option>
                    <option value="ece">Electronics and Communication Engineering</option>
                    <option value="ee">Electrical Engineering</option>
                    <option value="mech">Mechanical Engineering</option>
                </select>

                <label className="upload-label" htmlFor="semester">Semester:</label>
                <select className="upload-select" id="semester" name="semester" value={paperData.semester} onChange={handleChange} required>
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    {/* Add more options as needed */}
                </select>

                <label className="upload-label" htmlFor="exam_type">Exam Type:</label>
                <select className="upload-select" id="exam_type" name="exam_type" value={paperData.exam_type} onChange={handleChange} required>
                    <option value="">Select Exam Type</option>
                    <option value="quiz1">Quiz 1</option>
                    <option value="quiz2">Quiz 2</option>
                    <option value="midsem">Mid Semester</option>
                    <option value="endsem">End Semester</option>
                </select>

                <label className="upload-label" htmlFor="year">Year:</label>
                <input className="upload-input" type="number" id="year" name="year" value={paperData.year} onChange={handleChange} required />

                <label className="upload-label" htmlFor="paper_file">Upload Paper:</label>
                <input className="upload-input" type="file" id="paper_file" name="paper_file" onChange={handleFileChange} required />

                <button className="upload-button" type="submit">Upload</button>
            </form>
        </div>
        </Layout>
    );
};

export default UploadPage;
