
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.movie_id}`);
  };

  return (
    <div className="cursor-pointer border rounded shadow p-3" onClick={handleCardClick}>
      <img src={movie.poster_url} alt={movie.title} className="w-full h-64 object-cover rounded-lg" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{movie.title}</h3>
       
      </div>
    </div>
  );
};

export default Card;
