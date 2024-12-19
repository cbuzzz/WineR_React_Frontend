import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../styles/chat.css';
import NavWineLover from '../../components/NavWineLover';

const Chat: React.FC = () => {
    const [socket, setSocket] = useState<any>(null);
    const [roomName, setRoomName] = useState<string>('');
    const [currentRoom, setCurrentRoom] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<number>(0);

    const username = localStorage.getItem('username');

    useEffect(() => {
        const newSocket = io('http://localhost:3000'); // Cambia al dominio del backend si es necesario
        setSocket(newSocket);

        newSocket.on('message-receive', (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        newSocket.on('previousMessages', (prevMessages: any[]) => {
            setMessages(prevMessages);
        });

        newSocket.on('connected-user', (count: number) => {
            setConnectedUsers(count);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleJoinRoom = () => {
        if (roomName.trim() && socket) {
            socket.emit('joinRoom', roomName);
            setCurrentRoom(roomName);
            setRoomName('');
        }
    };

    const handleSendMessage = () => {
        if (message.trim() && socket && currentRoom) {
            socket.emit('sendMessage', { roomName: currentRoom, message });
            setMessage('');
        }
    };

    return (
        <NavWineLover>
        <div className="chat-container">
            <div className="chat-header">
                <h1 className="chat-title">Chat</h1>
                <p className="chat-connected-users">Connected Users: {connectedUsers}</p>
            </div>
            <div className="chat-room">
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="chat-room-input"
                />
                <button onClick={handleJoinRoom} className="chat-join-room-btn">
                    Join Room
                </button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <span className="chat-message-content">{msg.content}</span>
                        <span className="chat-message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
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
        </div>
        </NavWineLover>
        
    );
};

export default Chat;
