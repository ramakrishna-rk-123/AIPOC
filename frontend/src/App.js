// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Components/LoginPage/LoginPage';
import SignupPage from './Components/SignupPage/SignupPage';
import TavilyAiPage from './Components/TavilyAiPage/TavilyAiPage.js';
import PdfLinks from './Components/FileUploadComponent/PdfLinkExtract/PdfLinks.js';
import Cookies from 'js-cookie';

function App() {
    const accessToken = Cookies.get('accessToken');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/tavily-ai" element={true ? <TavilyAiPage /> : <Navigate to="/login" />} />
                <Route path="/pdf-ai" element={true ? <PdfLinks /> : <Navigate to="/pdf" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
