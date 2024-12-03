import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/search.css';
import wineRLogo from '../assets/winerlogo.png';

const Search: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="search-container">

            <div className="search-header">
                <h1>Search</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Where to?" />
                </div>
                <button className="filter-btn">Filters</button>
            </div>

            <div className="map-container">
                {/* Aquí podrías insertar un mapa interactivo en el futuro */}
                <div className="mock-map">
                    <p>Map Placeholder</p>
                    {/* Simulación de pins en el mapa */}
                    <div className="map-pin" style={{ top: '50px', left: '100px' }}></div>
                    <div className="map-pin" style={{ top: '150px', left: '200px' }}></div>
                    <div className="map-pin" style={{ top: '200px', left: '250px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Search;

