import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import '../../styles/friends.css';
import NavWineLover from '../../components/NavWineLover';

const Friends: React.FC = () => {
    const [friends, setFriends] = useState<string[]>([]);
    const [requests, setRequests] = useState<string[]>([]);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriendsAndRequests = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (!userId) throw new Error('User not authenticated');

                const { amigos, solicitudes } = await userService.getFriendsAndRequests(userId);
                setFriends(amigos);
                setRequests(solicitudes);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchFriendsAndRequests();
    }, []);

    const handleSendRequest = async () => {
        try {
            if (!newFriendUsername.trim()) throw new Error('Username cannot be empty');
            await userService.sendFriendRequest(newFriendUsername);
            alert(`Friend request sent to ${newFriendUsername}`);
            setNewFriendUsername('');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleAcceptRequest = async (username: string) => {
        try {
            await userService.acceptFriendRequest(username);
            setRequests((prev) => prev.filter((req) => req !== username));
            setFriends((prev) => [...prev, username]);
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

    return (
        <NavWineLover>
            <div className="friends-container">
                <h2 className="title-friends">Friends</h2>
                {error && <div className="error-message-friends">{error}</div>}

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
                                <li key={friend} className="friend-item-friends">
                                    {friend}
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
                                <li style={{ color: '#892e3e' }} key={request} className="friend-item-friends">
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
