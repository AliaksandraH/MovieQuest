import { useTranslation } from "react-i18next";
import "./footer.scss";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className="footer">
            <div className="footer_container">
                <h4>{t("contacts")}</h4>
                <span>Email: aliaksandra.hurskaya@gmail.com</span>
            </div>
            <div className="footer_container">
                <h4>{t("resources")}</h4>
                <span>
                    Icons:{" "}
                    <a href="https://icons8.com/license">
                        https://icons8.com/license
                    </a>
                </span>
                <span>
                    API:{" "}
                    <a href="https://www.themoviedb.org/">
                        https://www.themoviedb.org/
                    </a>
                </span>
            </div>
        </div>
    );
};

export default Footer;
