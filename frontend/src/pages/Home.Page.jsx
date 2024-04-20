import React, { useEffect, useState } from "react";
import axios from "axios";

import DefaultlayoutHoc from "../layout/Default.layout";


import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import PosterSlider from "../components/PosterSlider";
const tmdbAPI = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
});
const HomePage = () => {
 
  const [premierMovies, setpremierMovies] = useState([]);
  const [onlineStreamEvents, setonlineStreamEvents] = useState([]);


  useEffect(() => {
    const requestPopularMovies = async () => {
      const getPopularMovies = await tmdbAPI.get("/movie/popular");
      setpremierMovies(getPopularMovies.data.results);
    };
    requestPopularMovies();
  }, []);

  useEffect(() => {
    const requestUpcomingMovies = async () => {
      const getUpcomingMovies = await tmdbAPI.get("/movie/upcoming");
      setonlineStreamEvents(getUpcomingMovies.data.results);
    };
    requestUpcomingMovies();
  }, []);

  return (
    <>
      <HeroCarousel />
     

     
      <div className="bg-premier-800 py-12">
        <div className="container mx-auto px-4 md:px-12 my-8 flex flex-col gap-3">
          
          <PosterSlider
            title="New Release"
           
            posters={premierMovies}
            isDark={true}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 my-8 flex flex-col gap-3">
        <PosterSlider
          title="Highly Rated"
          
          posters={onlineStreamEvents}
          isDark={false}
        />
      </div>
    </>
  );
};

export default DefaultlayoutHoc(HomePage);