const http = process.env.REACT_APP_HTTP;

export const api = {
    login: `${http}/auth/login`,
    register: `${http}/auth/register`,
    deleteAccount: `${http}/auth/deleteAccount`,
    getUserMovies: `${http}/userMovies/getUserMovies`,
    getUserSavedMovies: `${http}/userMovies/getUserSavedMovies`,
    getUserWatchedMovies: `${http}/userMovies/getUserWatchedMovies`,
    getUserWatchedMoviesInMonth: `${http}/userMovies/getUserWatchedMoviesInMonth`,
    getTypesMovie: `${http}/userMovies/getTypesMovie`,
    addSavedMovie: `${http}/userMovies/addSavedMovie`,
    addWatchedMovie: `${http}/userMovies/addWatchedMovie`,
    deleteSavedMovie: `${http}/userMovies/deleteSavedMovie`,
    deleteWatchedMovie: `${http}/userMovies/deleteWatchedMovie`,
    putRatingMovie: `${http}/userMovies/putRatingMovie`,
};

export const minDate = 1895;
export const maxDate = new Date().getFullYear();
