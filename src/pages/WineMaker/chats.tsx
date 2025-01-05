import React, { useEffect, useState } from 'react';
import '../../styles/chat.css';
import NavWineMaker from '../../components/NavWineMaker';
import { useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';

const Chats: React.FC = () => {
    const [rooms, setRooms] = useState<{ name: string }[]>([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const userRooms = await chatService.getUserRooms(username || '');
                setRooms(userRooms);
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
            }
        };

        fetchRooms();
    }, [username]);

    const handleRoomClick = (roomName: string) => {
        localStorage.setItem('currentRoom', roomName);
        navigate(`/chatWM/${roomName}`);
    };

    return (
        <NavWineMaker>
            <div className="chat-container">
                <h1 className="chat-title">Your Conversations</h1>
                <div className="chat-rooms">
                    {rooms.map((room, index) => {
                        const roomName = room.name;
                        const displayName = roomName.replace(username || '', '').replace('-', '');
                        return (
                            <div
                                key={index}
                                className="chat-room-item"
                                onClick={() => handleRoomClick(roomName)}
                            >
                                {displayName}
                            </div>
                        );
                    })}
                </div>
            </div>
        </NavWineMaker>
    );
};

export default Chats;
