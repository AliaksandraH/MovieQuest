const UserMovies = require("../models/UserMovies");
const catchAsync = require("../utils/catchAsync");

const managerGetUserMovies = catchAsync(async (req, res, statusField) => {
    const { userId } = req.query;

    const movies = await UserMovies.find({ userId, [statusField]: true });

    res.status(200).json({
        message: "OK",
        movies,
    });
});

const getUserSavedMovies = (req, res) =>
    managerGetUserMovies(req, res, "saved");
const getUserWatchedMovies = (req, res) =>
    managerGetUserMovies(req, res, "watched");

const getUserWatchedMoviesInMonth = catchAsync(async (req, res) => {
    const { userId, date } = req.query;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;

    const movies = await UserMovies.find({
        userId,
        watched: true,
        watchedDate: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
        },
    });

    res.status(200).json({
        message: "OK",
        movies,
    });
});

const getTypesMovie = catchAsync(async (req, res) => {
    const { userId, movieId, type } = req.query;

    let saved = false;
    let watched = false;

    const movie = await UserMovies.findOne({ userId, movieId, type });

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
    const { userId, movieId, type } = req.body;

    const updateData = {
        $set: {
            [statusField]: true,
            ...(statusField === "watched" && { watchedDate: Date.now() }),
        },
    };

    let movie = await UserMovies.findOneAndUpdate(
        { userId, movieId, type },
        updateData,
        { new: true }
    );

    if (!movie) {
        movie = await UserMovies.create({
            userId,
            movieId,
            type,
            [statusField]: true,
        });
    }

    const saved = movie.saved || false;
    const watched = movie.watched || false;

    res.status(200).json({
        message: "OK",
        types: { saved, watched },
    });
});

const addSavedMovie = (req, res) => managerAddingMovies(req, res, "saved");
const addWatchedMovie = (req, res) => managerAddingMovies(req, res, "watched");

const managerDeletionMovies = catchAsync(async (req, res, statusField) => {
    const { userId, movieId, type } = req.body;

    const updateData = { $set: { [statusField]: false } };

    const movie = await UserMovies.findOneAndUpdate(
        { userId, movieId, type },
        updateData,
        { new: true }
    );

    if (!movie) {
        res.status(400).json({
            message: "The movie was not found.",
        });
    }

    if (movie.saved === false && movie.watched === false) {
        await UserMovies.deleteOne({ userId, movieId, type });
        return res.status(200).json({
            message: "OK",
            types: {
                saved: false,
                watched: false,
            },
        });
    }

    const saved = movie.saved || false;
    const watched = movie.watched || false;

    res.status(200).json({
        message: "OK",
        types: { saved, watched },
    });
});

const deleteSavedMovie = (req, res) => managerDeletionMovies(req, res, "saved");
const deleteWatchedMovie = (req, res) =>
    managerDeletionMovies(req, res, "watched");

const putRatingMovie = catchAsync(async (req, res) => {
    const { userId, movieId, type, rating } = req.body;
    const updateData = { $set: { userRating: rating } };

    let movie = await UserMovies.findOneAndUpdate(
        { userId, movieId, type, watched: true },
        updateData,
        { new: true }
    );

    if (!movie) {
        res.status(400).json({
            message: "The movie was not found.",
        });
    }

    res.status(200).json({
        message: "OK",
    });
});

module.exports = {
    getUserSavedMovies,
    getUserWatchedMovies,
    getUserWatchedMoviesInMonth,
    getTypesMovie,
    addSavedMovie,
    addWatchedMovie,
    deleteSavedMovie,
    deleteWatchedMovie,
    putRatingMovie,
};
