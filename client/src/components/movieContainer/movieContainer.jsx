import "./movieContainer.scss";

// eslint-disable-next-line react/prop-types
const MovieContainer = ({ movieInformation }) => {
    // eslint-disable-next-line react/prop-types
    const { wasViewed, poster_path, title, rating } = movieInformation;
    const img_path = "https://image.tmdb.org/t/p/original";

    return (
        <div className="movie">
            <div className={wasViewed ? "movie_wasViewed" : null}></div>
            <img src={`${img_path}${poster_path}`} alt="" />
            <div className="movie_information">
                <p>{title}</p>
                <p>{rating}</p>
            </div>
        </div>
    );
};

export default MovieContainer;
