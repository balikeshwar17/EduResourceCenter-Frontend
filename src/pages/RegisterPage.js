import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../redux/Actions';

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize useDispatch hook
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userType: 'user', // Default value
        username: '',
        email: '',
        password: '',
        contact: '',
        college: '',
        course: '',
        department: '',
        semester: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        // console.log(formData);
        try {
            const url = formData.userType === 'user'
                ? `${process.env.REACT_APP_BACKEND_URL}/api/users/register`
                : `${process.env.REACT_APP_BACKEND_URL}/api/admins/register`;

                const response = await axios.post(url, formData, {
                    withCredentials: true, // Send cookies with the request
                    headers: {
                        'Content-Type': 'application/json', // Set content type header
                    }
                });
            
            if (response.status === 201) {
                const role=formData.userType;
                if(formData.userType==='user'){
                    dispatch(login(formData.userType));
                    navigate('/');
                }
                else{
                alert('Registered Successfully! Account will go on a verification process.')
                setFormData({
                    userType:role,
                    username: '',
                    email: '',
                    password: '',
                    contact: '',
                    college: '',
                    course: '',
                    department: '',
                    semester: ''
                });
            }
            } else {
                // Check if response contains error message
                if (response.data && response.data.message) {
                    alert(response.data.message);
                } else {
                    alert('Registration failed. Please try again.');
                }
                setFormData({ ...formData, password: '' }); // Clear password field
            }

        } catch (error) {
            // Check if error is an Axios error
        if (error.response && error.response.status === 409 && error.response.data ) {
            if(error.response.data.notify) alert(error.response.data.notify);
            else alert(error.response.data.message);
        } else {
            console.error(error); // Handle other errors
            alert('Registration failed. Please try again.');
        }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-form-wrapper">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>User Type:</label>
                        <select name="userType" value={formData.userType} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Contact:</label>
                        <input type="number" name="contact" value={formData.contact} onChange={handleChange} required />
                    </div>
                    {formData.userType === 'user' && (
                        <>
                            <div>
                                <label>College:</label>
                                <input type="text" name="college" value={formData.college} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Course:</label>
                                <select name="course" value={formData.course} onChange={handleChange} required>
                                    <option value="">Select Course</option>
                                    <option value="btech">B.Tech</option>
                                    <option value="mtech">M.Tech</option>
                                    <option value="msc">M.Sc</option>
                                    <option value="mba">MBA</option>
                                    <option value="phd">PhD</option>
                                </select>
                            </div>
                            <div>
                                <label>Department:</label>
                                <select name="department" value={formData.department} onChange={handleChange} required>
                                    <option value="">Select Department</option>
                                    <option value="cse">CSE</option>
                                    <option value="ece">ECE</option>
                                    <option value="ee">EE</option>
                                    <option value="me">Mining</option>
                                    <option value="mech">Mechanical</option>
                                </select>
                            </div>
                            <div>
                                <label>Semester:</label>
                                <select name="semester" value={formData.semester} onChange={handleChange} required>
                                    <option value="">Select Semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>
                <div className="login-link-container">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
