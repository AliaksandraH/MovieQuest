import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeFormatText } from "../../helpers/functions";
import { setFilters } from "../../actions";
import ReactStars from "react-rating-stars-component";
import Genres from "./genres/genres";
import Certifications from "./certifications/certifications";
import SliderDate from "../sliderDate/sliderDate";
import SelectDropdown from "../selectDropdown/selectDropdown";
import "./modalFilters.scss";

const ModalFilters = ({ closeModalFilters, currentFilters }) => {
    const { type, rating, certification } = currentFilters;
    const dispatch = useDispatch();
    const { countries } = useSelector((store) => store);
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
        size: 27,
        value: minRating,
        edit: true,
        activeColor: "#e0dede",
        isHalf: true,
        count: 5,
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
                        {el === "tv" ? el.toUpperCase() : changeFormatText(el)}
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

    return (
        <>
            <div className="modal-filters">
                <div className="filter_container ">
                    <span className="label">Type:</span>
                    {createStyleTypes()}
                </div>
                <div className="filter_container ">
                    <span className="label">Minimum rating:</span>
                    <div className="stars">
                        <ReactStars
                            {...styleRatingStars}
                            onChange={setMinRating}
                        />
                    </div>
                </div>
                <SliderDate date={date} setDate={setDate} />
                <div className="filter_container-countries ">
                    <span className="label">Countries:</span>
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
            </div>
            <div className="buttons-wide button_sticky" onClick={getShows}>
                <button>Save</button>
            </div>
        </>
    );
};

export default ModalFilters;
