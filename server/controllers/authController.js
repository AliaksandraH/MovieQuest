const User = require("../models/User");
const initError = require("../utils/initError");
const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return initError(res, "login", "noUser");

    const passwordsMatch =
        user && (await user.comparePasswords(password, user.password));
    if (!passwordsMatch) return initError(res, "login", "invalidData");
    user.password = undefined;

    res.status(200).json({
        message: "OK",
        userId: user._id,
    });
});

const register = catchAsync(async (req, res) => {
    const { email, username, password, passwordConfirm } = req.query;

    const candidate = await User.findOne({ email });
    if (candidate) return initError(res, "register", "userExists");

    await User.create({
        email,
        username,
        password,
        passwordConfirm,
    });

    res.status(200).json({
        message: "OK",
    });
});

const deleteAccount = catchAsync(async (req, res) => {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
        message: "Account successfully deleted.",
    });
});

module.exports = {
    login,
    register,
    deleteAccount,
};
