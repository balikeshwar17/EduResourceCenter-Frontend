import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/Actions';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        // console.log(process.env.REACT_APP_BACKEND_URL);
        try {
            const url = formData.userType === 'user' 
                ? `${process.env.REACT_APP_BACKEND_URL}/api/users/login` 
                : `${process.env.REACT_APP_BACKEND_URL}/api/admins/login`;

            const response = await axios.post(url, formData, {
                withCredentials: true, // Send cookies with the request
                headers: {
                    'Content-Type': 'application/json', // Set content type header
                }
            });

            if (response.status === 200) {
                // Dispatch login action to Redux store
                console.log(response.data);
                dispatch(login(formData.userType));

                // Redirect based on user type
                navigate(formData.userType === 'user' ? '/' : '/admin');
            } else {
                alert('Credentials incorrect');
                setFormData({ email: '', password: '', userType: 'user' });
            }
        } catch (error) {
            if (error.response && error.response.status === 401 && error.response.data ) {
                if(error.response.data.notify) alert(error.response.data.notify);
                else alert(error.response.data.message);
            }
            else if (error.response && error.response.status === 404 && error.response.data ) {
                if(error.response.data.notify) alert(error.response.data.notify);
                else alert(error.response.data.message);
            }
             else {
                console.error(error); // Handle other errors
                alert('Login failed. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="userType-container">
                        <label>User Type:</label>
                        <select name="userType" value={formData.userType} onChange={handleChange} required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Login'}
                        </button>
                    </div>
                </form>
                <div className="register-link-container">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
