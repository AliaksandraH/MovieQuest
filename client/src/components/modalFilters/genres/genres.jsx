import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ArrowDown from "../../../assets/icons8-arrow-down.png";
import ArrowUp from "../../../assets/icons8-arrow-up.png";
import "../modalFilters.scss";

const Genres = ({
    type,
    checkedGenres,
    setCheckedGenres,
    title = "genres",
    isSelectList = false,
}) => {
    const { t } = useTranslation();
    const genres = useSelector((state) => state.genres);

    const [showList, setShowList] = useState(!isSelectList);

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

    const createStyleGenres = () => {
        return genres[type].map((el) => {
            return (
                <div key={el.id}>
                    <input
                        id={el.id}
                        type="checkbox"
                        value={el.id}
                        onChange={changeGenres}
                        checked={checkedGenres.includes(el.id.toString())}
                    />
                    <label htmlFor={el.id} className="input-label">
                        {el.name}
                    </label>
                </div>
            );
        });
    };

    return (
        <div className="filter_container filter_container_col">
            {isSelectList ? (
                <div
                    className="drop-down_list"
                    onClick={() => setShowList((state) => !state)}
                >
                    <span className="label">{t(title)}:</span>
                    <img src={showList ? ArrowUp : ArrowDown} alt="arrow" />
                </div>
            ) : (
                <span className="label">{t(title)}:</span>
            )}
            {showList && (
                <div className="filter_container_values">
                    {createStyleGenres()}
                </div>
            )}
        </div>
    );
};

export default Genres;
