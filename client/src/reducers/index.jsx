import { minDate, maxDate } from "../helpers/constants.js";

const initialState = {
    userId: null,
    currentType: "movie",
    currentNumPage: 1,
    genres: { movie: [], ty: [] },
    countries: [],
    certifications: { movie: [], ty: [] },
    visibilityButtonShowByFilters: false,
    assignedFilters: {
        type: "movie",
        rating: 0,
        date: { minDate, maxDate },
        genres: [],
        countries: [],
        certification: "All",
    },
    mouseYposition: 0,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_USER_ID":
            return {
                ...state,
                userId: action.payload,
            };
        case "CHANGE_CURRENT_TYPE":
            return {
                ...state,
                currentType: action.payload,
            };
        case "CHANGE_CURRENT_NUM_PAGE":
            return {
                ...state,
                currentNumPage: action.payload,
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
        case "CHANGE_CERTIFICATIONS":
            return {
                ...state,
                certifications: {
                    tv: action.certificationsTv,
                    movie: action.certificationsMovie,
                },
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
                    certification: action.certification,
                },
                currentType: "filters",
                visibilityButtonShowByFilters: true,
            };
        case "RESET_FILTERS":
            return {
                ...state,
                assignedFilters: initialState.assignedFilters,
                currentType:
                    state.currentType === "filters"
                        ? "movie"
                        : state.currentType,
                visibilityButtonShowByFilters: false,
            };
        case "CHANGE_FILTERS_CERTIFICATION":
            return {
                ...state,
                assignedFilters: {
                    ...state.assignedFilters,
                    certification: action.certification,
                },
            };
        case "CHANGE_MOUSE_Y_POSITION":
            return {
                ...state,
                mouseYposition: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
