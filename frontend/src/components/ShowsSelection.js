import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowsSelection = ({ selectedDate, selectedCity }) => {
  const [shows, setShows] = useState([]);
  const navigate =useNavigate();

  useEffect(() => {
    // Reset shows when the city or date changes
    setShows([]);

    // Check if the selected city is 'Guwahati' and the date is '2024-04-08'
    if (selectedCity === 'Guwahati' && selectedDate === '2024-04-08') {
      // Hardcoded show data
      const hardcodedShows = [{
        show_id: 1,
        multiplex_name: 'Cineplex 1',
        address: 'G S Road, Guwahati',
        screen_number: 1,
        start_time: '12:00:00'
      }];
      setShows(hardcodedShows);
    }
  }, [selectedCity, selectedDate]);

  if (shows.length === 0) return <div>No shows available for the selected criteria.</div>;

  const handleBookShow = (showId) => {
    // Placeholder for navigation functionality
     navigate('/book-seat/1'); 
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Available Shows:</h2>
      {shows.map(show => (
        <div key={show.show_id} className="p-4 m-2 bg-gray-100 rounded-lg shadow">
          <p className="text-md font-bold">{show.multiplex_name}</p>
          <p>{show.address}</p>
          <p>Screen: {show.screen_number}</p>
          <p>Start Time: {show.start_time}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => handleBookShow(show.show_id)}
          >
            Book Show
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShowsSelection;
