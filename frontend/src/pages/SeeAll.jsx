import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/actions/movieActions';
import DefaultlayoutHoc from '../layout/Default.layout';
import Card from '../components/Card'; // Ensure you have this Card component created
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const SeeAll = () => {
    const [language, setLanguage] = useState(false);
    const [genre, setGenre] = useState(false);
    const [filterLanguage, setFilterLanguage] = useState([]);
    const [filterGenre, setFilterGenre] = useState([]);
    const dispatch = useDispatch();
    const { movies, loading, error } = useSelector(state => state.movies);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleLanguageFilter = (lang) => {
        setFilterLanguage(filterLanguage.includes(lang) ? filterLanguage.filter(item => item !== lang) : [...filterLanguage, lang]);
    };

    const handleGenreFilter = (gen) => {
        setFilterGenre(filterGenre.includes(gen) ? filterGenre.filter(item => item !== gen) : [...filterGenre, gen]);
    };

    const clearFilters = () => {
        setFilterLanguage([]);
        setFilterGenre([]);
    };

    const filteredMovies = movies.filter(movie =>
        (filterLanguage.length ? filterLanguage.includes(movie.language) : true) &&
        (filterGenre.length ? filterGenre.includes(movie.genre) : true)
    );

    if (loading) return <div className="text-center mt-5 text-red-600">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-5">Error: {error}</div>;

    return (
        <div>
           <Navbar/>
       
        <div className="bg-gray-100 p-5">
            <div className="container mx-auto">
                <div className="mb-4">
                    <button
                        onClick={clearFilters}
                        className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    >
                        Clear Filters
                    </button>
                </div>
                <div className="flex flex-wrap -mx-2 mb-8">
                    <div className="w-full lg:w-1/4 px-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-3">Language</h2>
                        {/* Assuming you have a list of languages */}
                        {['English', 'Hindi', 'Spanish'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageFilter(lang)}
                                className={`block w-full text-left px-4 py-2 rounded ${
                                    filterLanguage.includes(lang) ? 'bg-red-600 text-white' : 'bg-white'
                                } mb-2`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <div className="w-full lg:w-1/4 px-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-3">Genre</h2>
                        {/* Assuming you have a list of genres */}
                        {['Action', 'Kids','Drama', 'Comedy'].map(gen => (
                            <button
                                key={gen}
                                onClick={() => handleGenreFilter(gen)}
                                className={`block w-full text-left px-4 py-2 rounded ${
                                    filterGenre.includes(gen) ? 'bg-red-600 text-white' : 'bg-white'
                                } mb-2`}
                            >
                                {gen}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap -mx-2">
                    {filteredMovies.length ? (
                        filteredMovies.map(movie => <Card key={movie.id} movie={movie} />)
                    ) : (
                        <div className="w-full text-center text-gray-700 text-xl">
                            No movies found.
                        </div>
                    )}
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default SeeAll;
