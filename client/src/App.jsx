import { useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import LogIn from "./pages/login/login";
import Registration from "./pages/registration/registration";
import SinglePage from "./pages/singlePage/singlePage";
import ModalFilters from "./components/modalFilters/modalFilters";
import "./App.scss";

function App() {
    const [modalShow, setModalShow] = useState(false);

    const openModal = () => setModalShow(true);
    const closeModal = () => setModalShow(false);

    return (
        <Router>
            {modalShow && <ModalFilters closeModalFilters={closeModal} />}
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
