import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMouseYposition } from "../actions";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Home from "../pages/home/home";
import SinglePage from "../pages/singlePage/singlePage";
import UserMovies from "../pages/userMovies/userMovies";
import Page404 from "../pages/404/404";

const StackNavigator = ({ openModalAuth, checkVPN }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const prevLocation = useRef(location.pathname);

    const propsSavedMovies = {
        title: "savedMoviesAndShows",
        url: "getUserSavedMovies",
        sort: false,
    };
    const propsWatchedMovies = {
        title: "watchedMoviesAndShows",
        url: "getUserWatchedMovies",
        sort: true,
    };

    useEffect(() => {
        checkVPN();
    }, [location, checkVPN]);

    useEffect(() => {
        const path = location.pathname.split("/")[1];
        if (
            path === "tv" ||
            path === "movie" ||
            prevLocation.current === location.pathname
        )
            return;
        dispatch(setMouseYposition(0));
        prevLocation.current = location.pathname;
    }, [location]);

    return (
        <>
            <Header openModalAuth={openModalAuth} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/:type/:id"
                    element={<SinglePage openModalAuth={openModalAuth} />}
                />
                <Route
                    path="/saved"
                    element={<UserMovies {...propsSavedMovies} />}
                />
                <Route
                    path="/watched"
                    element={<UserMovies {...propsWatchedMovies} />}
                />
                <Route path="/404" element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
            <Footer />
        </>
    );
};

export default StackNavigator;
