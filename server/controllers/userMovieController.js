const UserMovies = require("../models/UserMovies");
// const User = require("../models/User");
// const initError = require("../utils/initError");
const catchAsync = require("../utils/catchAsync");

const managerAddingMovies = catchAsync(async (req, res, statusField) => {
    const { userId, movieId } = req.body;

    const updateData = { $set: { [statusField]: true } };

    const movie = await UserMovies.findOneAndUpdate(
        { userId, movieId },
        updateData,
        { new: true }
    );

    if (!movie) {
        await UserMovies.create({
            userId,
            movieId,
            [statusField]: true,
        });
    }

    res.status(200).json({
        message: "OK",
    });
});

const addSavedMovie = (req, res) => managerAddingMovies(req, res, "saved");
const addWatchedMovie = (req, res) => managerAddingMovies(req, res, "watched");

// const getMovies
// const getSavedMovies
// const getWatchedMovies
// const deleteSavedMovie
// const deleteWatchedMovie

module.exports = {
    addSavedMovie,
    addWatchedMovie,
};
