import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import '../../styles/friendProfile.css';
import NavWineLover from '../../components/NavWineLover';
import defaultProfileImage from '../../assets/winelover.png';

const FriendProfile: React.FC = () => {
    const { friendUsername } = useParams<{ friendUsername: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const friendProfile = await userService.getUserProfile(friendUsername || '');
                setProfile(friendProfile);
            } catch (err) {
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, [friendUsername]);

    const handleBackToFriends = () => {
        navigate('/friends'); // Redirige a la página de amigos
    };

    if (error) {
        return (
            <NavWineLover>
                <div className="profile-container">
                    <p className="error-message-profile">{error}</p>
                </div>
            </NavWineLover>
        );
    }

    if (!profile) {
        return (
            <NavWineLover>
                <div className="profile-container">
                    <p>Loading profile...</p>
                </div>
            </NavWineLover>
        );
    }

    return (
        <NavWineLover>
            <div className="profile-container">
                <button className="back-button" onClick={handleBackToFriends}>
                    ← Back to Friends
                </button>
                <img
                    src={defaultProfileImage}
                    alt="Profile"
                    className="profile-image"
                />
                <h1 className="profile-title">{profile.username}'s Profile</h1>
                <p className="profile-info">Name: {profile.name}</p>
                <p className="profile-info">Tipo: {profile.tipo}</p>
                <p className="profile-info">Number of Friends: {profile.amigos?.length || 0}</p>
            </div>
        </NavWineLover>
    );
};

export default FriendProfile;
