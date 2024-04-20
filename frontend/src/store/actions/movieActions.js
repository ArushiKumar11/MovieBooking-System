// src/store/actions/movieActions.js
import axios from 'axios';

const fetchMoviesRequest = () => {
    return {
        type: 'FETCH_MOVIES_REQUEST'
    };
};

const fetchMoviesSuccess = (movies) => {
    return {
        type: 'FETCH_MOVIES_SUCCESS',
        payload: movies
    };
};

const fetchMoviesFailure = (error) => {
    return {
        type: 'FETCH_MOVIES_FAILURE',
        payload: error
    };
};

export const fetchMovies = () => {
    return (dispatch) => {
        dispatch(fetchMoviesRequest());
        axios.get('http://localhost:5000/api/movies')
            .then(response => {
                const movies = response.data;
                dispatch(fetchMoviesSuccess(movies));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchMoviesFailure(errorMsg));
            });
    };
};
