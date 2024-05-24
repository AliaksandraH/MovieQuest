export const setCurrentType = (type) => {
    return {
        type: "CHANGE_CURRENT_TYPE",
        payload: type,
    };
};

export const setGenres = (genresMovie, genresTv) => {
    return {
        type: "CHANGE_GENRES",
        genresMovie,
        genresTv,
    };
};

export const setCountries = (countries) => {
    return {
        type: "CHANGE_COUNTRIES",
        payload: countries,
    };
};
