import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookExperience } from '../services/api';

const Booking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        guests: 1,
        comments: '',
    });

    // Manejar cambios en inputs y textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Manejar cambios en select
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBooking = async () => {
        try {
            const response = await bookExperience(id || '', bookingData);
            console.log('Booking successful:', response.data);
            alert('Booking confirmed!');
        } catch (error) {
            console.error('Error booking experience:', error);
        }
    };

    return (
        <div>
            <h1>Booking</h1>
            <label>
                Select Date:
                <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Select Time:
                <select
                    name="time"
                    value={bookingData.time}
                    onChange={handleSelectChange}
                >
                    <option value="">Select a time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                </select>
            </label>
            <label>
                Number of Guests:
                <input
                    type="number"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    min={1}
                />
            </label>
            <label>
                Comments:
                <textarea
                    name="comments"
                    value={bookingData.comments}
                    onChange={handleInputChange}
                />
            </label>
            <button onClick={handleBooking}>Confirm Booking</button>
        </div>
    );
};

export default Booking;
