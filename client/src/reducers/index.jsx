const initialState = {
    currentType: "movie",
    genres: { movie: [], ty: [] },
    countries: [],
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
        default:
            return state;
    }
};

export default reducer;
