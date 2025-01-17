import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import wineRLogo from '../assets/winerlogo.png';

interface BaseLayoutProps {
    children: ReactNode;
}

const NavWineMaker: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <div className="base-layout">
            <nav className="navbar">
                <img src={wineRLogo} alt="WineR Logo" className="nav-logo" />
                <div className="nav-links">
                    <NavLink to="/homeWineMaker" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                    <NavLink to="/createExperience" className={({ isActive }) => isActive ? 'active' : ''}>Create Experience</NavLink>
                    <NavLink to="/profileWineMaker" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
                    <NavLink to="/chatsWM" className={({ isActive }) => isActive ? 'active' : ''}>Chats</NavLink>
                </div>
            </nav>
            <main className="content">
                {children}
            </main>
        </div>
    );
};

export default NavWineMaker;