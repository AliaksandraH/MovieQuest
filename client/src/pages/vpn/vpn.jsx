import { useTranslation } from "react-i18next";
import NoBackground from "../../assets/no-background.png";
import Logo from "../../assets/icons8-film-reel-64 copy.png";
import "../../style/helpers.scss";
import "./vpn.scss";

const PageVPN = () => {
    const { t } = useTranslation();

    return (
        <div className="pageVPN full-screen_with-background">
            <img
                src={NoBackground}
                className="full-screen_with-background_background"
            />
            <div className="full-screen_with-background_information pageVPN_information">
                <div className="error-text">
                    <img src={Logo} />
                    <span>{t("enableVPN")}</span>
                </div>
                <div className="pageVPN_information_additional">
                    <p>{t("vpnAccessMessages.0")}</p>
                    <p>{t("vpnAccessMessages.1")}</p>
                    <p className="text-bold">{t("pleaseEnableVPN")}</p>
                </div>
            </div>
        </div>
    );
};

export default PageVPN;
