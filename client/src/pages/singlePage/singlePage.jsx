import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { changeFormatText, createLineFromArray } from "../../helpers/functions";
import NoPoster from "../../assets/no-poster.png";
import NoBackground from "../../assets/no-background.png";
import "./singlePage.scss";

const _key = process.env.REACT_APP_API_KEY;

const SinglePage = () => {
    const { id, type } = useParams();
    const { request } = useHttp();
    const [information, setInformation] = useState({});
    const [sortedInformation, setSortedInformation] = useState({});
    const imgPath = "https://image.tmdb.org/t/p/original";
    const movieInformation = [
        "release_date",
        "production_countries",
        "production_companies",
        "genres",
    ];
    const tvInformation = [
        "first_air_date",
        "last_air_date",
        "number_of_seasons",
        "created_by",
        "production_countries",
        "production_companies",
        "genres",
    ];

    useEffect(() => {
        getInformation(id);
    }, []);

    const getInformation = async (id) => {
        const data = await request(
            `https://api.themoviedb.org/3/${type}/${id}?language=en-US&api_key=${_key}`
        );
        setInformation(data);
        const needInformation =
            type === "movie" ? movieInformation : tvInformation;
        generateInformation(needInformation, data);
    };

    const generateInformation = (needInformation, obj) => {
        const data = needInformation.map((el) => {
            if (Array.isArray(obj[el]) && obj[el].length <= 0) return;
            return (
                obj[el] && (
                    <p>
                        <span className="single-page_information_label">
                            {changeFormatText(el)}:{" "}
                        </span>
                        {Array.isArray(obj[el])
                            ? createLineFromArray(obj[el])
                            : obj[el]}
                    </p>
                )
            );
        });
        setSortedInformation(data);
    };

    return (
        <div className="single-page">
            <img
                src={
                    information.backdrop_path
                        ? `${imgPath}${information.backdrop_path}`
                        : NoBackground
                }
                className="single-page_background"
            />
            <div className="single-page_information">
                <img
                    src={
                        information.poster_path
                            ? `${imgPath}${information.poster_path}`
                            : NoPoster
                    }
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
                            <div className="buttons-wide">
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