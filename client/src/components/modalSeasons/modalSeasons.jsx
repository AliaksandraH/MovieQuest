import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { useTranslation } from "react-i18next";
import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";
import "./modalSeasons.scss";

const ModalSeasons = ({ seasonsInformation }) => {
    const { t } = useTranslation();

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(dateString)
            .toLocaleDateString("ru-RU", options)
            .replace(/\./g, "-");
    };

    const createAccordionHeader = (el) => {
        return (
            <div className="accordion_header">
                <div>
                    <span>
                        {t("season")} {el.season_number}
                    </span>
                    <span className="accordion_header_episodes">
                        ({el.episode_count} {t("episodes")})
                    </span>
                </div>
                <span className="accordion_header_date">
                    {formatDate(el.air_date)}
                </span>
            </div>
        );
    };

    const createAccordionItem = (el) => {
        return (
            <div className="accordion_checkboxes">
                <p className="accordion_checkboxes_overview">{el.overview}</p>
                {Array.from({ length: el.episode_count }).map((_, index) => (
                    <div key={index} className="accordion_checkbox">
                        <span>
                            {t("episode")} {index + 1}
                        </span>
                        <Checkbox
                            checked={false}
                            icon={
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flex: 1,
                                        backgroundColor: "#9f0013",
                                        alignSelf: "stretch",
                                    }}
                                >
                                    <Icon.FiCheck color="white" size={18} />
                                </div>
                            }
                            borderColor="#9f0013"
                            borderWidth={3}
                            borderRadius={20}
                            style={{ overflow: "hidden" }}
                            size={25}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-seasons">
            <Accordion className="accordion">
                {seasonsInformation.map((el) => {
                    if (el.episode_count == 0 || el.season_number == 0) return;
                    return (
                        <AccordionItem
                            header={createAccordionHeader(el)}
                            key={el.id}
                        >
                            {createAccordionItem(el)}
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};
export default ModalSeasons;
