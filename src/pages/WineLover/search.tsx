import React, { useEffect, useState } from 'react';
import '../../styles/search.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import experienceService from '../../services/experienceService';
import { Experience } from '../../models/experienceModel';
import { getCoordinates } from '../../utils/geocoding';
import NavWineLover from '../../components/NavWineLover';  // Importar NavWineLover

// Fix marker icon compatibility
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Search: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false); // Estado para controlar el pop-up de filtros
    const [experiences, setExperiences] = useState<(Experience & { coordinates?: [number, number] })[]>([]);
    const [inputAddress, setInputAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([41.3874, 2.1686]); // Default to Barcelona

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    useEffect(() => {
        // Fetch user location
        const fetchUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                        setUserCoordinates(coords);
                        setMapCenter(coords); // Center map on user's location
                    },
                    (err) => {
                        console.error('Error fetching user location:', err);
                        setUserCoordinates(null); // User location unavailable
                    }
                );
            }
        };

        // Fetch experiences and geocode their locations
        const fetchExperiencesWithCoordinates = async () => {
            try {
                const data = await experienceService.getAllExperiences();

                // Geocode each experience location
                const experiencesWithCoordinates = await Promise.all(
                    data.map(async (experience) => {
                        try {
                            const coordinates = await getCoordinates(experience.location); // Use imported utility
                            return { ...experience, coordinates };
                        } catch (err) {
                            console.error(`Failed to fetch coordinates for ${experience.location}:`, err);
                            return { ...experience }; // Skip if coordinates not found
                        }
                    })
                );

                setExperiences(experiencesWithCoordinates);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            }
        };

        fetchUserLocation();
        fetchExperiencesWithCoordinates();
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    const handleSearch = async () => {
        try {
            if (inputAddress) {
                const coords = await getCoordinates(inputAddress); // Use imported utility
                setMapCenter(coords);
            }
        } catch (err) {
            setError('Failed to find location.');
        }
    };

    if (!mapCenter) {
        return <p>Loading map...</p>;
    }

    return (
        <NavWineLover>  {/* Envuelve todo el contenido dentro de NavWineLover */}
            <div className="search-container">
                {/* Cabecera */}
                <div className="search-header">
                    <h1 className="search-title">Find experiences near you!</h1>
                    <div className="search-actions">
                        <div className="search-bar">
                            <input
                                type="text"
                                value={inputAddress}
                                onChange={(e) => setInputAddress(e.target.value)}
                                placeholder="Where to?"
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                        <button className="filter-btn" onClick={toggleFilters}>
                            Filters
                        </button>
                    </div>
                </div>

                {/* Contenedor del mapa */}
                <div className="map-container">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '600px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        {/* User Location Marker */}
                        {userCoordinates && (
                            <Marker position={userCoordinates}>
                                <Popup>Your Location</Popup>
                            </Marker>
                        )}
                        {/* Experience Markers */}
                        {experiences.map(
                            (exp, index) =>
                                exp.coordinates && (
                                    <Marker key={index} position={exp.coordinates}>
                                        <Popup>
                                            <strong>{exp.title}</strong>
                                            <p>{exp.location}</p>
                                        </Popup>
                                    </Marker>
                                )
                        )}
                    </MapContainer>
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
        </NavWineLover>
    );
};

export default Search;
