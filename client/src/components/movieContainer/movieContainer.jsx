import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMouseYposition } from "../../actions";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import NoPoster from "../../assets/no-poster.png";
import "./movieContainer.scss";

const MovieContainer = ({ movieInformation, type }) => {
    const blockRef = useRef(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id, watched, saved, poster_path, title, rating, userRating } =
        movieInformation;
    const img_path = "https://image.tmdb.org/t/p/original";

    const styleRating = {
        starDimension: "25px",
        starSpacing: "1px",
        numberOfStars: 5,
        rating: rating / 2,
        isSelectable: false,
        starRatedColor: "#9f0013",
        starEmptyColor: "rgb(124, 124, 124)",
    };

    const onChangeMouseYPosition = () => {
        const blockYPosition =
            blockRef.current.getBoundingClientRect().top + window.scrollY;
        dispatch(setMouseYposition(blockYPosition));
    };

    const getTranslucentClass = () => {
        if (watched && saved) return "movie_translucent_watched-saved";
        if (watched) return "movie_translucent_watched";
        if (saved) return "movie_translucent_saved";
        return null;
    };

    const getText = () => {
        if (watched && saved) return "watchedAndSaved";
        if (watched) return "watchedLink";
        if (saved) return "saved";
        return null;
    };

    return (
        <Link
            to={`/${type}/${id}`}
            className="movie"
            onClick={onChangeMouseYPosition}
            ref={blockRef}
        >
            {getTranslucentClass() && (
                <div className={`movie_translucent ${getTranslucentClass()}`}>
                    <p>{t(getText())}</p>
                </div>
            )}
            <img src={poster_path ? `${img_path}${poster_path}` : NoPoster} />
            <div className="movie_information">
                <p>{title}</p>
            </div>
            <div className="movie_rating-stars">
                <StarRatings {...styleRating} />
            </div>
            {userRating != null && (
                <div className="movie_user-rating">
                    <span>{userRating}</span>
                </div>
            )}
        </Link>
    );
};

export default MovieContainer;
