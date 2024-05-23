import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changeFormatText } from "../../helpers/functions";
import SliderDate from "../multiRangeSlider/sliderDate";
import IconClase from "../../assets/icons8-close-26.png";
import "./modalFilters.scss";

const ModalFilters = ({ closeModalFilters }) => {
    const minDate = 1895;
    const maxDate = new Date().getFullYear();
    const { genres } = useSelector((store) => store);
    const [checkedType, setCheckedType] = useState("movie");
    const [date, setDate] = useState({ minDate, maxDate });
    const [checkedGenres, setCheckedGenres] = useState([]);
    const [styleGenres, setStyleGenres] = useState("");
    const types = ["movie", "tv"];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        createStyleGenres(checkedType);
    }, [checkedType]);

    useEffect(() => {
        console.log(
            "Type: ",
            checkedType,
            " Date: ",
            date.minDate,
            " - ",
            date.maxDate,
            " Genres: ",
            checkedGenres
        );
    }, [checkedType, date, checkedGenres]);

    const closeModalHandler = (value) => {
        if (value.target.className === "modal") {
            closeModalFilters();
        }
    };

    const createStyleTypes = () => {
        return types.map((type) => {
            return (
                <div className="filters_container_value-type">
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
        const style = genres[type].map((el, id) => {
            return (
                <div key={`${el}_${id}`}>
                    <input
                        type="checkbox"
                        id={el}
                        value={el}
                        onChange={changeGenres}
                    />
                    <span className="input-label">{el}</span>
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
                </div>
                <div className="buttons-wide">
                    <button>Save</button>
                </div>
            </div>
        </div>
    );
};

export default ModalFilters;
