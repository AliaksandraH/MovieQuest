import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import NoPoster from "../../assets/no-poster.png";
import "./movieContainer.scss";

const MovieContainer = ({ movieInformation, type }) => {
    const { id, wasViewed, poster_path, title, rating } = movieInformation;
    const img_path = "https://image.tmdb.org/t/p/original";

    const styleRating = {
        size: 27,
        value: rating / 2,
        edit: false,
        activeColor: "#9f0013",
    };

    return (
        <Link to={`/${type}/${id}`} className="movie">
            <div className={wasViewed ? "movie_wasViewed" : null}></div>
            <img
                src={poster_path ? `${img_path}${poster_path}` : NoPoster}
                alt=""
            />
            <div className="movie_information">
                <p>{title}</p>
            </div>
            <div className="movie_rating-stars">
                <ReactStars {...styleRating} />
            </div>
        </Link>
    );
};

export default MovieContainer;
