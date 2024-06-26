import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import LogIn from "./pages/login/login";
import Registration from "./pages/registration/registration";
import SinglePage from "./pages/singlePage/singlePage";
import ModalFilters from "./components/modalFilters/modalFilters";
import "./App.scss";
import "../i18n.js";

function App() {
    const assignedFilters = useSelector((state) => state.assignedFilters);
    const [modalShow, setModalShow] = useState(false);

    const openModal = () => setModalShow(true);
    const closeModal = () => setModalShow(false);

    return (
        <Router>
            {modalShow && (
                <ModalFilters
                    closeModalFilters={closeModal}
                    currentFilters={assignedFilters}
                />
            )}
            <div className="app">
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={<Home openModalFilters={openModal} />}
                    />
                    <Route path="/:type/:id" element={<SinglePage />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/registration" element={<Registration />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
