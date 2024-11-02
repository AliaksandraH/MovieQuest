import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { useHttp } from "./hooks/http.hook.jsx";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUserId } from "./actions/index.jsx";
import StackNavigator from "./stackNavigator/stackNavigator.jsx";
import PageVPN from "./pages/vpn/vpn.jsx";
import Modal from "./components/modal/modal";
import Auth from "./components/auth/auth.jsx";
import "./App.scss";
import "../i18n.js";

const _key = process.env.REACT_APP_API_TMDB_KEY;

function App() {
    const dispatch = useDispatch();
    const { request } = useHttp();
    const [modalAuth, setModalAuth] = useState(false);
    const [VPN, setVPN] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            dispatch(setUserId(userId));
        }
        checkVPN();
    }, []);

    const checkVPN = async () => {
        try {
            const movieCountries = await request(
                `https://api.themoviedb.org/3/configuration/countries?api_key=${_key}`
            );
            setVPN(!movieCountries.length);
        } catch (error) {
            setVPN(true);
        }
    };

    const openModalAuth = () => setModalAuth(true);
    const closeModal = () => setModalAuth(false);

    const modalAuthProps = {
        closeModalAuth: closeModal,
    };

    return (
        <>
            <ToastContainer
                position="bottom-right"
                theme="colored"
                transition={Flip}
            />
            {modalAuth && (
                <Modal
                    Component={Auth}
                    componentProps={modalAuthProps}
                    nameModal="authorization"
                    closeModal={closeModal}
                />
            )}
            <div className="app">
                {VPN ? (
                    <PageVPN />
                ) : (
                    <Router>
                        <StackNavigator
                            openModalAuth={openModalAuth}
                            checkVPN={checkVPN}
                        />
                    </Router>
                )}
            </div>
        </>
    );
}

export default App;
