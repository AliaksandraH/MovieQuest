import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import "./modalSeasons.scss";

const ModalSeasons = () => {
    // "number_of_episodes": 73,
    // "number_of_seasons": 8,
    const seasons = [
        {
            episode_count: 8,
            id: 3626765,
            season_number: 1,
        },
        {
            episode_count: 10,
            id: 36567525,
            season_number: 2,
        },
        {
            episode_count: 4,
            id: 362545,
            season_number: 3,
        },
        {
            episode_count: 11,
            id: 36756525,
            season_number: 4,
        },
    ];
    return (
        <div className="modal-seasons">
            <Accordion className="accordion">
                {seasons.map((el) => (
                    <AccordionItem
                        header={`Season ${el.season_number}`}
                        key={el.id}
                    >
                        {el.episode_count}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
export default ModalSeasons;
