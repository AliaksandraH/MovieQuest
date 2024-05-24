import MultiRangeSlider from "multi-range-slider-react";
import { minDate, maxDate } from "../../helpers/constants.js";
import "./sliderDate.scss";

const SliderDate = ({ date, setDate }) => {
    const gray = "rgb(124, 124, 124)";
    const white = "#e0dede";

    const changeDate = (event) => {
        if (event.minValue === date.minDate && event.maxValue === date.maxDate)
            return;
        setDate({
            minDate: event.minValue,
            maxDate: event.maxValue,
        });
    };

    return (
        <div className="slider-container">
            <p>
                <span className="slider-container_label">Year of release:</span>{" "}
                {date.minDate} - {date.maxDate} years
            </p>
            <MultiRangeSlider
                min={minDate}
                max={maxDate}
                step={10}
                minValue={date.minDate}
                maxValue={date.maxDate}
                canMinMaxValueSame={true}
                barInnerColor="#a8192a"
                barRightColor={gray}
                barLeftColor={gray}
                thumbLeftColor={white}
                thumbRightColor={white}
                className="slider"
                ruler={false}
                onInput={(event) => {
                    changeDate(event);
                }}
            />
        </div>
    );
};

export default SliderDate;
