import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setFilters, resetFilters } from "../../actions";
import StarRatings from "react-star-ratings";
import Genres from "./genres/genres";
import Certifications from "./certifications/certifications";
import SliderDate from "../sliderDate/sliderDate";
import SelectDropdown from "../selectDropdown/selectDropdown";
import "./modalFilters.scss";

const ModalFilters = ({ closeModalFilters, currentFilters }) => {
    const { type, rating, certification } = currentFilters;
    const dispatch = useDispatch();
    const countries = useSelector((state) => state.countries);
    const { t } = useTranslation();
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

    const types = ["movie", "tv"];
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

    const changeType = (event) => {
        setCheckedCertification("All");
        setCheckedGenres([]);
        setCheckedType(event.target.value);
    };

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
            <Genres
                type={checkedType}
                checkedGenres={checkedGenres}
                setCheckedGenres={setCheckedGenres}
            />
            <Certifications
                type={checkedType}
                checkedCertification={checkedCertification}
                setCheckedCertification={setCheckedCertification}
            />
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
