import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/Home.Page";
import RegisterPage from './components/RegisterPage';
//import MoviePage from "./pages/Movie.Page";
//import PlayPage from "./pages/Play.Page";
//import ErrorPage from "./pages/404";

axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.params = {};
axios.defaults.params["api_key"] = process.env.REACT_APP_API_KEY;





function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage/>}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
