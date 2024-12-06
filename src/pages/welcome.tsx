import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';
import winerLogo from '../assets/winerlogo.png';
import wineLoverLogo from '../assets/winelover.png';
import wineMakerLogo from '../assets/winemaker.png';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    const handleChoice = (role: string) => {
        if (role === 'WineLover') {
            navigate('/loginWineLover'); // Navega a la página de login para WineLovers
        } else if (role === 'WineMaker') {
            navigate('/loginWineMaker'); // Puedes personalizar esta ruta para WineMakers
        }
    };

    return (
        <div className="welcome-container">
            <h1>Welcome to WineR!</h1>
            <img
                src={winerLogo}
                alt="WineR Logo"
                className="logo"
            />
            <p>Please choose your profile:</p>
            <div className="options">
                <div
                    className="option wine-lover"
                    onClick={() => handleChoice('WineLover')}
                >
                    <img
                        src={wineLoverLogo}
                        alt="Wine Lover Icon"
                    />
                    <p>WineLover</p>
                </div>
                <div
                    className="option wine-maker"
                    onClick={() => handleChoice('WineMaker')}
                >
                    <img
                        src={wineMakerLogo}
                        alt="Wine Maker Icon"
                    />
                    <p>WineMaker</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
