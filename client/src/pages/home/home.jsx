import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";
import {
    setCurrentType,
    setGenres,
    setCountries,
    setCertifications,
    setFiltersCertification,
    setCurrentNumPage,
} from "../../actions";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Calendar from "../../components/calendar/calendar";
import NoBackground from "../../assets/no-background.png";
import "./home.scss";

const _key = process.env.REACT_APP_API_KEY;

const Home = ({ openModalFilters }) => {
    const imgPath = "https://image.tmdb.org/t/p/original";
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { request } = useHttp();
    const dispatch = useDispatch();
    const {
        currentType: type,
        currentNumPage: numPage,
        assignedFilters,
        countries,
        genres,
        certifications,
    } = useSelector((state) => state);
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (movies.length < 1) {
                try {
                    const moviesData = await getMovies(type, numPage);
                    setMovies(moviesData);
                    setBackground(moviesData);
                    getGenres();
                    getCountries();
                    getCertifications();
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchData();

        return () => {
            setBackground(null);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesData = await getMovies(type, numPage);
                dispatch(setFiltersCertification("All"));
                setMovies(moviesData);
                getGenres();
                getCountries();
                getCertifications();
                window.scrollTo(0, 0);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [currentLanguage]);

    useEffect(() => {
        if (type === "filters") {
            const fetchData = async () => {
                const newData = await getMovies("filters", 1);
                dispatch(setCurrentNumPage(1));
                dispatch(setCurrentType("filters"));
                setMovies(newData);
            };
            fetchData();
        }
    }, [assignedFilters]);

    const getMovies = async (type, numPage) => {
        try {
            if (type === "filters") return getFiltersShows(numPage);
            const data = await request(
                `https://api.themoviedb.org/3/trending/${type}/week?language=${currentLanguage}&api_key=${_key}&page=${numPage}`
            );
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            return await data.results.map(transformInformationMovies);
        } catch (error) {
            console.log(error);
        }
    };

    const getFiltersShows = async (numPage) => {
        const { type, rating, date, genres, countries, certification } =
            assignedFilters;
        const url = new URL(`https://api.themoviedb.org/3/discover/${type}`);
        const params = {
            api_key: _key,
            with_origin_country: countries.join("|"),
            with_genres: genres.join("|"),
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

        try {
            const data = await request(url);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            return await data.results.map(transformInformationMovies);
        } catch (error) {
            console.log(error);
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
        };
    };

    const getGenres = async () => {
        try {
            const movieGenres = await request(
                `https://api.themoviedb.org/3/genre/movie/list?language=${currentLanguage}&api_key=${_key}`
            );
            const tvGenres = await request(
                `https://api.themoviedb.org/3/genre/tv/list?language=${currentLanguage}&api_key=${_key}`
            );
            dispatch(setGenres(movieGenres.genres, tvGenres.genres));
        } catch (error) {
            console.log(error);
        }
    };

    const getCountries = async () => {
        try {
            const movieCountries = await request(
                `https://api.themoviedb.org/3/configuration/countries?language=${currentLanguage}&api_key=${_key}`
            );
            dispatch(setCountries(movieCountries));
        } catch (error) {
            console.log(error);
        }
    };

    const getCertifications = async () => {
        try {
            const certification = currentLanguage === "en" ? "US" : "RU";

            const movieCertifications = await request(
                `https://api.themoviedb.org/3/certification/movie/list?api_key=${_key}`
            );
            const tvCertifications = await request(
                `https://api.themoviedb.org/3/certification/tv/list?api_key=${_key}`
            );
            dispatch(
                setCertifications(
                    [
                        { certification: "All" },
                        ...tvCertifications.certifications[certification],
                    ],
                    [
                        { certification: "All" },
                        ...movieCertifications.certifications[certification],
                    ]
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const updateMovies = async (newType, newPage) => {
        if (newPage !== numPage && newType == type) {
            const newData = await getMovies(newType, newPage);
            setMovies(newData);
        } else if (newType !== type) {
            const newData = await getMovies(newType, newPage);
            dispatch(setCurrentType(newType));
            setMovies(newData);
        }
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

    const nextPage = (number) => {
        dispatch(setCurrentNumPage(number));
        updateMovies(type, number);
    };

    const changeType = (type) => {
        dispatch(setCurrentNumPage(1));
        updateMovies(type, 1);
    };

    return (
        <div className="home">
            <div className="home_header">
                <img
                    className="home_header_background"
                    src={backgroundImg || NoBackground}
                />
                <div className="home_header_information">
                    <div className="welcome-message">
                        <p className="bold-text">{t("welcomeParagraph1")}</p>
                        <p>{t("welcomeParagraph2")}</p>
                        <p>{t("welcomeParagraph3")}</p>
                        <p>{t("welcomeParagraph4")}</p>
                        <p className="bold-text">{t("welcomeParagraph5")}</p>
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
                                changeType("movie");
                            }}
                        >
                            {t("movies")}
                        </button>
                        <button
                            className={type === "tv" ? "active-button" : null}
                            onClick={() => {
                                changeType("tv");
                            }}
                        >
                            {t("tvSeries")}
                        </button>
                        <button
                            className={
                                type === "filters" ? "active-button" : null
                            }
                            onClick={() => {
                                changeType("filters");
                            }}
                        >
                            {t("showsByFilters")}
                        </button>
                    </div>
                    {countries.length > 0 &&
                        genres.movie.length > 0 &&
                        genres.tv.length > 0 &&
                        certifications.movie.length > 0 &&
                        certifications.tv.length > 0 && (
                            <button onClick={openModalFilters}>
                                {t("filters")}
                            </button>
                        )}
                </div>
                <div className="main_movies">
                    {movies &&
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
                    {movies.length > 0 && totalPages && (
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
                    {movies.length <= 0 && <p>{t("noShows")}</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
