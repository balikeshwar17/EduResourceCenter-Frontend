import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPages/AdminPage';
import UploadPage from './pages/UploadPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import MyUploadPage from './pages/MyUploadPage';
import EditPaperPage from './pages/EditPaperPage';
import MyPendingPaperPage from './pages/AdminPages/MyPendingPaperPage';
import ProtectedRoute from './components/ProtectedRoute';
import VerifiedPaperPage from './pages/AdminPages/VerifiedPaperPage';
import PendingAccountPage from './pages/AdminPages/PendingAccountPage';
import './App.css';
import VerifiedAccountPage from './pages/AdminPages/VerifiedAccountPage';

const App = () => (
        <Router>
            <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/" element={<ProtectedRoute Component={HomePage} />} />
            <Route path="/upload" element={<ProtectedRoute Component={UploadPage} />} />
            <Route path="/my-papers" element={<ProtectedRoute Component={MyUploadPage}/>} />
            <Route path="/admin" element={<ProtectedRoute Component={AdminPage}/>} />
            <Route path="/my-pending-papers" element={<ProtectedRoute Component={MyPendingPaperPage}/>} />
            <Route path="/verified-accounts" element={<ProtectedRoute Component={VerifiedAccountPage}/>} />
            <Route path='/verified-papers' element={<VerifiedPaperPage/>}/>
            <Route path='/pending-accounts' element={<PendingAccountPage/>}/>
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
);

export default App;
