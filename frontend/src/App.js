import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/Home.Page";
import RegisterPage from './components/RegisterPage';
import MoviePage from './pages/Movie.Page';
import SeeAll from './pages/SeeAll';
import BookMoviePage from './pages/BookShow';
import { CityProvider } from './context/City.context';
import SeatingMap from './components/Seating';
//import MoviePage from "./pages/Movie.Page";
//import PlayPage from "./pages/Play.Page";
//import ErrorPage from "./pages/404";






function App() {
  return (
    <CityProvider>
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/seeall" element={<SeeAll/>}/>
          <Route path="/movie/:id" element={<MoviePage/>}/>
          <Route path="/book/:id" element={<BookMoviePage/>}/>
          <Route path="/book-seat/1" element ={<SeatingMap/>}/>
          
          
        </Routes>
      </div>
    </Router>
    </CityProvider>
  );
}

export default App;
