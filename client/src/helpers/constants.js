const http = process.env.REACT_APP_HTTP;

export const api = {
    login: `${http}/auth/login`,
    register: `${http}/auth/register`,
    deleteAccount: `${http}/auth/deleteAccount`,
    addSavedMovie: `${http}/userMovies/addSavedMovie`,
    addWatchedMovie: `${http}/userMovies/addWatchedMovie`,
};

export const minDate = 1895;
export const maxDate = new Date().getFullYear();
