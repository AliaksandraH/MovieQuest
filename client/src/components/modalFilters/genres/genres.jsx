import { useSelector } from "react-redux";
import "../modalFilters.scss";

const Genres = ({ type, checkedGenres, setCheckedGenres }) => {
    const { genres } = useSelector((state) => state);

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
        <div className="filter_container">
            <span className="label">Genres:</span>
            <div className="filter_container_values">{createStyleGenres()}</div>
        </div>
    );
};

export default Genres;
