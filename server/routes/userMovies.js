const { Router } = require("express");
const router = Router();

const {
    getUserSavedMovies,
    getUserWatchedMovies,
    getUserWatchedMoviesInMonth,
    getTypesMovie,
    addSavedMovie,
    addWatchedMovie,
    deleteSavedMovie,
    deleteWatchedMovie,
    putRatingMovie,
} = require("../controllers/userMovieController");

router.get("/getUserSavedMovies", getUserSavedMovies);
router.get("/getUserWatchedMovies", getUserWatchedMovies);
router.get("/getUserWatchedMoviesInMonth", getUserWatchedMoviesInMonth);
router.get("/getTypesMovie", getTypesMovie);
router.post("/addSavedMovie", addSavedMovie);
router.post("/addWatchedMovie", addWatchedMovie);
router.post("/deleteSavedMovie", deleteSavedMovie);
router.post("/deleteWatchedMovie", deleteWatchedMovie);
router.post("/putRatingMovie", putRatingMovie);

module.exports = router;
