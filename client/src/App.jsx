import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import LogIn from "./pages/login/login";
import Registration from "./pages/registration/registration";
import SinglePage from "./pages/singlePage/singlePage";
import Modal from "./components/modal/modal";
import ModalFilters from "./components/modalFilters/modalFilters";
import ModalSeasons from "./components/modalSeasons/modalSeasons";
import "./App.scss";

function App() {
    const { assignedFilters } = useSelector((state) => state);

    const [modalFilters, setModalFilters] = useState(false);
    const [modalSeasons, setModalSeasons] = useState(false);

    const openModalFilters = () => setModalFilters(true);
    const openModalSeasons = () => setModalSeasons(true);

    const closeModal = () => {
        setModalFilters(false);
        setModalSeasons(false);
    };

    const modalFiltersProps = {
        closeModalFilters: closeModal,
        currentFilters: assignedFilters,
    };

    return (
        <Router>
            {modalFilters && (
                <Modal
                    Component={ModalFilters}
                    componentProps={modalFiltersProps}
                    nameModal="Filters"
                    closeModal={closeModal}
                />
            )}
            {modalSeasons && (
                <Modal
                    Component={ModalSeasons}
                    componentProps={{}}
                    nameModal="Seasons"
                    closeModal={closeModal}
                />
            )}
            <div className="app">
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={<Home openModalFilters={openModalFilters} />}
                    />
                    <Route
                        path="/:type/:id"
                        element={
                            <SinglePage openModalSeasons={openModalSeasons} />
                        }
                    />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/registration" element={<Registration />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
