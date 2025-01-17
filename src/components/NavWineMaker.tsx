import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import wineRLogo from '../assets/winerlogo.png';
import '../styles/baselayout.css';

interface BaseLayoutProps {
    children: ReactNode;
}

const NavWineMaker: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <div className="base-layout">
            <nav className="navbar">
                <img src={wineRLogo} alt="WineR Logo" className="nav-logo" />
                <div className="nav-links">
                    <NavLink to="/homeWineMaker" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink>
                    <NavLink to="/createExperience" className={({ isActive }) => isActive ? 'active' : ''}>CREATE EXPERIENCE</NavLink>
                    <NavLink to="/createWine" className={({ isActive }) => isActive ? 'active' : ''}>CREATE WINE</NavLink>
                    <NavLink to="/profileWineMaker" className={({ isActive }) => isActive ? 'active' : ''}>PROFILE</NavLink>
                    <NavLink to="/chatsWM" className={({ isActive }) => isActive ? 'active' : ''}>CHATS</NavLink>
                </div>
            </nav>
            <main className="content">
                {children}
            </main>
        </div>
    );
};

export default NavWineMaker;