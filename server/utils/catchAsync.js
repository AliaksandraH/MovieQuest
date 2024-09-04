const initError = require("./initError");

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            console.error("catchAsync error: ", error);
            initError(res, "server", "default");
        });
    };
};
