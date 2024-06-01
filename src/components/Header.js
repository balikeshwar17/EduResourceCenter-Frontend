import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/Actions';
import axios from 'axios';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const userType = useSelector((state) => state.user);

    const onLogout = async () => {
        try {
            const url = userType === 'user' 
                ? `${process.env.REACT_APP_BACKEND_URL}/api/users/logout` 
                : `${process.env.REACT_APP_BACKEND_URL}/api/admins/logout`;

            const response=await axios.post(url, {}, { withCredentials: true });
            if(response.status===200){
                dispatch(logout());
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header>
            {userType === 'user' && (
                <h1><Link to="/">EduResourceCenter</Link></h1>
            )}
            {isAuthenticated && userType === 'admin' && (
                <nav>
                    <ul>
                        <li><Link to="/admin">Admin Dashboard</Link></li>
                        <li><Link to="/pending-accounts">Account Approval Request</Link></li>
                        <li><Link to="/verified-accounts">Verified Accounts</Link></li>
                        <li><Link to="/my-pending-papers">Pending Verification</Link></li>
                        <li><Link to="/verified-papers">Verified Papers</Link></li>
                        <li><button onClick={onLogout}>Logout</button></li>
                    </ul>
                </nav>
            )}
            {isAuthenticated && userType === 'user' && (
                <nav>
                    <ul>
                        <li><Link to="/upload">Upload</Link></li>
                        <li><Link to="/my-papers">My Upload</Link></li>
                        <li><button onClick={onLogout}>Logout</button></li>
                    </ul>
                </nav>
            )}
            {!isAuthenticated && (
                <nav>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
