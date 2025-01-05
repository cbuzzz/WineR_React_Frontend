import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import '../../styles/friends.css';
import NavWineLover from '../../components/NavWineLover';

const Friends: React.FC = () => {
    const [friends, setFriends] = useState<string[]>([]);
    const [requests, setRequests] = useState<string[]>([]);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchFriendsAndRequests = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (!userId) throw new Error('User not authenticated');

                const { amigos, solicitudes } = await userService.getFriendsAndRequests(userId);
                setFriends(amigos);
                setRequests(solicitudes);
            } catch (err) {
                setError('Username cannot be empty');
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        };

        fetchFriendsAndRequests();
    }, []);

    const handleSendRequest = async () => {
        setError('');
        setSuccess('');

        if (!newFriendUsername.trim()) {
            setError('Username cannot be empty');
            return;
        }

        try {
            await userService.sendFriendRequest(newFriendUsername);
            setSuccess(`Friend request sent to ${newFriendUsername}`);
            setNewFriendUsername(''); // Limpia el campo de texto
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            setError((err as Error).message);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const handleAcceptRequest = async (username: string) => {
        try {
            await userService.acceptFriendRequest(username);
            setRequests((prev) => prev.filter((req) => req !== username));
            setFriends((prev) => [...prev, username]);
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleRejectRequest = async (username: string) => {
        try {
            await userService.rejectFriendRequest(username);
            setRequests((prev) => prev.filter((req) => req !== username));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleRemoveFriend = async (username: string) => {
        try {
            await userService.removeFriend(username);
            setFriends((prev) => prev.filter((friend) => friend !== username));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleChat = async (friend: string) => {
        const roomName = [username, friend].sort().join('-'); // Crear un nombre único para la sala
        localStorage.setItem('currentRoom', roomName); // Guardar la sala en localStorage
        navigate(`/chat/${roomName}`); // Redirigir a la página de chats
    };

    return (
        <NavWineLover>
            <div className="friends-container">
                <h2 className="title-friends">Friends</h2>
                {error && <div className="error-message-friends">{error}</div>}
                {success && <div className="success-message-friends">{success}</div>}
                <div className="send-request-section">
                    <h3 className="section-title-friends">Send Friend Request</h3>
                    <input
                        type="text"
                        className="input-friends"
                        placeholder="Enter username"
                        value={newFriendUsername}
                        onChange={(e) => setNewFriendUsername(e.target.value)}
                    />
                    <button className="send-btn-friends" onClick={handleSendRequest}>
                        Send Request
                    </button>
                </div>

                <div className="friends-section">
                    <h3 className="section-title-friends">Your Friends</h3>
                    <ul className="list-friends">
                        {friends.length > 0 ? (
                            friends.map((friend) => (
                                <li style={{ color: '#892e3e', fontWeight: 'bold' }} key={friend} className="friend-item-friends">
                                    {friend}
                                    <button
                                        className="chat-btn-friends"
                                        onClick={() => handleChat(friend)}
                                    >
                                        Chat
                                    </button>
                                    <button
                                        className="remove-btn-friends"
                                        onClick={() => handleRemoveFriend(friend)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="no-items-friends">You have no friends yet.</p>
                        )}
                    </ul>
                </div>

                <div className="requests-section">
                    <h3 className="section-title-friends">Friend Requests</h3>
                    <ul className="list-friends">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <li style={{ color: '#892e3e', fontWeight: 'bold' }} key={request} className="friend-item-friends">
                                    {request}
                                    <button
                                        className="accept-btn-friends"
                                        onClick={() => handleAcceptRequest(request)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="reject-btn-friends"
                                        onClick={() => handleRejectRequest(request)}
                                    >
                                        Reject
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="no-items-friends">You have no friend requests.</p>
                        )}
                    </ul>
                </div>
            </div>
        </NavWineLover>
    );
};

export default Friends;
