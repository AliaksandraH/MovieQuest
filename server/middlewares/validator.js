const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const firstError = errors.array()[0];

    return res.status(422).json({
        message: firstError.msg,
    });
};

module.exports = validate;
