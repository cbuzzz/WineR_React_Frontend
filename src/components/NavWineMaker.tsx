import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/baselayout.css';

const NavWineMaker: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/homeWineMaker" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/createExperience" className={({ isActive }) => (isActive ? 'active' : '')}>
          Create Experience
        </NavLink>
      </div>
    </nav>
  );
};

export default NavWineMaker;
