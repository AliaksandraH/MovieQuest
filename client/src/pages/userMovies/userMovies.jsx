import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { toast } from "react-toastify";
import { api } from "../../helpers/constants";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Spinner from "../../components/spinner/spinner";
import "./userMovies.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const UserMovies = ({ title, url, sort }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { request } = useHttp();
    const userId = useSelector((state) => state.userId);

    const [type, setType] = useState("all");
    const [movies, setMovies] = useState([]);
    const [moviesInformation, setMoviesInformation] = useState([]);
    const [currentMovies, setCurrentMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMovies();
    }, []);

    useEffect(() => {
        getMovies();
    }, [userId, url]);

    useEffect(() => {
        getMoviesInformation(movies);
    }, [movies, currentLanguage]);

    useEffect(() => {
        let filteredMovies = [];
        if (type === "all") {
            filteredMovies = moviesInformation;
        } else {
            filteredMovies = moviesInformation.filter(
                (movie) => movie.type === type
            );
        }
        const sortedMovies = sortMovies(filteredMovies, sort);
        setCurrentMovies(sortedMovies);
    }, [type, moviesInformation]);

    const sortMovies = (movies, sort) => {
        if (sort) {
            return [...movies].sort((a, b) => b.userRating - a.userRating);
        }
        return [...movies];
    };

    const getMovies = async () => {
        try {
            setLoading(true);
            setMovies([]);
            setMoviesInformation([]);
            setCurrentMovies([]);
            if (!userId) return;
            const data = await request(api[url], "GET", {
                userId,
            });
            if (data.message === "OK") {
                setMovies(data.movies || []);
            } else {
                toast.error(t("error"));
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    const getMoviesInformation = async (movies) => {
        if (movies.length <= 0) return;
        try {
            setLoading(true);
            const data = movies.map((movie) =>
                request(
                    `https://api.themoviedb.org/3/${movie.type}/${movie.movieId}?language=${currentLanguage}&api_key=${_key}`
                ).then((apiData) => ({
                    ...apiData,
                    type: movie.type,
                    userRating: movie.userRating,
                }))
            );
            const dataResponses = await Promise.all(data);
            const transformedData = dataResponses.map(
                transformInformationMovies
            );
            setMoviesInformation(transformedData);
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    const transformInformationMovies = (movie) => {
        return {
            id: movie.id,
            title: movie.title ? movie.title : movie.name,
            poster_path: movie.poster_path ? movie.poster_path : null,
            rating: movie.vote_average,
            backdrop_path: movie.backdrop_path ? movie.backdrop_path : null,
            wasViewed: false,
            type: movie.type,
            userRating: movie.userRating,
        };
    };

    return (
        <div className="saved-page">
            <div className="saved-page_header">
                <p className="title">{t(title)}</p>
                {sort && <p>{t("listSortedByRatings")}</p>}
            </div>
            <div className="main">
                <hr />
                <div className="main_filters">
                    <div>
                        <button
                            className={type === "all" ? "active-button" : null}
                            onClick={() => {
                                setType("all");
                            }}
                        >
                            {t("all")}
                        </button>
                        <button
                            className={
                                type === "movie" ? "active-button" : null
                            }
                            onClick={() => {
                                setType("movie");
                            }}
                        >
                            {t("movies")}
                        </button>
                        <button
                            className={type === "tv" ? "active-button" : null}
                            onClick={() => {
                                setType("tv");
                            }}
                        >
                            {t("tvSeries")}
                        </button>
                    </div>
                </div>
                <div className="main_movies">
                    {loading ? (
                        <Spinner />
                    ) : currentMovies.length > 0 ? (
                        currentMovies.map((movie) => (
                            <MovieContainer
                                key={movie.id}
                                movieInformation={movie}
                                type={movie.type}
                            />
                        ))
                    ) : (
                        <p>{t("listIsEmpty")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMovies;
