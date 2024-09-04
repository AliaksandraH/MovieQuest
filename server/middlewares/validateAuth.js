const { body, query } = require("express-validator");

const loginValidationRules = () => {
    return [
        body("email")
            .isEmail()
            .withMessage("Email must be a valid email address."),
        body("password")
            .isLength({ min: 1 })
            .withMessage("Password is required."),
    ];
};

const registerValidationRules = () => {
    return [
        query("username")
            .isLength({ min: 1, max: 25 })
            .withMessage("Username must be between 1 and 30 characters long."),
        query("email")
            .isEmail()
            .withMessage("Email must be a valid email address."),
        query("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long."),
        query("passwordConfirm").custom((value, { req }) => {
            if (value !== req.query.password) {
                throw new Error("Passwords do not match.");
            }
            return true;
        }),
    ];
};

const deleteAccountValidationRules = () => {
    return [
        body("userId")
            .isString()
            .isLength({ min: 1 })
            .withMessage("User ID is required."),
    ];
};

module.exports = {
    loginValidationRules,
    registerValidationRules,
    deleteAccountValidationRules,
};
