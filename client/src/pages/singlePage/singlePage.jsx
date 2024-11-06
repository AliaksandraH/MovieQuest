import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useHttp } from "../../hooks/http.hook";
import { createLineFromArray } from "../../helpers/functions";
import { api } from "../../helpers/constants";
import StarRatings from "react-star-ratings";
import Modal from "../../components/modal/modal";
import ModalRating from "../../components/modalRating/modalRating";
import ModalTrailer from "../../components/modalTrailer/modalTrailer";
// import ModalSeasons from "../../components/modalSeasons/modalSeasons";
import Spinner from "../../components/spinner/spinner";
import NoPoster from "../../assets/no-poster.png";
import NoBackground from "../../assets/no-background.png";
import Play from "../../assets/icons8-play-100.png";
import "./singlePage.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

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

const SinglePage = ({ openModalAuth }) => {
    const { id, type } = useParams();
    const navigate = useNavigate();
    const { request } = useHttp();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const userId = useSelector((state) => state.userId);

    const [modalRating, setModalRating] = useState(false);
    const [modalTrailer, setModalTrailer] = useState(false);
    // const [modalSeasons, setModalSeasons] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [information, setInformation] = useState({});
    const [types, setTypes] = useState({ saved: false, watched: false });
    const [sortedInformation, setSortedInformation] = useState({});
    const [loadingInformation, setLoadingInformation] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [loadingWatched, setLoadingWatched] = useState(false);
    const [loadingTrailer, setLoadingTrailer] = useState(false);

    const prevUserId = useRef(userId);
    const prevCurrentLanguage = useRef(currentLanguage);
    const prevId = useRef(id);

    const styleRatingStars = {
        starDimension: "25px",
        starSpacing: "1px",
        numberOfStars: 5,
        rating: information.vote_average || 0 / 2,
        isSelectable: false,
        starRatedColor: "#9f0013",
        starEmptyColor: "rgb(124, 124, 124)",
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getInformation(id);
    }, []);

    useEffect(() => {
        if (prevId.current === id) return;
        getInformation(id);
        prevId.current = id;
    }, [id]);

    useEffect(() => {
        if (prevCurrentLanguage.current === currentLanguage) return;
        getInformation(id);
        prevCurrentLanguage.current = currentLanguage;
    }, [currentLanguage]);

    useEffect(() => {
        if (userId === prevUserId.current) return;
        getTypesMovie(id);
        prevUserId.current = userId;
    }, [userId]);

    const openModalRating = () => setModalRating(true);
    const closeModalRating = () => setModalRating(false);

    const modalRatingProps = {
        closeModalRating,
        openModalAuth,
    };

    const getInformation = async (id) => {
        try {
            setLoadingInformation(true);
            const data = await request(
                `https://api.themoviedb.org/3/${type}/${id}?language=${currentLanguage}&api_key=${_key}`
            );
            if (
                data.status_message ===
                "The resource you requested could not be found."
            ) {
                navigate("/404");
            }
            setInformation(data);
            const needInformation =
                type === "movie" ? movieInformation : tvInformation;
            generateInformation(needInformation, data);
            getTypesMovie(id);
        } catch (error) {
            console.log(error);
            navigate("/404");
        } finally {
            setLoadingInformation(false);
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
            setLoadingSaved(true);
            setLoadingWatched(true);
            if (!userId) {
                setTypes({ saved: false, watched: false });
                return;
            }
            const data = await request(api.getTypesMovie, "GET", {
                userId,
                movieId: id,
                type,
            });
            if (data.message === "OK") {
                setTypes(data.types);
            } else {
                toast.error(t("error"));
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoadingSaved(false);
            setLoadingWatched(false);
        }
    };

    const addToList = async (url, loading) => {
        try {
            if (!userId) {
                openModalAuth();
            } else {
                loading(true);
                const data = await request(api[url], "POST", {
                    userId,
                    movieId: id,
                    type,
                });
                if (data.message === "OK") {
                    // toast.success(t("addedToListSuccess"));
                    setTypes(data.types);
                    if (url === "addWatchedMovie") {
                        openModalRating();
                    }
                } else {
                    toast.error(t("error"));
                }
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            loading(false);
        }
    };

    const deleteToList = async (url, loading) => {
        try {
            if (!userId) {
                toast.error(t("error"));
            } else {
                loading(true);
                const data = await request(api[url], "POST", {
                    userId,
                    movieId: id,
                    type,
                });
                if (data.message === "OK") {
                    // toast.success(t("removedFromListSuccess"));
                    setTypes(data.types);
                } else {
                    toast.error(t("error"));
                }
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            loading(false);
        }
    };

    const showModalTrailer = async () => {
        try {
            setLoadingTrailer(true);
            const fetchTrailerData = async (lang) => {
                return await request(
                    `https://api.themoviedb.org/3/${type}/${id}/videos?language=${lang}&api_key=${_key}`
                );
            };
            let data = await fetchTrailerData(currentLanguage);
            if (!data?.results.length) {
                data = await fetchTrailerData("en-US");
            }
            if (data?.results.length) {
                findTrailer(data.results);
            } else {
                toast.error(t("trailerNotFound"));
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoadingTrailer(false);
        }
    };

    const findTrailer = (data) => {
        const videosYouTube = data.filter((video) => video.site === "YouTube");
        if (videosYouTube.length) {
            const trailer =
                videosYouTube.find((video) => video.type === "Trailer") ||
                videosYouTube[0];
            const keyTrailer = trailer.key;
            setTrailerUrl(`https://www.youtube.com/embed/${keyTrailer}`);
            setModalTrailer(true);
        } else {
            toast.error(t("trailerNotFound"));
        }
    };

    const closeModalTrailer = () => {
        setTrailerUrl("");
        setModalTrailer(false);
    };

    // const [seasonsInformation, setSeasonsInformation] = useState(false);
    // const modalSeasonsProps = {
    //     seasonsInformation: seasonsInformation,
    // };
    // const showModal = () => {
    //     setSeasonsInformation(information.seasons);
    //     setModalSeasons(true);
    // };
    // const closeModal = () => setModalSeasons(false);

    return (
        <div className="single-page">
            {modalRating && (
                <Modal
                    Component={ModalRating}
                    componentProps={modalRatingProps}
                    nameModal="rating"
                    closeModal={closeModalRating}
                />
            )}
            {modalTrailer && trailerUrl && (
                <Modal
                    Component={ModalTrailer}
                    componentProps={{ trailerUrl }}
                    nameModal="trailer"
                    closeModal={closeModalTrailer}
                />
            )}
            {/* {modalSeasons && (
                <Modal
                    Component={ModalSeasons}
                    componentProps={modalSeasonsProps}
                    nameModal="seasons"
                    closeModal={closeModal}
                />
            )} */}
            <img
                src={
                    information.backdrop_path
                        ? `${imgPath}${information.backdrop_path}`
                        : NoBackground
                }
                className="single-page_background"
            />
            <div className="single-page_information">
                <div className="single-page_information_container_poster">
                    <img
                        src={
                            information.poster_path
                                ? `${imgPath}${information.poster_path}`
                                : NoPoster
                        }
                        className="poster"
                    />
                    <button onClick={showModalTrailer}>
                        {!loadingTrailer ? (
                            <>
                                <img src={Play} />
                                <span>{t("trailer")}</span>
                            </>
                        ) : (
                            <Spinner width={20} height={20} />
                        )}
                    </button>
                </div>
                {loadingInformation && (
                    <div className="single-page_information_container_spinner">
                        <Spinner />
                    </div>
                )}
                {Object.keys(information).length > 0 && !loadingInformation && (
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
                                        className="button_delete"
                                        onClick={() =>
                                            deleteToList(
                                                "deleteWatchedMovie",
                                                setLoadingWatched
                                            )
                                        }
                                    >
                                        {!loadingWatched ? (
                                            t("notWatched")
                                        ) : (
                                            <Spinner
                                                width={20}
                                                height={20}
                                                color="#9f0013"
                                            />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className="button_add"
                                        onClick={() =>
                                            addToList(
                                                "addWatchedMovie",
                                                setLoadingWatched
                                            )
                                        }
                                    >
                                        {!loadingWatched ? (
                                            t("watched")
                                        ) : (
                                            <Spinner width={20} height={20} />
                                        )}
                                    </button>
                                )}
                                {types.saved ? (
                                    <button
                                        className="button_border button_delete"
                                        onClick={() =>
                                            deleteToList(
                                                "deleteSavedMovie",
                                                setLoadingSaved
                                            )
                                        }
                                    >
                                        {!loadingSaved ? (
                                            t("delete")
                                        ) : (
                                            <Spinner
                                                width={20}
                                                height={20}
                                                color="#9f0013"
                                            />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className="button_border button_add"
                                        onClick={() =>
                                            addToList(
                                                "addSavedMovie",
                                                setLoadingSaved
                                            )
                                        }
                                    >
                                        {!loadingSaved ? (
                                            t("save")
                                        ) : (
                                            <Spinner width={20} height={20} />
                                        )}
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
