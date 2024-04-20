import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ShowsSelection from '../components/ShowsSelection';

const BookMoviePage = () => {
  const { movieId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch cities:', error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Select a Show</h1>
        <div className="flex flex-col md:flex-row md:justify-around mb-8">
          <div className="mb-4 md:mb-0">
            <label className="block text-lg font-semibold mb-2">Select Date:</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Select City:</label>
            <select 
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <ShowsSelection movieId={movieId} selectedDate={selectedDate} selectedCity={selectedCity} />
      </div>
      <Footer />
    </>
  );
};

export default BookMoviePage;
