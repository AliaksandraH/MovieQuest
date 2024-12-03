import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { useTranslation } from "react-i18next";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";
import { isEqual } from "lodash";
import {
    setCurrentType,
    setFiltersCertification,
    setCurrentNumPage,
} from "../../actions";
import { api } from "../../helpers/constants";
import Modal from "../../components/modal/modal";
import ModalFilters from "../../components/modalFilters/modalFilters";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Calendar from "../../components/calendar/calendar";
import Spinner from "../../components/spinner/spinner";
import NoBackground from "../../assets/no-background.png";
import "./pagination.scss";
import "./home.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const imgPath = "https://image.tmdb.org/t/p/original";

const Home = () => {
    const { request } = useHttp();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.userId);
    const type = useSelector((state) => state.currentType);
    const numPage = useSelector((state) => state.currentNumPage);
    const assignedFilters = useSelector((state) => state.assignedFilters);
    const mouseYposition = useSelector((state) => state.mouseYposition);
    const visibilityButtonShowByFilters = useSelector(
        (state) => state.visibilityButtonShowByFilters
    );

    const [backgroundImg, setBackgroundImg] = useState(null);
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalFilters, setModalFilters] = useState(false);

    const prevFilters = useRef(assignedFilters);
    const prevType = useRef(type);
    const prevNumPage = useRef(numPage);
    const prevUserId = useRef(userId);
    const prevCurrentLanguage = useRef(currentLanguage);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (movies.length < 1) {
                const moviesData = await getMovies(type, numPage);
                setMovies(moviesData);
                setBackground(moviesData);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (prevCurrentLanguage.current === currentLanguage) return;
        setCurrentShows(type, numPage);
        dispatch(setFiltersCertification("All"));
        prevCurrentLanguage.current = currentLanguage;
    }, [currentLanguage]);

    useEffect(() => {
        if (userId === prevUserId.current) return;
        setCurrentShows(type, numPage);
        prevUserId.current = userId;
    }, [userId]);

    useEffect(() => {
        if (type === prevType.current) return;
        changeType(type);
        prevType.current = type;
    }, [type]);

    useEffect(() => {
        if (type === "filters") {
            if (!isEqual(assignedFilters, prevFilters.current)) {
                const fetchData = async () => {
                    changeType("filters");
                };
                fetchData();
                prevFilters.current = assignedFilters;
            } else {
                const fetchData = async () => {
                    setCurrentShows("filters", numPage);
                };
                fetchData();
            }
        }
    }, [assignedFilters]);

    useEffect(() => {
        if (!movies.length) return;
        if (numPage === prevNumPage.current) {
            window.scrollTo({
                top: mouseYposition - (window.innerWidth <= 600 ? 100 : 60),
                behavior: "smooth",
            });
            return;
        }
        scroll();
    }, [movies, mouseYposition, numPage]);

    const getUserMovies = async () => {
        try {
            if (!userId) {
                return [];
            }
            const data = await request(api.getUserMovies, "GET", { userId });
            if (data.message === "OK") {
                return data.movies || [];
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    };

    const setCurrentShows = async (type, numPage) => {
        const data = await getMovies(type, numPage);
        setMovies(data);
    };

    const getMovies = async (type, numPage) => {
        try {
            setLoading(true);
            const userMovies = await getUserMovies();
            if (type === "filters") return getFiltersShows(numPage, userMovies);
            const data = await request(
                `https://api.themoviedb.org/3/trending/${type}/week?language=${currentLanguage}&api_key=${_key}&page=${numPage}`
            );
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            return await data.results.map((movie) =>
                transformInformationMovies(movie, userMovies)
            );
        } finally {
            setLoading(false);
        }
    };

    const getFiltersShows = async (numPage, userMovies) => {
        const {
            type,
            rating,
            date,
            genres,
            unnecessaryGenres,
            countries,
            certification,
        } = assignedFilters;
        const url = new URL(`https://api.themoviedb.org/3/discover/${type}`);
        const params = {
            api_key: _key,
            with_origin_country: countries.join("|"),
            with_genres: genres.join("|"),
            without_genres: unnecessaryGenres.join(","),
            "vote_average.gte": rating * 2,
            certification_country: currentLanguage === "en" ? "US" : "RU",
            certification: certification !== "All" ? certification : "",
            language: currentLanguage,
            include_adult: false,
            page: numPage,
            ...(type === "movie"
                ? {
                      "primary_release_date.gte": `${date.minDate}-01-01`,
                      "primary_release_date.lte": `${date.maxDate}-12-31`,
                  }
                : {
                      "first_air_date.gte": `${date.minDate}-01-01`,
                      "first_air_date.lte": `${date.maxDate}-12-31`,
                  }),
        };

        Object.keys(params).forEach((key) =>
            url.searchParams.append(key, params[key])
        );

        const data = await request(url);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        return await data.results.map((movie) =>
            transformInformationMovies(movie, userMovies)
        );
    };

    const transformInformationMovies = (movie, userMovies) => {
        let exists = false;
        if (userMovies && userMovies.length > 0) {
            exists = userMovies.find((item) => item.movieId == movie.id);
            if (!exists) {
                exists = false;
            }
        }
        return {
            id: movie.id,
            title: movie.title ? movie.title : movie.name,
            poster_path: movie.poster_path ? movie.poster_path : null,
            rating: movie.vote_average,
            backdrop_path: movie.backdrop_path ? movie.backdrop_path : null,
            watched: exists ? exists.watched : false,
            saved: exists ? exists.saved : false,
        };
    };

    const setBackground = (movies) => {
        let interval = null;
        if (!movies) return clearInterval(interval);
        const imgList = getBackgroundImgPath(movies);
        if (backgroundImg === null && imgList.length > 0) {
            changeBackgroundImg(imgList[0]);
            if (imgList.length > 1) {
                let count = 1;
                interval = setInterval(() => {
                    changeBackgroundImg(imgList[count]);
                    count = (count + 1) % imgList.length;
                }, 30000);
            }
        }
    };

    const getBackgroundImgPath = (array) => {
        const arrBackdrop = [];
        for (let i = 0; i < array.length; i++) {
            if (
                array[i].hasOwnProperty("backdrop_path") &&
                array[i].backdrop_path !== null
            ) {
                arrBackdrop.push(array[i].backdrop_path);
            }
        }
        return arrBackdrop;
    };

    const changeBackgroundImg = (img) => {
        setBackgroundImg(`${imgPath}${img}`);
    };

    const nextPage = async (number) => {
        dispatch(setCurrentNumPage(number));
        setCurrentShows(type, number);
    };

    const changeType = async (type) => {
        dispatch(setCurrentNumPage(1));
        setCurrentShows(type, 1);
    };

    const openModalFilters = () => setModalFilters(true);
    const closeModal = () => setModalFilters(false);

    const modalFiltersProps = {
        closeModalFilters: closeModal,
        currentFilters: assignedFilters,
    };

    const scroll = () => {
        const scrollOptions = { behavior: "smooth" };
        const elementTop =
            scrollRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerWidth <= 600 ? 80 : 40;
        window.scrollTo({
            top: elementTop - offset,
            ...scrollOptions,
        });
    };

    return (
        <>
            {modalFilters && (
                <Modal
                    Component={ModalFilters}
                    componentProps={modalFiltersProps}
                    nameModal="filters"
                    closeModal={closeModal}
                />
            )}
            <div className="home">
                <div className="home_header">
                    <img
                        className="home_header_background"
                        src={backgroundImg || NoBackground}
                    />
                    <div className="home_header_information">
                        <div className="welcome-message">
                            <p className="bold-text">
                                {t("welcomeParagraph1")}
                            </p>
                            <p>{t("welcomeParagraph2")}</p>
                            <p>{t("welcomeParagraph3")}</p>
                            <p>{t("welcomeParagraph4")}</p>
                            <p className="bold-text">
                                {t("welcomeParagraph5")}
                            </p>
                            <p>{t("welcomeParagraph6")}</p>
                        </div>
                        <Calendar />
                    </div>
                </div>
                <div className="main">
                    <hr />
                    <div className="main_filters">
                        <div>
                            <button
                                className={
                                    type === "movie" ? "active-button" : null
                                }
                                onClick={() => {
                                    dispatch(setCurrentType("movie"));
                                }}
                            >
                                {t("movies")}
                            </button>
                            <button
                                className={
                                    type === "tv" ? "active-button" : null
                                }
                                onClick={() => {
                                    dispatch(setCurrentType("tv"));
                                }}
                            >
                                {t("tvSeries")}
                            </button>
                            {visibilityButtonShowByFilters && (
                                <button
                                    className={
                                        type === "filters"
                                            ? "active-button"
                                            : null
                                    }
                                    onClick={() => {
                                        dispatch(setCurrentType("filters"));
                                    }}
                                >
                                    {t("showsByFilters")}
                                </button>
                            )}
                        </div>
                        <button onClick={openModalFilters}>
                            {t("filters")}
                        </button>
                    </div>
                    <div ref={scrollRef} className="main_movies">
                        {!loading &&
                            movies &&
                            movies.map((movie) => (
                                <MovieContainer
                                    key={movie.id}
                                    movieInformation={movie}
                                    type={
                                        type === "filters"
                                            ? assignedFilters.type
                                            : type
                                    }
                                />
                            ))}
                    </div>
                    <div className="pages">
                        {loading && <Spinner />}
                        {movies &&
                            movies.length > 0 &&
                            totalPages &&
                            !loading && (
                                <div className="pages_pagination">
                                    <ResponsivePagination
                                        current={numPage}
                                        total={totalPages}
                                        onPageChange={(number) => {
                                            nextPage(number);
                                        }}
                                    />
                                </div>
                            )}
                        {((movies && movies.length <= 0) || !movies) &&
                            !loading && <p>{t("noShows")}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
