import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import '../../styles/friendProfile.css';
import NavWineMaker from '../../components/NavWineMaker';
import defaultProfileImage from '../../assets/winelover.png';
import { User } from '../../models/userModel';

const ParticipantProfile: React.FC = () => {
    const { participantUsername } = useParams<{ participantUsername: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [participant, setParticipant] = useState<User>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const participantProfile = await userService.getUserProfile(participantUsername || '');
                setParticipant(participant);
                setProfile(participantProfile);
            } catch (err) {
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, [participantUsername]);

    if (error) {
        return (
            <NavWineMaker>
                <div className="profile-container">
                    <p className="error-message-profile">{error}</p>
                </div>
            </NavWineMaker>
        );
    }

    if (!profile) {
        return (
            <NavWineMaker>
                <div className="profile-container">
                    <p>Loading profile...</p>
                </div>
            </NavWineMaker>
        );
    }

    return (
        <NavWineMaker>
            <div className="profile-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                <img
                    src={participant?.image || defaultProfileImage}
                    className="profile-picture"
                />
                <h1 className="profile-title">{profile.username}'s Profile</h1>
                <p className="profile-info">Name: {profile.name}</p>
                <p className="profile-info">Tipo: {profile.tipo}</p>
                <p className="profile-info">Number of Friends: {profile.amigos?.length || 0}</p>
            </div>
        </NavWineMaker>
    );
};

export default ParticipantProfile;