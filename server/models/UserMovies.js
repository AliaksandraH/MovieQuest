const { Schema, model } = require("mongoose");

const userMoviesSchema = new Schema({
    movieId: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    saved: {
        type: Boolean,
        default: false,
    },
    watched: {
        type: Boolean,
        default: false,
    },
    watchedDate: {
        type: Date,
        default: Date.now(),
    },
    userRating: {
        type: Number,
        default: 0,
    },
});

module.exports = model("UserMovies", userMoviesSchema);
