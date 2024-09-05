const { Router } = require("express");
const router = Router();

const {
    addSavedMovie,
    addWatchedMovie,
} = require("../controllers/userMovieController");

router.post("/addSavedMovie", addSavedMovie);
router.post("/addWatchedMovie", addWatchedMovie);

module.exports = router;
