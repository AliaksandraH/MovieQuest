const UserMovies = require("../models/UserMovies");
// const User = require("../models/User");
// const initError = require("../utils/initError");
const catchAsync = require("../utils/catchAsync");

const getTypesMovie = catchAsync(async (req, res) => {
    const { userId, movieId } = req.query;

    let saved = false;
    let watched = false;

    const movie = await UserMovies.findOne({ userId, movieId });

    if (movie) {
        saved = movie.saved;
        watched = movie.watched;
    }

    res.status(200).json({
        message: "OK",
        types: { saved, watched },
    });
});

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

const managerDeletionMovies = catchAsync(async (req, res, statusField) => {
    const { userId, movieId } = req.body;

    const updateData = { $set: { [statusField]: false } };

    const movie = await UserMovies.findOneAndUpdate(
        { userId, movieId },
        updateData,
        { new: true }
    );

    if (!movie) {
        res.status(400).json({
            message: "The movie was not found.",
        });
    }

    if (movie.saved === false && movie.watched === false) {
        await UserMovies.deleteOne({ userId, movieId });
    }

    res.status(200).json({
        message: "OK",
    });
});

const deleteSavedMovie = (req, res) => managerDeletionMovies(req, res, "saved");
const deleteWatchedMovie = (req, res) =>
    managerDeletionMovies(req, res, "watched");

// const getSavedMovies
// const getWatchedMovies

module.exports = {
    getTypesMovie,
    addSavedMovie,
    addWatchedMovie,
    deleteSavedMovie,
    deleteWatchedMovie,
};
