import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import Search from "../../assets/icons8-magnifier-64.png";
import "./searchContainer.scss";

const _key = process.env.REACT_APP_API_KEY;

const SearchContainer = () => {
    const [text, setText] = useState("");
    const [results, setResults] = useState({ movie: [], tv: [] });
    const [isVisible, setIsVisible] = useState(false);
    const { request } = useHttp();
    const searchRef = useRef();

    const getShowsByText = async () => {
        try {
            const resultMovie = await request(
                `https://api.themoviedb.org/3/search/movie?language=en-US&query=${text}&api_key=${_key}`
            );
            const resultTv = await request(
                `https://api.themoviedb.org/3/search/tv?language=en-US&query=${text}&api_key=${_key}`
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
                    onClick={() => setIsVisible(false)}
                >
                    {year ? (
                        <p>{`${el.title} (${year})`}</p>
                    ) : (
                        <p>{el.title}</p>
                    )}
                </Link>
            );
        });
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isVisible]);

    return (
        <div className="search" ref={searchRef}>
            <div className="search_container">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(event) => {
                        setText(event.target.value);
                    }}
                />
                <img src={Search} onClick={getShowsByText} />
            </div>
            {isVisible && (
                <div className="search_results-container">
                    {results.movie.length > 0 && (
                        <>
                            <p className="search_results-container_type top">
                                Movie
                            </p>
                            <div className="results">
                                {styleResults(results.movie)}
                            </div>
                        </>
                    )}
                    {results.tv.length > 0 && (
                        <>
                            <p className="search_results-container_type tv">
                                TV
                            </p>
                            <div className="results">
                                {styleResults(results.tv)}
                            </div>
                        </>
                    )}
                    {results.movie.length <= 0 && results.tv.length <= 0 && (
                        <p className="nothing-found">
                            Nothing was found on the request
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchContainer;
