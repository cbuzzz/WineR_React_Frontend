import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/baselayout.css';

const NavWineLover: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/homeWineLover" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
          Search
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => (isActive ? 'active' : '')}>
          Bookings
        </NavLink>
      </div>
    </nav>
  );
};

export default NavWineLover;
