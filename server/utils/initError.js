const errorMessages = {
    login: {
        invalidData: {
            message: "Invalid email or password.",
            statusCode: 400,
        },
        noUser: {
            message: "There is no such user.",
            statusCode: 400,
        },
    },
    register: {
        userExists: {
            message: "A user with such an email already exists.",
            statusCode: 400,
        },
    },
    getResetToken: {
        userNotFound: {
            message: "User with this email not found.",
            statusCode: 404,
        },
    },
    server: {
        default: {
            message: "Something went wrong. Please, try again later.",
            statusCode: 500,
        },
    },
};

const initError = (res, controllerMethod, errorType, statusCode = 500) => {
    const methodErrors = errorMessages[controllerMethod][errorType];
    res.status(methodErrors.statusCode || statusCode).json({
        message: methodErrors.message,
    });
};

module.exports = initError;
