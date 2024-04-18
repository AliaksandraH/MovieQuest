import { useState } from "react";
import RightArrow from "../../assets/icons8-right-arrow-64.png";
import LeftArrow from "../../assets/icons8-left-arrow-64.png";
import "./calendar.scss";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeDate = (increment) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
    };

    const renderDays = () => {
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const days = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(
                <div key={i} className="calendar_day">
                    <p>{i}</p>
                </div>
            );
        }

        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            days.unshift(
                <div key={`empty${i}`} className="calendar_empty-day"></div>
            );
        }

        return days;
    };

    return (
        <div className="calendar">
            <div className="calendar_header">
                <button onClick={() => changeDate(-1)}>
                    <img src={LeftArrow} alt="left arrow" />
                </button>
                <p>
                    {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <button onClick={() => changeDate(1)}>
                    <img src={RightArrow} alt="right arrow" />
                </button>
            </div>
            <div className="calendar_days">{renderDays()}</div>
        </div>
    );
};

export default Calendar;
