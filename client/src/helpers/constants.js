const http = process.env.REACT_APP_HTTP;

export const api = {
    login: `${http}/auth/login`,
    register: `${http}/auth/register`,
    deleteAccount: `${http}/auth/deleteAccount`,
};

export const minDate = 1895;
export const maxDate = new Date().getFullYear();
