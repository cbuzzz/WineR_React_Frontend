import React, { ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import wineRLogo from '../assets/winerlogo.png';
import '../styles/baselayout.css';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isWineMaker, setIsWineMaker] = useState(false);
  const [isWineLover, setIsWineLover] = useState(false);
  const navigate = useNavigate();

  // Verificamos el tipo de usuario en el localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      if (user.tipo === 'wineMaker') {
        setIsWineMaker(true);
      } else if (user.tipo === 'wineLover') {
        setIsWineLover(true);
      }
    } else {
      // Redirige si no hay usuario logueado
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="base-layout">
      <nav className="navbar">
        <img src={wineRLogo} alt="WineR Logo" className="nav-logo" />
        <div className="nav-links">
          {/* Menú común para ambos tipos de usuario */}
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>

          {/* Menú específico para WineLover */}
          {isWineLover && (
            <>
              <NavLink to="/homeWineLover" className={({ isActive }) => isActive ? 'active' : ''}>Home WineLover</NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>Search</NavLink>
              <NavLink to="/booking" className={({ isActive }) => isActive ? 'active' : ''}>Bookings</NavLink>
            </>
          )}

          {/* Menú específico para WineMaker */}
          {isWineMaker && (
            <>
              <NavLink to="/homeWineMaker" className={({ isActive }) => isActive ? 'active' : ''}>Home WineMaker</NavLink>
              <NavLink to="/createExperience" className={({ isActive }) => isActive ? 'active' : ''}>Create Experience</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
            </>
          )}
        </div>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;
