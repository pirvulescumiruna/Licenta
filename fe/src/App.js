import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileDropdown from './components/ProfileDropdown';
import AdminPage from './components/AdminPage';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';
import './App.css';
import { FaHome } from 'react-icons/fa';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-title">
            <FaHome className="header-icon" />
            <h1 className="header-text">CliMate</h1>
          </div>
          <ProfileDropdown />
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />  {}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserProfile />} />
          {}
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;
