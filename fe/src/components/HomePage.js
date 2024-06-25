import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();  

  return (
    <div className="home-container">
      <h3>
      <h2>Bine ai venit la CliMate-ul tau!</h2>
      <button onClick={() => navigate('/admin')} className="nav-button">Administrator</button>
      <button onClick={() => navigate('/user')} className="nav-button">Utilizator</button>
      </h3>
    </div>
  );
}

export default HomePage;
