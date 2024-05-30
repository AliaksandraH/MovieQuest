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

export const setCertifications = (certificationsTv, certificationsMovie) => {
    return {
        type: "CHANGE_CERTIFICATIONS",
        certificationsTv,
        certificationsMovie,
    };
};

export const setFilters = (
    type,
    rating,
    date,
    genres,
    countries,
    certification
) => {
    return {
        type: "CHANGE_FILTERS",
        payload: type,
        rating: rating,
        date: date,
        genres: genres,
        countries: countries,
        certification: certification,
    };
};
