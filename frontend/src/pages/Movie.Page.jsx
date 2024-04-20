import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const movieResponse = await axios.get(`http://localhost:5000/api/movie/${id}`);
        setMovie(movieResponse.data.movie);
        setCast(movieResponse.data.cast);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

 
const handleBookShow = () => {
    navigate(`/book/${id}`);
  };

  if (!movie) return <div className="text-center mt-5 text-red-600">Movie not found.</div>;

  return (
<div>
  <Navbar/>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap">
          <div className="md:w-1/3">
            <img src={movie.poster_url} alt={movie.title} className="rounded-lg shadow-lg w-full" />
          </div>
          <div className="md:w-2/3 md:pl-4">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-800"><strong>Description:</strong> {movie.description}</p>
            <p className="text-gray-800"><strong>Genre:</strong> {movie.genre}</p>
            <p className="text-gray-800"><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p className="text-gray-800"><strong>Duration:</strong> {movie.duration} minutes</p>
            <p className="text-gray-800"><strong>Language:</strong> {movie.language}</p>
          </div>
        </div>
        <button onClick={handleBookShow} className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition duration-300">
            Book a Show
          </button>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-3">Cast</h2>
          <div className="flex flex-wrap">
            {cast.map((member) => (
              <div key={member.cast_id} className="w-full md:w-1/4 lg:w-1/6 p-2">
                <div className="bg-white p-3 rounded-lg flex flex-col items-center text-center shadow-lg">
                  <img src={member.profile_pic_url} alt={member.name} className="w-24 h-24 rounded-full mb-2" />
                  <h5 className="text-lg font-medium">{member.name}</h5>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      
</div>
  );
};

export default MoviePage;
