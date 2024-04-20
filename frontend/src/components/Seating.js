import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'; // Make sure to install axios if you haven't

const SeatingMap = () => {
  const movieDetails = {
    name: "Kung fu panda 4",
    time: "12:00 PM",
    date: "2024-04-08",
    multiplex: "Cineplex 1, Guwahati",
  };

  const rows = 5;
  const seatsPerRow = 12;
  const bookedSeats = ['1_5', '2_6', '3_7'];
  const prices = {
    low: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '1_8', '1_9', '1_10', '1_11', '1_12'],
    high: ['5_1', '5_2', '5_3', '5_4', '5_5', '5_6', '5_7', '5_8', '5_9', '5_10', '5_11', '5_12']
  };
  const priceMapping = { low: 200, medium: 220, high: 240 };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [email, setEmail] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else if (selectedSeats.length < ticketsToBook && !bookedSeats.includes(seatId)) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatPriceKey = Object.keys(prices).find(key => prices[key].includes(seat)) || 'medium';
      return total + priceMapping[seatPriceKey];
    }, 0);
  };

  const handleBookingConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-email', {
        to: email,
        subject: `Your Tickets for ${movieDetails.name}`,
        text: `Your tickets for ${movieDetails.name} on ${movieDetails.date} at ${movieDetails.time} are booked successfully. Seats: ${selectedSeats.join(", ")}. Total Amount: ${calculateTotalPrice()}`
      });
      setShowConfirmationModal(false);
      setShowFinalModal(true);
    } catch (error) {
      alert('Failed to send email.');
      console.error('Error sending email:', error);
    }
  };

  const renderSeat = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}_${seatIndex}`;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);
    const seatPriceKey = Object.keys(prices).find(key => prices[key].includes(seatId)) || 'medium';

    let bgColor = 'bg-gray-300 hover:bg-gray-400';
    if (isBooked) bgColor = 'bg-red-500 cursor-not-allowed';
    else if (isSelected) bgColor = 'bg-green-500';
    else if (seatPriceKey === 'low') bgColor = 'bg-yellow-200 hover:bg-yellow-300';
    else if (seatPriceKey === 'high') bgColor = 'bg-yellow-600 hover:bg-yellow-700';
    else bgColor = 'bg-yellow-400 hover:bg-yellow-500';

    return (
      <button
        key={seatId}
        disabled={isBooked}
        className={`w-8 h-8 m-1 ${bgColor}`}
        onClick={() => handleSeatClick(seatId)}
        aria-label={`Seat ${seatId}`}
      />
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">{movieDetails.name}</h1>
          <p>{movieDetails.multiplex}</p>
          <p>Date: {movieDetails.date} at {movieDetails.time}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="tickets" className="block font-medium">Number of tickets:</label>
          <input
            type="number"
            id="tickets"
            value={ticketsToBook}
            onChange={(e) => setTicketsToBook(parseInt(e.target.value, 10))}
            className="border p-2"
            min="1"
            max="6"
          />
        </div>
        <div className="grid grid-cols-12 gap-1 mb-4">
          {Array.from({ length: rows }).map((_, rowIndex) =>
            Array.from({ length: seatsPerRow }).map((_, seatIndex) =>
              renderSeat(rowIndex + 1, seatIndex + 1)
            )
          )}
        </div>
        <div className="mb-4">
          <p>Legend:</p>
          <div className="flex space-x-2">
            <div className="bg-yellow-200 w-6 h-6"></div><span>- 200</span>
            <div className="bg-yellow-400 w-6 h-6"></div><span>- 220</span>
            <div className="bg-yellow-600 w-6 h-6"></div><span>- 240</span>
            <div className="bg-red-500 w-6 h-6"></div><span>- Booked</span>
            <div className="bg-green-500 w-6 h-6"></div><span>- Selected</span>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handleBookingConfirmation}
        >
          Confirm Booking
        </button>
        {showConfirmationModal && (
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirm Your Email</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border p-2 w-full mb-4"
              />
              <p className="mb-4">Selected Seats: {selectedSeats.join(", ")}</p>
              <p className="mb-4">Total Amount: {calculateTotalPrice()}</p>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 w-full"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
        {showFinalModal && (
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Booking Successful</h2>
              <p>Your tickets have been emailed to you. Thank you!</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => window.location.href = '/'}
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SeatingMap;
