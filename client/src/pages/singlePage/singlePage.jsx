import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { createLineFromArray } from "../../helpers/functions";
import ReactStars from "react-rating-stars-component";
import NoPoster from "../../assets/no-poster.png";
import NoBackground from "../../assets/no-background.png";
import "./singlePage.scss";

const _key = process.env.REACT_APP_API_KEY;

const SinglePage = ({ openModalSeasons, setSeasonsInformation }) => {
    const { id, type } = useParams();
    const { request } = useHttp();
    const [information, setInformation] = useState({});
    const [sortedInformation, setSortedInformation] = useState({});
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const imgPath = "https://image.tmdb.org/t/p/original";
    const movieInformation = [
        "original_title",
        "release_date",
        "production_countries",
        "production_companies",
        "genres",
    ];
    const tvInformation = [
        "original_name",
        "first_air_date",
        "last_air_date",
        "number_of_seasons",
        "created_by",
        "production_countries",
        "production_companies",
        "genres",
    ];
    const statusColors = {
        "Returning Series": "rgba(0, 146, 6, 0.4)",
        Ended: "rgba(159, 0, 19, 0.4)",
        Released: "rgba(0, 146, 6, 0.4)",
        Default: "rgba(39, 39, 39, 0.4)",
    };
    const styleRatingStars = {
        size: 29,
        edit: false,
        value: information.vote_average / 2,
        activeColor: "#9f0013",
        isHalf: true,
        color: "rgba(39, 39, 39, 0.4)",
    };

    useEffect(() => {
        getInformation(id);
    }, []);

    useEffect(() => {
        getInformation(id);
    }, [id, currentLanguage]);

    const getInformation = async (id) => {
        try {
            const data = await request(
                `https://api.themoviedb.org/3/${type}/${id}?language=${currentLanguage}&api_key=${_key}`
            );
            setInformation(data);
            const needInformation =
                type === "movie" ? movieInformation : tvInformation;
            generateInformation(needInformation, data);
        } catch (error) {
            console.log(error);
        }
    };

    const generateInformation = (needInformation, obj) => {
        const data = needInformation.map((el, id) => {
            if (Array.isArray(obj[el]) && obj[el].length <= 0) return;
            return (
                obj[el] && (
                    <p key={`${el}_${id}`}>
                        <span className="single-page_information_label">
                            {t(el)}:{" "}
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

    const showModal = () => {
        setSeasonsInformation(information.seasons);
        openModalSeasons();
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
                        <div className="single-page_information_container_header">
                            <div className="stars">
                                <ReactStars {...styleRatingStars} />
                            </div>
                            <div className="single-page_information_main">
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
                            </div>
                            {information.status && (
                                <div className="single-page_information_status">
                                    <p
                                        style={{
                                            background:
                                                statusColors[
                                                    information.status
                                                ] || statusColors.Default,
                                        }}
                                    >
                                        {t(information.status) ||
                                            information.status}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="single-page_information_container_transparent">
                            {sortedInformation}
                            {information.overview && (
                                <p className="single-page_information_overview">
                                    {information.overview}
                                </p>
                            )}
                            <div className="buttons-wide button_sticky">
                                <button>{t("save")}</button>
                                <button
                                    className="button_border"
                                    onClick={() => {
                                        type === "tv" && showModal();
                                    }}
                                >
                                    {t("watched")}
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
