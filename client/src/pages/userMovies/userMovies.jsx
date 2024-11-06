import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { toast } from "react-toastify";
import { api } from "../../helpers/constants";
import { setCurrentTypeForUserMovies } from "../../actions";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Spinner from "../../components/spinner/spinner";
import "./userMovies.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const UserMovies = ({ title, url, sort }) => {
    const { request } = useHttp();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.userId);
    const type = useSelector((state) => state.currentTypeForUserMovies);
    const mouseYposition = useSelector((state) => state.mouseYposition);

    const prevURL = useRef(url);
    const prevUserId = useRef(userId);
    const prevCurrentLanguage = useRef(currentLanguage);

    const [movies, setMovies] = useState([]);
    const [moviesInformation, setMoviesInformation] = useState([]);
    const [currentMovies, setCurrentMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId === prevUserId.current) return;
        dispatch(setCurrentTypeForUserMovies("all"));
        getMovies();
        prevUserId.current = userId;
    }, [userId]);

    useEffect(() => {
        if (url === prevURL.current) {
            getMovies();
            return;
        }
        dispatch(setCurrentTypeForUserMovies("all"));
        getMovies();
        prevURL.current = url;
    }, [url]);

    useEffect(() => {
        if (prevCurrentLanguage.current === currentLanguage) return;
        getMoviesInformation(movies);
        prevCurrentLanguage.current = currentLanguage;
    }, [currentLanguage]);

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

    useEffect(() => {
        if (!currentMovies.length) return;
        window.scrollTo({
            top: mouseYposition - (window.innerWidth <= 600 ? 100 : 60),
            behavior: "smooth",
        });
    }, [currentMovies, mouseYposition]);

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
                getMoviesInformation(data.movies);
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
                    userRating: sort ? movie.userRating : null,
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

    const sortMovies = (movies, sort) => {
        if (sort) {
            return [...movies].sort((a, b) => b.userRating - a.userRating);
        }
        return [...movies];
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
                                dispatch(setCurrentTypeForUserMovies("all"));
                            }}
                        >
                            {t("all")}
                        </button>
                        <button
                            className={
                                type === "movie" ? "active-button" : null
                            }
                            onClick={() => {
                                dispatch(setCurrentTypeForUserMovies("movie"));
                            }}
                        >
                            {t("movies")}
                        </button>
                        <button
                            className={type === "tv" ? "active-button" : null}
                            onClick={() => {
                                dispatch(setCurrentTypeForUserMovies("tv"));
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
