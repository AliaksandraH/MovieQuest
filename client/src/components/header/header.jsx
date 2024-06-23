import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchContainer from "../searchContainer/searchContainer";
import Logo from "../../assets/icons8-film-reel-64.png";
import SwitchSelector from "react-switch-selector";
import "./header.scss";

const Header = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

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

    const changeLanguage = (newValue) => {
        i18n.changeLanguage(newValue);
    };

    const initialSelectedIndex = options.findIndex(
        ({ value }) => value === currentLanguage
    );

    return (
        <div className="header">
            <div className="header_logo">
                <img src={Logo} />
                <Link to="/">
                    <h3>MovieQuest</h3>
                </Link>
            </div>
            <div className="header_toolbar">
                <div className="header_switch">
                    <SwitchSelector
                        onChange={changeLanguage}
                        options={options}
                        initialSelectedIndex={initialSelectedIndex}
                        backgroundColor={"#353b48"}
                        fontColor={"#e0dede"}
                    />
                </div>
                <div className="header_search">
                    <SearchContainer />
                </div>
                {/* <NavLink to="/login">
                    <span>Login</span>
                </NavLink>
                <NavLink to="/registration">
                    <span>Registration</span>
                </NavLink>{" "} */}
            </div>
        </div>
    );
};

export default Header;
