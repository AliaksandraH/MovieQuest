import { useTranslation } from "react-i18next";
import NoBackground from "../../assets/no-background.png";
import Logo from "../../assets/icons8-film-reel-64 copy.png";
import "../../style/helpers.scss";
import "./404.scss";

const Page404 = () => {
    const { t } = useTranslation();

    return (
        <div className="full-screen_with-background">
            <img
                src={NoBackground}
                className="full-screen_with-background_background"
            />
            <div className="full-screen_with-background_information page404_information">
                <div className="error-text">
                    <img src={Logo} />
                    <span>{t("error404Title")}</span>
                </div>
                <div className="page404_information_additional">
                    <p>{t("error404Message")}</p>
                    <p className="text-bold">{t("error404MaybeHelpful")}</p>
                    <p>
                        <span>1.</span> {t("error404Suggestions.0")}
                    </p>
                    <p>
                        <span>2.</span> {t("error404Suggestions.1")}
                    </p>
                    <p>
                        <span>3.</span> {t("error404Suggestions.2")}
                    </p>
                    <p className="text-bold">{t("error404Apology")}</p>
                </div>
            </div>
        </div>
    );
};

export default Page404;
