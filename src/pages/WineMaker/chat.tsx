import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../../styles/chat.css';
import NavWineMaker from '../../components/NavWineMaker';
import chatService from '../../services/chatService';
import { useBadWords } from '../../utils/badWordsContext';  // Importa el hook para el contexto de malas palabras

const Chat: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const [socket, setSocket] = useState<any>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const username = localStorage.getItem('username');
    const { cleanText } = useBadWords();  // Accede a la función cleanText del contexto

    useEffect(() => {
        // const newSocket = io('http://apiwiner.duckdns.org:5000');
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('message-receive', (newMessage: any) => {
            // Limpiar el mensaje recibido antes de añadirlo a los mensajes
            newMessage.content = cleanText(newMessage.content);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [cleanText]);

    useEffect(() => {
        if (roomName) {
            socket?.emit('joinRoom', roomName);
            const fetchMessages = async () => {
                try {
                    const previousMessages = await chatService.getMessagesFromRoom(roomName);
                    // Limpiar los mensajes anteriores antes de mostrarlos
                    const cleanedMessages = previousMessages.map((msg: any) => ({
                        ...msg,
                        content: cleanText(msg.content),
                    }));
                    setMessages(previousMessages);
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                }
            };

            fetchMessages();
        }
    }, [roomName, socket, cleanText]);

    const handleSendMessage = () => {
        if (message.trim() && roomName) {
            // Limpiar el mensaje antes de enviarlo
            const cleanedMessage = cleanText(message);
            const newMessage = {
                roomName,
                username,
                content: cleanedMessage,
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
