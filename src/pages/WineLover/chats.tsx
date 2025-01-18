import React, { useEffect, useState } from 'react';
import '../../styles/chat.css';
import NavWineLover from '../../components/NavWineLover';
import { useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';
import { useBadWords } from '../../utils/badWordsContext';  // Importa el hook para el contexto de malas palabras

const Chats: React.FC = () => {
    const [rooms, setRooms] = useState<{ name: string }[]>([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const { cleanText } = useBadWords();  // Accede a la función cleanText del contexto

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
        navigate(`/chatWL/${roomName}`);
    };

    return (
        <NavWineLover>
            <div className="chat-container">
                <h1 className="chat-title">Your Conversations</h1>
                <div className="chat-rooms">
                    {rooms.map((room, index) => {
                        const roomName = room.name;
                        // Limpiar el nombre de la sala antes de mostrarlo
                        const cleanedRoomName = cleanText(roomName);
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
        </NavWineLover>
    );
};

export default Chats;
