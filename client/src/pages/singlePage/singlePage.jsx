import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import "./singlePage.scss";

const _key = process.env.REACT_APP_API_KEY;

const SinglePage = () => {
    const { id, type } = useParams();
    const { request } = useHttp();
    const [information, setInformation] = useState({});
    const [sortedInformation, setSortedInformation] = useState({});
    const imgPath = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        getInformation(id);
    }, []);

    const getInformation = async (id) => {
        const data = await request(
            `https://api.themoviedb.org/3/${type}/${id}?language=en-US&api_key=${_key}`
        );
        setInformation(data);
        const needInformation =
            type === "movie"
                ? [
                      "release_date",
                      "production_countries",
                      "production_companies",
                      "genres",
                  ]
                : [
                      "first_air_date",
                      "last_air_date",
                      "number_of_seasons",
                      "created_by",
                      "production_countries",
                      "production_companies",
                      "genres",
                  ];
        generateInformation(needInformation, data);
    };

    const createLineFromArray = (array) => {
        return array.map((el, i) =>
            i === array.length - 1 ? `${el.name}` : `${el.name}, `
        );
    };

    const formatText = (text) => {
        return (text.charAt(0).toUpperCase() + text.slice(1))
            .split("_")
            .join(" ");
    };

    const generateInformation = (needInformation, obj) => {
        const data = needInformation.map((el) => {
            return (
                obj[el] &&
                (Array.isArray(obj[el]) ? (
                    <p>
                        <span className="single-page_information_label">
                            {formatText(el)}:{" "}
                        </span>
                        {createLineFromArray(obj[el])}
                    </p>
                ) : (
                    <p>
                        <span className="single-page_information_label">
                            {formatText(el)}:{" "}
                        </span>
                        {obj[el]}
                    </p>
                ))
            );
        });
        setSortedInformation(data);
    };

    return (
        <div className="single-page">
            <img
                src={`${imgPath}${information.backdrop_path}`}
                className="single-page_background"
            />
            <div className="single-page_information">
                <img
                    src={`${imgPath}${information.poster_path}`}
                    className="poster"
                />
                {Object.keys(information).length > 0 && (
                    <div className="single-page_information_container">
                        {(information.title || information.name) && (
                            <p className="single-page_information_title">
                                {information.title
                                    ? information.title
                                    : information.name}
                            </p>
                        )}
                        {information.tagline && (
                            <p className="single-page_information_tagline">
                                {information.tagline}
                            </p>
                        )}
                        <div className="single-page_information_container_transparent">
                            {sortedInformation}
                            {information.overview && (
                                <p className="single-page_information_overview">
                                    {information.overview}
                                </p>
                            )}
                            <div className="single-page_information_buttons">
                                <button>Save</button>
                                <button className="button_border">
                                    Watched
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePage;
