import { useEffect } from "react";
import IconClase from "../../assets/icons8-close-26.png";
import "./modalFilters.scss";

const ModalFilters = ({ closeModalFilters }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const closeModalHandler = (value) => {
        if (value.target.className === "modal") {
            closeModalFilters();
        }
    };

    return (
        <div className="modal" onClick={(value) => closeModalHandler(value)}>
            <div className="modal_container">
                <div className="modal_header">
                    <h2>Filters</h2>
                    <button onClick={closeModalFilters}>
                        <img src={IconClase} alt="close" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalFilters;
