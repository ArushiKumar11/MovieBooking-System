// src/store/index.js
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import {thunk} from 'redux-thunk';
import movieReducer from './reducers/movieReducer';

const rootReducer = combineReducers({
    movies: movieReducer
});

// Manually connect to Redux DevTools, if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
