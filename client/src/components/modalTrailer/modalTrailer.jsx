import "./modalTrailer.scss";

const ModalTrailer = ({ trailerUrl }) => {
    return (
        <div className="modal-trailer">
            <iframe
                className="trailer-iframe"
                src={trailerUrl}
                frameBorder="0"
                allowFullScreen
                title="Trailer"
            ></iframe>
        </div>
    );
};

export default ModalTrailer;
