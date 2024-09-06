import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useHttp } from "../../hooks/http.hook";
import { createLineFromArray } from "../../helpers/functions";
import { api } from "../../helpers/constants";
import StarRatings from "react-star-ratings";
import NoPoster from "../../assets/no-poster.png";
import NoBackground from "../../assets/no-background.png";
import "./singlePage.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const SinglePage = ({
    openModalSeasons,
    openModalAuth,
    setSeasonsInformation,
}) => {
    const { id, type } = useParams();
    const { request } = useHttp();
    const [information, setInformation] = useState({});
    const [types, setTypes] = useState({ saved: false, watched: false });
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
        starDimension: "25px",
        starSpacing: "1px",
        numberOfStars: 5,
        rating: information.vote_average / 2,
        isSelectable: false,
        starRatedColor: "#9f0013",
        starEmptyColor: "rgb(124, 124, 124)",
    };

    useEffect(() => {
        window.scrollTo(0, 0);
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
            getTypesMovie(id);
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

    const getTypesMovie = async (id) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const data = await request(api.getTypesMovie, "GET", {
                userId,
                movieId: id,
            });
            if (data.message === "OK") {
                console.log(data);
                setTypes(data.types);
            } else {
                toast.error(t("error"));
            }
        } catch (error) {
            toast.error(t("error"));
        }
    };

    // const showModal = () => {
    //     setSeasonsInformation(information.seasons);
    //     openModalSeasons();
    // };

    const addToList = async (type) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                openModalAuth();
            } else {
                const data = await request(api[type], "POST", {
                    userId,
                    movieId: information.id,
                });
                if (data.message === "OK") {
                    toast.success(t("addedToListSuccess"));
                } else {
                    toast.error(t("error"));
                }
            }
        } catch (error) {
            toast.error(t("error"));
        }
    };

    const deleteToList = async (type) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                toast.error(t("error"));
            } else {
                const data = await request(api[type], "POST", {
                    userId,
                    movieId: information.id,
                });
                if (data.message === "OK") {
                    toast.success(t("removedFromListSuccess"));
                } else {
                    toast.error(t("error"));
                }
            }
        } catch (error) {
            toast.error(t("error"));
        }
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
                                <StarRatings {...styleRatingStars} />
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
                            <div className="buttons_container button_sticky">
                                {types.watched ? (
                                    <button
                                        onClick={() =>
                                            deleteToList("deleteWatchedMovie")
                                        }
                                    >
                                        {t("notWatched")}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            addToList("addWatchedMovie")
                                        }
                                    >
                                        {t("watched")}
                                    </button>
                                )}
                                {types.saved ? (
                                    <button
                                        className="button_border"
                                        onClick={() =>
                                            deleteToList("deleteSavedMovie")
                                        }
                                    >
                                        {t("delete")}
                                    </button>
                                ) : (
                                    <button
                                        className="button_border"
                                        onClick={() =>
                                            addToList("addSavedMovie")
                                        }
                                    >
                                        {t("save")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePage;
