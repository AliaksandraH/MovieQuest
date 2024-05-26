import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeFormatText } from "../../helpers/functions";
import { setFilters } from "../../actions";
import ReactStars from "react-rating-stars-component";
import SliderDate from "../sliderDate/sliderDate";
import SelectDropdown from "../selectDropdown/selectDropdown";
import IconClase from "../../assets/icons8-close-26.png";
import "./modalFilters.scss";

const ModalFilters = ({ closeModalFilters, currentFilters }) => {
    const { type, rating } = currentFilters;
    const dispatch = useDispatch();
    const { genres, countries } = useSelector((store) => store);
    const [styleGenres, setStyleGenres] = useState("");
    const [checkedType, setCheckedType] = useState(type);
    const [minRating, setMinRating] = useState(rating);
    const [date, setDate] = useState({
        minDate: currentFilters.date.minDate,
        maxDate: currentFilters.date.maxDate,
    });
    const [checkedGenres, setCheckedGenres] = useState([]);
    const [checkedСountries, setCheckedСountries] = useState([]);
    const types = ["movie", "tv"];
    const styleRatingStars = {
        size: 27,
        value: minRating,
        edit: true,
        activeColor: "#e0dede",
        isHalf: true,
        count: 5,
    };

    useEffect(() => {
        createStyleGenres(checkedType);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const closeModalHandler = (value) => {
        if (value.target.className === "modal") {
            closeModalFilters();
        }
    };

    const closeModal = () => {
        closeModalFilters();
    };

    const createStyleTypes = () => {
        return types.map((el, id) => {
            return (
                <div
                    className="filters_container_value-type"
                    key={`${el}_${id}`}
                >
                    <input
                        type="radio"
                        value={el}
                        checked={checkedType === el}
                        onChange={changeType}
                    />
                    <span className="input-label">
                        {el === "tv" ? el.toUpperCase() : changeFormatText(el)}
                    </span>
                </div>
            );
        });
    };

    const createStyleGenres = (type) => {
        setCheckedGenres([]);
        const style = genres[type].map((el) => {
            return (
                <div key={`${el.id}`}>
                    <input
                        type="checkbox"
                        value={el.id}
                        onChange={changeGenres}
                    />
                    <span className="input-label">{el.name}</span>
                </div>
            );
        });
        setStyleGenres(style);
    };

    const changeType = (event) => {
        setCheckedType(event.target.value);
        createStyleGenres(event.target.value);
    };

    const changeGenres = (event) => {
        const value = event.target.value;
        setCheckedGenres((prevSelectedOptions) => {
            if (prevSelectedOptions.includes(value)) {
                return prevSelectedOptions.filter((option) => option !== value);
            } else {
                return [...prevSelectedOptions, value];
            }
        });
    };

    const getShows = async () => {
        dispatch(
            setFilters(
                checkedType,
                minRating,
                { minDate: date.minDate, maxDate: date.maxDate },
                checkedGenres,
                checkedСountries
            )
        );
        closeModal();
    };

    return (
        <div className="modal" onClick={closeModalHandler}>
            <div className="modal_container">
                <div className="modal_header">
                    <h2>Filters</h2>
                    <button onClick={closeModalFilters}>
                        <img src={IconClase} alt="close" />
                    </button>
                </div>
                <div className="modal_filters">
                    <div className="filters_container ">
                        <span className="label">Type:</span>
                        {createStyleTypes()}
                    </div>
                    <div className="filters_container ">
                        <span className="label">Minimum rating:</span>
                        <div className="stars">
                            <ReactStars
                                {...styleRatingStars}
                                onChange={setMinRating}
                            />
                        </div>
                    </div>
                    <SliderDate date={date} setDate={setDate} />
                    <div className="filters_container ">
                        <span className="label">Genres:</span>
                        <div className="filters_container_values-genres">
                            {styleGenres}
                        </div>
                    </div>
                    <div className="filters_container-countries ">
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
                </div>
                <div className="buttons-wide" onClick={getShows}>
                    <button>Save</button>
                </div>
            </div>
        </div>
    );
};

export default ModalFilters;
