import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SearchContainer from "../searchContainer/searchContainer";
import Logo from "../../assets/icons8-film-reel-64.png";
import SwitchSelector from "react-switch-selector";
import { setUserId } from "../../actions";
import Menu from "../../assets/icons8-menu-100.png";
import "./header.scss";

const options = [
    {
        label: "EN",
        value: "en",
        selectedBackgroundColor: "#025bbd",
    },
    {
        label: "RU",
        value: "ru",
        selectedBackgroundColor: "#9f0013",
    },
];

const Header = ({ openModalAuth }) => {
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.userId);
    const [panelVisibility, setPanelVisibility] = useState(false);

    const panelRef = useRef();

    useEffect(() => {
        if (panelVisibility) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [panelVisibility]);

    const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            setPanelVisibility(false);
        }
    };

    const changeLanguage = (newValue) => {
        i18n.changeLanguage(newValue);
        setPanelVisibility(false);
    };

    const initialSelectedIndex = options.findIndex(
        ({ value }) => value === currentLanguage
    );

    const signOut = () => {
        localStorage.removeItem("userId");
        dispatch(setUserId(null));
        setPanelVisibility(false);
        toast.success(t("logoutSuccess"));
    };

    return (
        <div className="header" ref={panelRef}>
            <div className="main-panel">
                <Link
                    to="/"
                    className="main-panel_logo"
                    onClick={() => setPanelVisibility(false)}
                >
                    <img src={Logo} />
                    <h3>MovieQuest</h3>
                </Link>
                <div className="main-panel_toolbar">
                    <div
                        className="main-panel_search"
                        onClick={() => setPanelVisibility(false)}
                    >
                        <SearchContainer />
                    </div>
                    <img
                        src={Menu}
                        className="main-panel_menu"
                        onClick={() => setPanelVisibility((state) => !state)}
                    />
                </div>
            </div>
            {panelVisibility && (
                <div className="additional-panel">
                    <div className="additional-panel_links">
                        {userId && (
                            <>
                                <Link
                                    to="/saved"
                                    className="additional-panel_button"
                                    onClick={() => setPanelVisibility(false)}
                                >
                                    <span>{t("saved")}</span>
                                </Link>
                                <Link
                                    to="/watched"
                                    className="additional-panel_button"
                                    onClick={() => setPanelVisibility(false)}
                                >
                                    <span>{t("watchedLink")}</span>
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="additional-panel_links">
                        {userId ? (
                            <button
                                className="additional-panel_button"
                                onClick={() => signOut()}
                            >
                                {t("signOut")}
                            </button>
                        ) : (
                            <button
                                className="additional-panel_button_sign-in"
                                onClick={() => {
                                    setPanelVisibility(false), openModalAuth();
                                }}
                            >
                                {t("signIn")}
                            </button>
                        )}
                        <div className="additional-panel_switch">
                            <SwitchSelector
                                onChange={changeLanguage}
                                options={options}
                                initialSelectedIndex={initialSelectedIndex}
                                backgroundColor={"#353b48"}
                                fontColor={"#e0dede"}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
