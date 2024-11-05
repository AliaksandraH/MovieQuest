import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import {
    setFilters,
    resetFilters,
    setGenres,
    setCountries,
    setCertifications,
} from "../../actions";
import StarRatings from "react-star-ratings";
import Genres from "./genres/genres";
import Certifications from "./certifications/certifications";
import SliderDate from "../sliderDate/sliderDate";
import SelectDropdown from "../selectDropdown/selectDropdown";
import "./modalFilters.scss";

const _key = process.env.REACT_APP_API_TMDB_KEY;

const types = ["movie", "tv"];

const ModalFilters = ({ closeModalFilters, currentFilters }) => {
    const { request } = useHttp();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const { type, rating, certification } = currentFilters;

    const dispatch = useDispatch();
    const countries = useSelector((state) => state.countries);
    const genres = useSelector((state) => state.genres);
    const certifications = useSelector((state) => state.certifications);

    const [checkedType, setCheckedType] = useState(type);
    const [minRating, setMinRating] = useState(rating);
    const [checkedGenres, setCheckedGenres] = useState(currentFilters.genres);
    const [checkedСountries, setCheckedСountries] = useState(
        currentFilters.countries
    );
    const [checkedCertification, setCheckedCertification] =
        useState(certification);
    const [date, setDate] = useState({
        minDate: currentFilters.date.minDate,
        maxDate: currentFilters.date.maxDate,
    });

    const styleRatingStars = {
        starDimension: "27px",
        starSpacing: "2px",
        numberOfStars: 5,
        rating: minRating,
        isSelectable: true,
        starRatedColor: "#9f0013",
        starHoverColor: "#9f0013",
        starEmptyColor: "rgb(124, 124, 124)",
    };

    useEffect(() => {
        dataForFilters();
    }, [currentLanguage]);

    const getShows = async () => {
        dispatch(
            setFilters(
                checkedType,
                minRating,
                { minDate: date.minDate, maxDate: date.maxDate },
                checkedGenres,
                checkedСountries,
                checkedCertification
            )
        );
        closeModalFilters();
    };

    const reset = () => {
        dispatch(resetFilters());
        closeModalFilters();
    };

    const changeType = (event) => {
        setCheckedCertification("All");
        setCheckedGenres([]);
        setCheckedType(event.target.value);
    };

    const dataForFilters = () => {
        getGenres();
        getCountries();
        getCertifications();
    };

    const getGenres = async () => {
        const movieGenres = await request(
            `https://api.themoviedb.org/3/genre/movie/list?language=${currentLanguage}&api_key=${_key}`
        );
        const tvGenres = await request(
            `https://api.themoviedb.org/3/genre/tv/list?language=${currentLanguage}&api_key=${_key}`
        );
        dispatch(setGenres(movieGenres?.genres || [], tvGenres?.genres || []));
    };

    const getCountries = async () => {
        const movieCountries = await request(
            `https://api.themoviedb.org/3/configuration/countries?language=${currentLanguage}&api_key=${_key}`
        );
        dispatch(setCountries(movieCountries || []));
    };

    const getCertifications = async () => {
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
                    ...(tvCertifications?.certifications[certification] || []),
                ],
                [
                    { certification: "All" },
                    ...(movieCertifications?.certifications[certification] ||
                        []),
                ]
            )
        );
    };

    const createStyleTypes = () => {
        return types.map((el, id) => {
            return (
                <div
                    className="filter_container_values-type"
                    key={`${el}_${id}`}
                >
                    <input
                        id={el}
                        type="radio"
                        value={el}
                        checked={checkedType === el}
                        onChange={changeType}
                        name="type"
                    />
                    <label htmlFor={el} className="input-label">
                        {el === "movie" ? t("movies") : t(el)}
                    </label>
                </div>
            );
        });
    };

    return (
        <div className="modal-filters">
            <div className="filter_container ">
                <span className="label">{t("type")}:</span>
                {createStyleTypes()}
            </div>
            <div className="filter_container filter_container_rating">
                <span className="label">{t("minimumrating")}:</span>
                <div className="stars">
                    <StarRatings
                        {...styleRatingStars}
                        changeRating={setMinRating}
                    />
                </div>
            </div>
            <SliderDate date={date} setDate={setDate} />
            {countries.length > 0 && (
                <div className="filter_container-countries ">
                    <span className="label">{t("countries")}:</span>
                    <div className="container-select">
                        <SelectDropdown
                            data={countries}
                            labelField={"native_name"}
                            valueField={"iso_3166_1"}
                            values={checkedСountries}
                            setValues={setCheckedСountries}
                        />
                    </div>
                </div>
            )}
            {genres?.movie.length > 0 && genres?.tv.length > 0 && (
                <Genres
                    type={checkedType}
                    checkedGenres={checkedGenres}
                    setCheckedGenres={setCheckedGenres}
                />
            )}
            {certifications?.movie.length > 0 &&
                certifications?.tv.length > 0 && (
                    <Certifications
                        type={checkedType}
                        checkedCertification={checkedCertification}
                        setCheckedCertification={setCheckedCertification}
                    />
                )}
            <div className="buttons-wide button_sticky">
                <button onClick={reset}>{t("resetFilters")}</button>
                <button className="button_border" onClick={getShows}>
                    {t("save")}
                </button>
            </div>
        </div>
    );
};

export default ModalFilters;
