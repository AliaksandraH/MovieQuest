const { Router } = require("express");
const router = Router();

const {
    getUserSavedMovies,
    getUserWatchedMovies,
    getTypesMovie,
    addSavedMovie,
    addWatchedMovie,
    deleteSavedMovie,
    deleteWatchedMovie,
} = require("../controllers/userMovieController");

router.get("/getUserSavedMovies", getUserSavedMovies);
router.get("/getUserWatchedMovies", getUserWatchedMovies);
router.get("/getTypesMovie", getTypesMovie);
router.post("/addSavedMovie", addSavedMovie);
router.post("/addWatchedMovie", addWatchedMovie);
router.post("/deleteSavedMovie", deleteSavedMovie);
router.post("/deleteWatchedMovie", deleteWatchedMovie);

module.exports = router;
