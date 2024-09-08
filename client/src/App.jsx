import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUserId } from "./actions/index.jsx";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import SinglePage from "./pages/singlePage/singlePage";
import UserMovies from "./pages/userMovies/userMovies.jsx";
import Modal from "./components/modal/modal";
import Auth from "./components/auth/auth.jsx";
import ModalFilters from "./components/modalFilters/modalFilters";
import ModalSeasons from "./components/modalSeasons/modalSeasons";
import "./App.scss";
import "../i18n.js";

function App() {
    const dispatch = useDispatch();
    const assignedFilters = useSelector((state) => state.assignedFilters);
    const [modalFilters, setModalFilters] = useState(false);
    const [modalSeasons, setModalSeasons] = useState(false);
    const [modalAuth, setModalAuth] = useState(false);
    const [seasonsInformation, setSeasonsInformation] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            dispatch(setUserId(userId));
        }
    }, []);

    const openModalFilters = () => setModalFilters(true);
    const openModalSeasons = () => setModalSeasons(true);
    const openModalAuth = () => setModalAuth(true);

    const closeModal = () => {
        setModalFilters(false);
        setModalSeasons(false);
        setModalAuth(false);
    };

    const modalFiltersProps = {
        closeModalFilters: closeModal,
        currentFilters: assignedFilters,
    };

    const modalSeasonsProps = {
        seasonsInformation: seasonsInformation,
    };

    const modalAuthProps = {
        closeModalAuth: closeModal,
    };

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

    return (
        <>
            <ToastContainer
                position="bottom-right"
                theme="colored"
                transition={Flip}
            />
            <Router>
                {modalFilters && (
                    <Modal
                        Component={ModalFilters}
                        componentProps={modalFiltersProps}
                        nameModal="filters"
                        closeModal={closeModal}
                    />
                )}
                {modalSeasons && (
                    <Modal
                        Component={ModalSeasons}
                        componentProps={modalSeasonsProps}
                        nameModal="seasons"
                        closeModal={closeModal}
                    />
                )}
                {modalAuth && (
                    <Modal
                        Component={Auth}
                        componentProps={modalAuthProps}
                        nameModal="authorization"
                        closeModal={closeModal}
                    />
                )}
                <div className="app">
                    <Header openModalAuth={openModalAuth} />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home openModalFilters={openModalFilters} />
                            }
                        />
                        <Route
                            path="/:type/:id"
                            element={
                                <SinglePage
                                    openModalSeasons={openModalSeasons}
                                    openModalAuth={openModalAuth}
                                    setSeasonsInformation={
                                        setSeasonsInformation
                                    }
                                />
                            }
                        />
                        <Route
                            path="/saved"
                            element={<UserMovies {...propsSavedMovies} />}
                        />
                        <Route
                            path="/watched"
                            element={<UserMovies {...propsWatchedMovies} />}
                        />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </>
    );
}

export default App;
