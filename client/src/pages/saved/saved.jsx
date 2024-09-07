import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { toast } from "react-toastify";
import { api } from "../../helpers/constants";
import MovieContainer from "../../components/movieContainer/movieContainer";
import "./saved.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const Saved = ({ openModalAuth }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { request } = useHttp();
    const userId = useSelector((state) => state.userId);
    const [type, setType] = useState("all");
    const [movies, setMovies] = useState([]);
    const [moviesInformation, setMoviesInformation] = useState([]);
    const [currentMovies, setCurrentMovies] = useState([]);

    useEffect(() => {
        getMovies();
    }, []);

    useEffect(() => {
        getMovies();
    }, [userId]);

    useEffect(() => {
        getMoviesInformation(movies);
    }, [movies, currentLanguage]);

    useEffect(() => {
        if (type === "all") {
            setCurrentMovies(moviesInformation);
            return;
        }
        const data = moviesInformation.filter((movie) => movie.type === type);
        setCurrentMovies(data);
    }, [type, moviesInformation]);

    const getMovies = async () => {
        try {
            if (!userId) {
                setMovies([]);
                setMoviesInformation([]);
                setCurrentMovies([]);
                openModalAuth();
                return;
            }
            const data = await request(api.getUserSavedMovies, "GET", {
                userId,
            });
            if (data.message === "OK") {
                setMovies(data.movies || []);
            } else {
                toast.error(t("error"));
            }
        } catch (error) {
            toast.error(t("error"));
        }
    };

    const getMoviesInformation = async (movies) => {
        if (movies.length <= 0) return;
        try {
            const data = movies.map((movie) =>
                request(
                    `https://api.themoviedb.org/3/${movie.type}/${movie.movieId}?language=${currentLanguage}&api_key=${_key}`
                ).then((apiData) => ({
                    ...apiData,
                    type: movie.type,
                }))
            );
            const dataResponses = await Promise.all(data);
            const transformedData = dataResponses.map(
                transformInformationMovies
            );
            setMoviesInformation(transformedData);
        } catch (error) {
            toast.error(t("error"));
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
        };
    };

    return (
        <div className="saved-page">
            <div className="saved-page_header">
                <p>{t("savedMoviesAndShows")}</p>
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
                    {currentMovies.length > 0 ? (
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

export default Saved;
