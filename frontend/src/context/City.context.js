// src/context/City.context.js
import { createContext, useState } from 'react';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState('Select City');

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
};
