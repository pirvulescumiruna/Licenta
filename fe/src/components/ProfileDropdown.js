import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  return (
    <div className="profile-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={toggleDropdown} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <FaUserCircle size={24} style={{ marginRight: '8px' }} />
        <span>Profil</span>
      </div>
      {showDropdown && (
        <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleAdminClick}>Administrator</div>
          <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleUserClick}>Utilizator</div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
