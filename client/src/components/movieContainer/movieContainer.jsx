import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMouseYposition } from "../../actions";
import StarRatings from "react-star-ratings";
import NoPoster from "../../assets/no-poster.png";
import "./movieContainer.scss";

const MovieContainer = ({ movieInformation, type }) => {
    const blockRef = useRef(null);
    const dispatch = useDispatch();
    const { id, wasViewed, poster_path, title, rating } = movieInformation;
    const img_path = "https://image.tmdb.org/t/p/original";

    const styleRating = {
        starDimension: "25px",
        starSpacing: "2px",
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

    return (
        <Link
            to={`/${type}/${id}`}
            className="movie"
            onClick={onChangeMouseYPosition}
            ref={blockRef}
        >
            <div className={wasViewed ? "movie_wasViewed" : null}></div>
            <img src={poster_path ? `${img_path}${poster_path}` : NoPoster} />
            <div className="movie_information">
                <p>{title}</p>
            </div>
            <div className="movie_rating-stars">
                <StarRatings {...styleRating} />
            </div>
        </Link>
    );
};

export default MovieContainer;
