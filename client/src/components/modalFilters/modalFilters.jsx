import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { useHttp } from "../../hooks/http.hook";
import { changeFormatText } from "../../helpers/functions";
import SliderDate from "../sliderDate/sliderDate";
import SelectDropdown from "../selectDropdown/selectDropdown";
import IconClase from "../../assets/icons8-close-26.png";
import "./modalFilters.scss";

const _key = process.env.REACT_APP_API_KEY;

const ModalFilters = ({ closeModalFilters }) => {
    const { request } = useHttp();
    const minDate = 1895;
    const maxDate = new Date().getFullYear();
    const { genres, countries } = useSelector((store) => store);
    const [styleGenres, setStyleGenres] = useState("");
    const [checkedType, setCheckedType] = useState("movie");
    const [date, setDate] = useState({ minDate, maxDate });
    const [checkedGenres, setCheckedGenres] = useState([]);
    const [checkedСountries, setCheckedСountries] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const types = ["movie", "tv"];

    const styleRating = {
        size: 27,
        value: minRating,
        edit: true,
        activeColor: "#e0dede",
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        createStyleGenres(checkedType);
    }, [checkedType]);

    const closeModalHandler = (value) => {
        if (value.target.className === "modal") {
            closeModalFilters();
        }
    };

    const createStyleTypes = () => {
        return types.map((type, id) => {
            return (
                <div
                    className="filters_container_value-type"
                    key={`${type}_${id}`}
                >
                    <input
                        type="radio"
                        value={type}
                        checked={checkedType === type}
                        onChange={changeType}
                    />
                    <span className="input-label">
                        {type === "tv"
                            ? type.toUpperCase()
                            : changeFormatText(type)}
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

    const ratingChanged = (newRating) => {
        setMinRating(newRating);
    };

    const getMovies = async () => {
        console.log(
            "Type: ",
            checkedType,
            " Date: ",
            date.minDate,
            " - ",
            date.maxDate,
            " Genres: ",
            checkedGenres,
            " Сountries: ",
            checkedСountries,
            " Rating: ",
            minRating
        );
        const data = await request(
            `https://api.themoviedb.org/3/discover/${checkedType}?language=en-US&page=1&primary_release_date.gte=${
                date.minDate
            }-01-01&primary_release_date.lte=${
                date.maxDate
            }-12-31&with_origin_country=${checkedСountries.join(
                "|"
            )}&with_genres=${checkedGenres.join("|")}&vote_average.gte=${
                minRating * 2
            }&api_key=${_key}`
        );
        console.log(data);
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
                                {...styleRating}
                                onChange={ratingChanged}
                            />
                        </div>
                    </div>
                    <SliderDate
                        date={date}
                        setDate={setDate}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
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
                <div className="buttons-wide">
                    <button onClick={getMovies}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default ModalFilters;
