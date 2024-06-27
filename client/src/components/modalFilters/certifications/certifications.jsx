import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../modalFilters.scss";

const Certifications = ({
    type,
    checkedCertification,
    setCheckedCertification,
}) => {
    const certifications = useSelector((state) => state.certifications);
    const { t } = useTranslation();

    const createStyleCertifications = () => {
        return certifications[type].map((el, id) => {
            return (
                <div key={`${el.certification}_${id}`}>
                    <input
                        id={el.certification}
                        type="radio"
                        value={el.certification}
                        checked={checkedCertification === el.certification}
                        onChange={(event) => {
                            setCheckedCertification(event.target.value);
                        }}
                        name="certifications"
                    />
                    <label htmlFor={el.certification} className="input-label">
                        {el.certification}
                    </label>
                </div>
            );
        });
    };

    return (
        <div className="filter_container ">
            <span className="label">{t("certifications")}:</span>
            <div className="filter_container_values">
                {createStyleCertifications()}
            </div>
        </div>
    );
};

export default Certifications;
