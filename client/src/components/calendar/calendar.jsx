import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import i18next from "i18next";
import { useHttp } from "../../hooks/http.hook";
import { api } from "../../helpers/constants";
import "./calendar.scss";

const Calendar = () => {
    const currentLanguage = i18next.language;
    const { request } = useHttp();
    const userId = useSelector((state) => state.userId);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies();
    }, [userId]);

    useEffect(() => {
        renderDays();
    }, [movies]);

    const getMovies = async () => {
        try {
            if (!userId) return;
            const data = await request(api.getUserWatchedMoviesInMonth, "GET", {
                userId,
                date: currentDate,
            });
            if (data.message === "OK") {
                setMovies(data.movies);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (date) => {
        const monthYearString = date.toLocaleDateString(currentLanguage, {
            month: "long",
            year: "numeric",
        });
        return (
            monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1)
        );
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
        const emptyDays = [];
        const dayOfWeek = firstDayOfMonth.getDay();

        const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const daysArray = movies.map((movie) => {
            const date = new Date(movie.watchedDate);
            return date.getUTCDate();
        });

        for (let i = 0; i < adjustedDayOfWeek; i++) {
            emptyDays.push(
                <div key={`empty-${i}`} className="calendar_empty-day"></div>
            );
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const count = daysArray.filter((day) => day === i).length;
            const dayClass =
                count >= 3
                    ? "lot-views"
                    : count === 2
                    ? "average-views"
                    : count === 1
                    ? "few-views"
                    : "no-views";

            days.push(
                <div key={i} className={`calendar_day ${dayClass}`}>
                    <p>{i}</p>
                </div>
            );
        }

        setCalendarDays([...emptyDays, ...days]);
    };

    return (
        <div className="calendar">
            <div className="calendar_header">
                <p>{formatDate(currentDate)}</p>
            </div>
            <div className="calendar_days">{calendarDays}</div>
        </div>
    );
};

export default Calendar;
