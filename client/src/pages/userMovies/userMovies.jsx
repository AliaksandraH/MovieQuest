import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    const { searchText } = useParams();
    const navigate = useNavigate();
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
    const prevSearchText = useRef(searchText);

    const [moviesInformation, setMoviesInformation] = useState([]);
    const [currentMovies, setCurrentMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchText) return;
        if (!userId) {
            setMoviesInformation([]);
            setCurrentMovies([]);
            navigate("/");
            return;
        }
        if (userId === prevUserId.current) return;
        dispatch(setCurrentTypeForUserMovies("all"));
        getShows();
        prevUserId.current = userId;
    }, [userId]);

    useEffect(() => {
        if (!url) return;
        if (url === prevURL.current) {
            getShows();
            return;
        }
        dispatch(setCurrentTypeForUserMovies("all"));
        getShows();
        prevURL.current = url;
    }, [url]);

    useEffect(() => {
        if (!searchText) return;
        if (searchText === prevSearchText.current) {
            getShows();
            return;
        }
        dispatch(setCurrentTypeForUserMovies("all"));
        getShows();
        prevSearchText.current = searchText;
    }, [searchText]);

    useEffect(() => {
        if (prevCurrentLanguage.current === currentLanguage) return;
        getShows();
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

    const getShows = async () => {
        try {
            setLoading(true);
            if (url && userId) {
                const data = await request(api[url], "GET", {
                    userId,
                });
                if (data.message === "OK") {
                    getShowsInformationTMDB(data.movies || []);
                } else {
                    throw new Error();
                }
            } else if (searchText) {
                getShowsBySearchText(searchText);
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    const getShowsInformationTMDB = async (movies) => {
        if (movies.length <= 0) return;
        try {
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
            const transformedData = dataResponses.map((el) =>
                transformInformationMovies(el)
            );
            setMoviesInformation(transformedData);
        } catch (error) {
            console.log(error);
        }
    };

    const getShowsBySearchText = async (text) => {
        try {
            if (!text.trim()) return;
            const resultMovie = await request(
                `https://api.themoviedb.org/3/search/movie?language=${currentLanguage}&query=${text}&api_key=${_key}`
            );
            const resultTv = await request(
                `https://api.themoviedb.org/3/search/tv?language=${currentLanguage}&query=${text}&api_key=${_key}`
            );
            const transformMovie = resultMovie.results.map((el) =>
                transformInformationMovies(el, "movie")
            );
            const transformTv = resultTv.results.map((el) =>
                transformInformationMovies(el, "tv")
            );
            setMoviesInformation([...transformMovie, ...transformTv]);
        } catch (error) {
            console.log(error);
        }
    };

    const transformInformationMovies = (movie, type = null) => {
        return {
            id: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path || null,
            rating: movie.vote_average || 0,
            backdrop_path: movie.backdrop_path || null,
            wasViewed: false,
            type: type || movie.type,
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
