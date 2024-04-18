import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import MovieContainer from "../../components/movieContainer/movieContainer";
import Calendar from "../../components/calendar/calendar";
import "./home.scss";

// eslint-disable-next-line no-undef
const _key = process.env.REACT_APP_API_KEY;

const Home = () => {
    const img_path = "https://image.tmdb.org/t/p/original";
    const { request } = useHttp();
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [movies, setMovies] = useState([]);
    const [type, setType] = useState("movie");
    const [numPage, setNumPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (movies.length < 1) {
                try {
                    const moviesData = await getMovies(type, numPage);
                    if (backgroundImg === null) {
                        setBackgroundImg(
                            `${img_path}${findFirstBackdropPath(moviesData)}`
                        );
                    }
                    setMovies(moviesData);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updteMovies = async (newType, newPage) => {
        if (newPage !== numPage) {
            const newData = await getMovies(newType, newPage);
            setNumPage(newPage);
            setMovies([...movies, ...newData]);
        } else if (newType !== type) {
            const newData = await getMovies(newType, 1);
            setNumPage(1);
            setType(newType);
            setMovies(newData);
        }
    };

    const getMovies = async (type, numPage) => {
        try {
            const data = await request(
                `https://api.themoviedb.org/3/trending/${type}/week?language=en-US&api_key=${_key}&page=${numPage}`
            );
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

    const findFirstBackdropPath = (array) => {
        for (let i = 0; i < array.length; i++) {
            // eslint-disable-next-line no-prototype-builtins
            if (array[i].hasOwnProperty("backdrop_path")) {
                return array[i].backdrop_path;
            }
        }
        return null;
    };

    const nextPage = () => {
        const newPage = numPage + 1;
        updteMovies(type, newPage);
    };

    const changeType = (type) => {
        updteMovies(type, numPage);
    };

    return (
        <div className="home">
            <div className="home_header">
                <img src={backgroundImg} />
                <div className="home_header_information">
                    <span>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Similique consequatur reiciendis facere excepturi
                        iure quis nesciunt, incidunt vitae sed minima! Amet
                        suscipit quisquam adipisci sed soluta est nemo
                        asperiores exercitationem aut eligendi ducimus, quos
                        illum. Error cupiditate tempore totam autem aperiam a
                        quidem voluptates expedita sunt laborum. Iste
                        consequuntur aliquid iusto minus modi, reprehenderit
                        animi facere? Nesciunt reprehenderit vitae ducimus
                        adipisci ipsum quo deleniti blanditiis nam consequatur.
                        Sunt in rerum totam, vitae excepturi accusamus
                        voluptates, praesentium facilis reprehenderit natus
                        nostrum ipsa sequi a, officiis repudiandae culpa cumque
                        voluptate ducimus quasi laborum placeat omnis hic
                        distinctio ullam. Rerum facere eius inventore.
                    </span>
                    <Calendar />
                </div>
            </div>
            <div className="main">
                <hr />
                <div className="main_filters">
                    <div>
                        <button
                            onClick={() => {
                                changeType("movie");
                            }}
                        >
                            Movies
                        </button>
                        <button
                            onClick={() => {
                                changeType("tv");
                            }}
                        >
                            TV Series
                        </button>
                    </div>
                    <button>Filters</button>
                </div>
                <div className="main_movies">
                    {movies &&
                        movies.map((movie) => (
                            <MovieContainer
                                key={movie.id}
                                movieInformation={movie}
                            />
                        ))}
                </div>
                <div className="pages">
                    <button
                        onClick={() => {
                            nextPage();
                        }}
                    >
                        Show more
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
