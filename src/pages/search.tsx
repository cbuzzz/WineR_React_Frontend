import React, { useState } from 'react';
import '../styles/search.css';

const Search: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false); // Estado para controlar el pop-up de filtros

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="search-container">
            {/* Cabecera */}
            <div className="search-header">
                <h1 className="search-title">Search</h1>
                <div className="search-actions">
                    <div className="search-bar">
                        <input type="text" placeholder="Where to?" />
                    </div>
                    <button className="filter-btn" onClick={toggleFilters}>
                        Filters
                    </button>
                </div>
            </div>

            {/* Contenedor del mapa */}
            <div className="map-container">
                <div className="mock-map">
                    {/* Simulación del mapa con pines */}
                    <p>Map Placeholder</p>
                    <div className="map-pin" style={{ top: '50%', left: '30%' }}></div>
                    <div className="map-pin" style={{ top: '60%', left: '50%' }}></div>
                    <div className="map-pin" style={{ top: '70%', left: '70%' }}></div>
                </div>
            </div>
            {/* Pop-up de Filtros */}
            {showFilters && (
                <div className="filters-popup">
                    <div className="filters-body">
                        <div className="filters-header">
                            <h2>Filters</h2>
                            <button className="close-btn" onClick={toggleFilters}>
                                &times;
                            </button>
                        </div>
                        <div className="filters-content">
                            {/* Price range */}
                            <div className="filter-section">
                                <h3>Price range</h3>
                                <div className="price-range">
                                    <div>
                                        <label>Minimum</label>
                                        <input type="number" placeholder="$100" />
                                    </div>
                                    <span>—</span>
                                    <div>
                                        <label>Maximum</label>
                                        <input type="number" placeholder="$520" />
                                    </div>
                                </div>
                            </div>

                            {/* Wine Experiences */}
                            <div className="filter-section">
                                <h3>Wine Experiences</h3>
                                <label>
                                    <input type="checkbox" /> Wine tasting
                                </label>
                                <label>
                                    <input type="checkbox" /> Vineyard walk
                                </label>
                                <label>
                                    <input type="checkbox" /> Winery tour
                                </label>
                                <label>
                                    <input type="checkbox" /> Food and Wine pairing
                                </label>
                            </div>

                            {/* Types of Wine */}
                            <div className="filter-section">
                                <h3>Types of Wine</h3>
                                <label>
                                    <input type="checkbox" /> Red Wine
                                </label>
                                <label>
                                    <input type="checkbox" /> White Wine
                                </label>
                                <label>
                                    <input type="checkbox" /> BioDynamic Wines
                                </label>
                                <label>
                                    <input type="checkbox" /> Sparkling Wines
                                </label>
                            </div>

                            {/* Level of knowledge */}
                            <div className="filter-section">
                                <h3>Level of knowledge</h3>
                                <label>
                                    <input type="checkbox" /> Beginner
                                </label>
                                <label>
                                    <input type="checkbox" /> Intermediate
                                </label>
                                <label>
                                    <input type="checkbox" /> Advanced
                                </label>
                                <label>
                                    <input type="checkbox" /> Expert
                                </label>
                            </div>

                            {/* Other */}
                            <div className="filter-section">
                                <h3>Other</h3>
                                <label>
                                    <input type="checkbox" /> Large groups
                                </label>
                                <label>
                                    <input type="checkbox" /> Restaurant
                                </label>
                            </div>
                        </div>
                        <div className="filters-footer">
                            <button className="clear-btn">Clear filters</button>
                            <button className="apply-btn" onClick={toggleFilters}>
                                Apply filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
