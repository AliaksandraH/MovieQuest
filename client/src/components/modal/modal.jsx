import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconClase from "../../assets/icons8-close-26.png";
import "./modal.scss";

const Modal = ({ Component, componentProps, nameModal, closeModal }) => {
    const { t } = useTranslation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const closeModalHandler = (value) => {
        if (value.target.className === "modal") {
            closeModal();
        }
    };

    return (
        <div className="modal" onClick={closeModalHandler}>
            <div className="modal_container">
                <div className="modal_header">
                    <h2>{t(nameModal)}</h2>
                    <button onClick={closeModal}>
                        <img src={IconClase} alt="close" />
                    </button>
                </div>
                <Component {...componentProps} />
            </div>
        </div>
    );
};

export default Modal;
