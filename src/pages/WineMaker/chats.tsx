import React, { useEffect, useState } from 'react';
import '../../styles/chat.css';
import NavWineMaker from '../../components/NavWineMaker';
import { useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';
import { useBadWords } from '../../utils/badWordsContext'; // Importa el hook para el contexto de malas palabras
import winerLogo from '../../assets/winerlogo.png'; // Asegúrate de que el logo esté en el directorio adecuado

const Chats: React.FC = () => {
    const [rooms, setRooms] = useState<{ name: string; participants: string[] }[]>([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const { cleanText } = useBadWords(); // Accede a la función cleanText del contexto

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const userRooms = await chatService.getUserRooms(username || '');
                // Limpiar los nombres de las salas
                const cleanedRooms = userRooms.map((room: any) => ({
                    ...room,
                    name: cleanText(room.name), // Limpiar el nombre de la sala
                }));
                setRooms(cleanedRooms);
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
            }
        };

        fetchRooms();
    }, [username, cleanText]);

    const handleRoomClick = (roomName: string) => {
        localStorage.setItem('currentRoom', roomName);
        navigate(`/chatWM/${roomName}`);
    };

    return (
        <NavWineMaker>
            <div className="chat-container">
                {/* Contenedor que agrupa el logo y las salas */}
                <div className="chat-header">
                    <div className="logo-container">
                        <div className="login-image">
                            <img src={winerLogo} alt="WineR Logo" />
                        </div>
                    </div>
                    <h1 className="chat-title">Your Conversations</h1>
                </div>
                
                {/* Contenedor de las salas de chat */}
                <div className="chat-rooms">
                    {rooms.map((room, index) => {
                        const roomName = room.name;
                        const displayName = roomName.replace(username || '', '').replace('-', '');
                        return (
                            <div
                                key={index}
                                className="chat-room-card"
                                onClick={() => handleRoomClick(roomName)}
                            >
                                <h2 className="chat-room-title">{displayName}</h2>
                                <p className="chat-room-participants">
                                    Participants: {room.participants.join(', ')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </NavWineMaker>
    );
};

export default Chats;
