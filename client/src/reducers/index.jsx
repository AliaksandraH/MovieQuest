const initialState = {
    currentType: "movie",
    genres: { movie: [], ty: [] },
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
        default:
            return state;
    }
};

export default reducer;
