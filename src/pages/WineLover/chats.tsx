import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../styles/chat.css';
import NavWineLover from '../../components/NavWineLover';
import chatService from '../../services/chatService';

const Chat: React.FC = () => {
    const [socket, setSocket] = useState<any>(null);
    const [rooms, setRooms] = useState<{ name: string }[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    // const [connectedUsers, setConnectedUsers] = useState<number>(0);

    const username = localStorage.getItem('username');

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

    useEffect(() => {
        const storedRoom = localStorage.getItem('currentRoom');
        if (storedRoom) {
            setCurrentRoom(storedRoom);
        }

        const newSocket = io('http://localhost:3000'); // Cambia al dominio del backend si es necesario
        setSocket(newSocket);

        newSocket.on('message-receive', (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket?.emit('joinRoom', currentRoom);
            const fetchMessages = async () => {
                try {
                    const previousMessages = await chatService.getMessagesFromRoom(currentRoom);
                    setMessages(previousMessages);
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                }
            };

            fetchMessages();
        }
    }, [currentRoom, socket]);

    const handleSendMessage = () => {
        if (message.trim() && currentRoom) {
            const newMessage = {
                roomName: currentRoom,
                username: username, // Nombre del usuario
                content: message, // Contenido del mensaje
            };
            socket.emit('sendMessage', newMessage); // Enviar el mensaje al backend
            setMessage(''); // Limpiar el campo de entrada
        }
    };




    return (
        <NavWineLover>
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
                                onClick={() => setCurrentRoom(roomName)}
                            >
                                {displayName}
                            </div>
                        );
                    })}
                </div>
                {currentRoom && (
                    <>
                        <h2>Room: {currentRoom}</h2>
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className="chat-message">
                                    <span className="chat-message-username">{msg.username}:</span>{' '}
                                    <span className="chat-message-content">{msg.content}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message"
                                className="chat-message-input"
                            />
                            <button onClick={handleSendMessage} className="chat-send-message-btn">
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </NavWineLover>

    );
};

export default Chat;
