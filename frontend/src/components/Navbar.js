import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiChevronDown, BiMenu, BiSearch } from 'react-icons/bi';
import LoginModal from './LoginModal';
import { TfiVideoClapper } from 'react-icons/tfi';

function NavMd() {
  return (
    <>
      <div className="w-full flex items-center gap-3 bg-white px-3 py-1 rounded-md">
        <BiSearch />
        <input
          type="search"
          className="w-full bg-transparent border-none focus:outline-none"
          placeholder="Search for movies"
        />
      </div>
    </>
  );
}



function NavLg({ cities, selectedCity, onSelectCity }) {
  return (
    <>
      <div className="container flex mx-auto px-4 items-center justify-between">
        <div className="flex items-center w-1/2 gap-3">
          <div className="w-10 h-10">
            <TfiVideoClapper className="w-full h-full text-white"/>
          </div>
          <div className="w-full flex items-center gap-3 bg-white px-3 py-1 rounded-md">
            <BiSearch />
            <input
              type="search"
              className="w-full bg-transparent border-none focus:outline-none"
              placeholder="Search for movies"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 relative"> {/* Set position relative */}
          <div>
            <span className="text-gray-200 text-base flex items-center cursor-pointer hover:text-white">
              {selectedCity} <BiChevronDown />
            </span>
            <select
              onChange={(e) => onSelectCity(e.target.value)}
              className=" absolute top-full mt-1 w-full rounded border border-gray-300 bg-white shadow-lg z-10" // Apply z-index and other styling
              style={{ left: '50%', transform: 'translateX(-50%)' }} // Center the dropdown
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <LoginModal/>
          <div className="w-8 h-8 text-white">
            <BiMenu className="w-full h-full" />
          </div>
        </div>
      </div>
    </>
  );
}

const Navbar = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Select City');

  useEffect(() => {
    // Fetch cities from your backend
    axios.get('http://localhost:5000/api/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => console.error('Failed to fetch cities:', error));
  }, []);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
  };

  return (
    <nav className="bg-darkBackground-700 px-4 py-3">
      {/* Medium Screen Size */}
      <div className="hidden md:flex lg:hidden">
        <NavMd />
      </div>
      {/* Large Screen Size */}
      <div className="hidden lg:flex">
        <NavLg cities={cities} selectedCity={selectedCity} onSelectCity={handleSelectCity} />
      </div>
    </nav>
  );
};

export default Navbar;