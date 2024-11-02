import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Home from "../pages/home/home";
import SinglePage from "../pages/singlePage/singlePage";
import UserMovies from "../pages/userMovies/userMovies";
import Page404 from "../pages/404/404";

const StackNavigator = ({ openModalAuth, checkVPN }) => {
    const location = useLocation();

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
