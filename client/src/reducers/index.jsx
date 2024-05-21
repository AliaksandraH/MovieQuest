const initialState = {
    currentType: "movie",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_CURRENT_TYPE":
            return {
                ...state,
                currentType: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
