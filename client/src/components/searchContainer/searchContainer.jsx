import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { setMouseYposition } from "../../actions";
import Search from "../../assets/icons8-magnifier-64.png";
import "./searchContainer.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const SearchContainer = () => {
    const { request } = useHttp();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const searchRef = useRef();

    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [debouncedValue, setDebouncedValue] = useState(text);
    const [results, setResults] = useState({ movie: [], tv: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!text.trim()) {
            setIsVisible(false);
            return;
        }
        const timerId = setTimeout(() => {
            setDebouncedValue(text);
        }, 300);
        return () => {
            clearTimeout(timerId);
        };
    }, [text]);

    useEffect(() => {
        if (debouncedValue) {
            getShowsByText();
        }
    }, [debouncedValue]);

    useEffect(() => {
        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isVisible]);

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    const getShowsByText = async () => {
        try {
            if (!text.trim()) return;
            const resultMovie = await request(
                `https://api.themoviedb.org/3/search/movie?language=${currentLanguage}&query=${text}&api_key=${_key}`
            );
            const resultTv = await request(
                `https://api.themoviedb.org/3/search/tv?language=${currentLanguage}&query=${text}&api_key=${_key}`
            );
            const transformMovie = resultMovie.results.map((el) =>
                transformInformationShows(el, "movie")
            );
            const transformTv = resultTv.results.map((el) =>
                transformInformationShows(el, "tv")
            );
            setResults({ movie: transformMovie, tv: transformTv });
            setIsVisible(true);
        } catch (error) {
            console.log(error);
        }
    };

    const transformInformationShows = (show, type) => {
        return {
            id: show.id,
            type: type,
            title: show.title ? show.title : show.name,
            date:
                show.release_date || show.first_air_date
                    ? show.release_date || show.first_air_date
                    : "",
        };
    };

    const styleResults = (arr) => {
        return arr.map((el) => {
            const year = new Date(el.date).getFullYear();
            return (
                <Link
                    to={`/${el.type}/${el.id}`}
                    className="search_result"
                    key={el.id}
                    onClick={() => {
                        dispatch(setMouseYposition(0));
                        setIsVisible(false);
                    }}
                >
                    {year ? (
                        <p>
                            {`${el.title}`}
                            <span className="year">{`(${year})`}</span>
                        </p>
                    ) : (
                        <p>{el.title}</p>
                    )}
                </Link>
            );
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            goToPage();
        }
    };

    const goToPage = () => {
        if (!text.trim()) return;
        setIsVisible(false);
        navigate(`/search/${text.trim()}`);
    };

    return (
        <div className="search" ref={searchRef}>
            <div className="search_container">
                <input
                    type="text"
                    value={text}
                    placeholder={`${t("search")}...`}
                    onChange={(event) => {
                        setText(event.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                />
                <img src={Search} onClick={goToPage} />
            </div>
            {isVisible && (
                <div className="search_results-container">
                    {results.movie.length > 0 && (
                        <>
                            <p className="search_results-container_type top">
                                {t("movies")}
                            </p>
                            <div className="results">
                                {styleResults(results.movie)}
                            </div>
                        </>
                    )}
                    {results.tv.length > 0 && (
                        <>
                            <p className="search_results-container_type tv">
                                {t("tvSeries")}
                            </p>
                            <div className="results">
                                {styleResults(results.tv)}
                            </div>
                        </>
                    )}
                    {results.movie.length <= 0 && results.tv.length <= 0 && (
                        <p className="nothing-found">{t("nothingWasFound")}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchContainer;
