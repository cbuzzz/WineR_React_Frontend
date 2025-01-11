import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../../styles/chat.css';
import NavWineMaker from '../../components/NavWineMaker';
import chatService from '../../services/chatService';

const Chat: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const [socket, setSocket] = useState<any>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('message-receive', (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (roomName) {
            socket?.emit('joinRoom', roomName);
            const fetchMessages = async () => {
                try {
                    const previousMessages = await chatService.getMessagesFromRoom(roomName);
                    setMessages(previousMessages);
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                }
            };

            fetchMessages();
        }
    }, [roomName, socket]);

    const handleSendMessage = () => {
        if (message.trim() && roomName) {
            const newMessage = {
                roomName,
                username,
                content: message,
            };
            socket.emit('sendMessage', newMessage);
            setMessage('');
        }
    };

    return (
        <NavWineMaker>
            <div className="chat-container">
                <h1 className="chat-title">Chat: {roomName?.replace(username || '', '').replace('-', '')}</h1>
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
            </div>
        </NavWineMaker>
    );
};

export default Chat;
