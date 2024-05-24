import { minDate, maxDate } from "../helpers/constants.js";

const initialState = {
    currentType: "movie",
    genres: { movie: [], ty: [] },
    countries: [],
    assignedFilters: {
        type: "movie",
        rating: 0,
        date: { minDate, maxDate },
        genres: [],
        countries: [],
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_CURRENT_TYPE":
            return {
                ...state,
                currentType: action.payload,
            };
        case "CHANGE_GENRES":
            return {
                ...state,
                genres: { tv: action.genresTv, movie: action.genresMovie },
            };
        case "CHANGE_COUNTRIES":
            return {
                ...state,
                countries: action.payload,
            };
        case "CHANGE_FILTERS":
            return {
                ...state,
                assignedFilters: {
                    type: action.payload,
                    rating: action.rating,
                    date: action.date,
                    genres: action.genres,
                    countries: action.countries,
                },
            };
        default:
            return state;
    }
};

export default reducer;
