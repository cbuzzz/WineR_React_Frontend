import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import wineRLogo from '../assets/winerlogo.png';
import '../styles/baselayout.css';

interface BaseLayoutProps {
    children: ReactNode;
}

const NavWineLover: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <div className="base-layout">
            <nav className="navbar">
                <img src={wineRLogo} alt="WineR Logo" className="nav-logo" />
                <div className="nav-links">
                    <NavLink to="/homeWineLover" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink>
                    <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>SEARCH</NavLink>
                    <NavLink to="/booking" className={({ isActive }) => isActive ? 'active' : ''}>BOOKINGS</NavLink>
                    <NavLink to="/friends" className={({ isActive }) => isActive ? 'active' : ''}>FRIENDS</NavLink>
                    <NavLink to="/profileWineLover" className={({ isActive }) => isActive ? 'active' : ''}>PROFILE</NavLink>
                    <NavLink to="/chatsWL" className={({ isActive }) => isActive ? 'active' : ''}>CHATS</NavLink>
                </div>
            </nav>
            <main className="content">
                {children}
            </main>
        </div>
    );
};

export default NavWineLover;