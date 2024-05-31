import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useSelector, useDispatch } from "react-redux";
import {
    setCurrentType,
    setGenres,
    setCountries,
    setCertifications,
} from "../../actions";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Calendar from "../../components/calendar/calendar";
import NoBackground from "../../assets/no-background.png";
import "./home.scss";

const _key = process.env.REACT_APP_API_KEY;

const Home = ({ openModalFilters }) => {
    const imgPath = "https://image.tmdb.org/t/p/original";
    const { request } = useHttp();
    const dispatch = useDispatch();
    const {
        currentType: type,
        assignedFilters,
        countries,
        genres,
        certifications,
    } = useSelector((state) => state);
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [movies, setMovies] = useState([]);
    const [numberShows, setNumberShows] = useState(0);
    const [numPage, setNumPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (movies.length < 1) {
                try {
                    const moviesData = await getMovies(type, numPage);
                    getGenres();
                    getCountries();
                    setMovies(moviesData);
                    setBackground(moviesData);
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
        if (type === "filters") {
            const fetchData = async () => {
                const newData = await getMovies("filters", 1);
                setNumPage(1);
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
                `https://api.themoviedb.org/3/trending/${type}/week?language=en-US&api_key=${_key}&page=${numPage}`
            );
            setNumberShows(data.total_results);
            return await data.results.map(transformInformationMovies);
        } catch (error) {
            console.log(error);
        }
    };

    const getFiltersShows = async (numPage) => {
        const { type, rating, date, genres, countries, certification } =
            assignedFilters;
        const strCountries = countries.join("|");
        const with_origin_country = `with_origin_country=${strCountries}`;
        const strGenres = genres.join("|");
        const with_genres = `with_genres=${strGenres}`;
        const vote_average = `vote_average.gte=${rating * 2}`;
        const include_adult = `include_adult=false`;
        const certification_country = `certification_country=US&certification=${
            certification !== "All" ? certification : ""
        }`;
        let date_gte = null;
        let date_lte = null;
        if (type === "movie") {
            date_gte = `primary_release_date.gte=${date.minDate}-01-01`;
            date_lte = `primary_release_date.lte=${date.maxDate}-12-31`;
        } else {
            date_gte = `first_air_date.gte=${date.minDate}-01-01`;
            date_lte = `first_air_date.lte=${date.maxDate}-12-31`;
        }

        try {
            const data = await request(
                `https://api.themoviedb.org/3/discover/${type}?language=en-US&${date_gte}&${date_lte}&${certification_country}&${with_origin_country}&${with_genres}&${vote_average}&${include_adult}&page=${numPage}&api_key=${_key}&sort_by=popularity.desc`
            );
            setNumberShows(data.total_results);
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
                `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${_key}`
            );
            const tvGenres = await request(
                `https://api.themoviedb.org/3/genre/tv/list?language=en-US&api_key=${_key}`
            );
            dispatch(setGenres(movieGenres.genres, tvGenres.genres));
        } catch (error) {
            console.log(error);
        }
    };

    const getCountries = async () => {
        try {
            const movieCountries = await request(
                `https://api.themoviedb.org/3/configuration/countries?language=en-US&api_key=${_key}`
            );
            dispatch(setCountries(movieCountries));
        } catch (error) {
            console.log(error);
        }
    };

    const getCertifications = async () => {
        try {
            const movieCertifications = await request(
                `https://api.themoviedb.org/3/certification/movie/list?language=en-US&api_key=${_key}`
            );
            const tvCertifications = await request(
                `https://api.themoviedb.org/3/certification/tv/list?language=en-US&api_key=${_key}`
            );
            dispatch(
                setCertifications(
                    [
                        { certification: "All" },
                        ...tvCertifications.certifications.US,
                    ],
                    [
                        { certification: "All" },
                        ...movieCertifications.certifications.US,
                    ]
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const updateMovies = async (newType, newPage) => {
        if (newPage !== numPage) {
            const newData = await getMovies(newType, newPage);
            setNumPage(newPage);
            setMovies([...movies, ...newData]);
        } else if (newType !== type) {
            const newData = await getMovies(newType, 1);
            setNumPage(1);
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

    const nextPage = () => {
        const newPage = numPage + 1;
        updateMovies(type, newPage);
    };

    const changeType = (type) => {
        updateMovies(type, numPage);
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
                        <p className="bold-text">Welcome to Movie Quest!</p>
                        <p>
                            Looking for something to watch tonight? You've come
                            to the right place! Movie Quest is your reliable
                            guide in the world of cinema. We'll help you find
                            the perfect movie for any mood and occasion.
                        </p>
                        <p>
                            Our library includes thousands of films – from
                            classic oldies to the latest releases. Find
                            everything you need in one place.
                        </p>
                        <p>
                            Our intuitive interface allows you to quickly and
                            easily find movies by title, genre, release year,
                            and many other criteria.
                        </p>
                        <p className="bold-text">Join Movie Quest!</p>
                        <p>
                            Start your cinematic journey right now. Simply enter
                            the title of a movie or choose a genre, and we will
                            suggest the best options for you to watch.
                        </p>
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
                            Movies
                        </button>
                        <button
                            className={type === "tv" ? "active-button" : null}
                            onClick={() => {
                                changeType("tv");
                            }}
                        >
                            TV Series
                        </button>
                        <button
                            className={
                                type === "filters" ? "active-button" : null
                            }
                            onClick={() => {
                                changeType("filters");
                            }}
                        >
                            Shows By Filters
                        </button>
                    </div>
                    {countries.length > 0 &&
                        genres.movie.length > 0 &&
                        genres.tv.length > 0 &&
                        certifications.movie.length > 0 &&
                        certifications.tv.length > 0 && (
                            <button onClick={openModalFilters}>Filters</button>
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
                    {movies.length > 0 && numberShows > movies.length && (
                        <button
                            onClick={() => {
                                nextPage();
                            }}
                        >
                            Show more
                        </button>
                    )}
                    {movies.length <= 0 && (
                        <p>
                            According to the selected filters, there are no
                            shows.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
