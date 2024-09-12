import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { api } from "../../helpers/constants";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";
import Spinner from "../spinner/spinner";
import "./modalRating.scss";

const ModalRating = ({ closeModalRating, openModalAuth }) => {
    const { id, type } = useParams();
    const { t } = useTranslation();
    const { request } = useHttp();
    const userId = useSelector((state) => state.userId);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);

    const styleRatingStars = {
        starDimension: "30px",
        starSpacing: "2px",
        numberOfStars: 10,
        rating,
        isSelectable: true,
        starRatedColor: "#9f0013",
        starHoverColor: "#9f0013",
        starEmptyColor: "rgb(124, 124, 124)",
    };

    const putRating = async () => {
        try {
            if (!userId) {
                openModalAuth();
                return;
            }
            setLoading(true);
            const data = await request(api.putRatingMovie, "POST", {
                userId,
                movieId: id,
                type,
                rating,
            });
            if (data.message === "OK") {
                toast.info(t("thanksForFeedback"));
                closeModalRating();
            } else {
                toast.error(t("error"));
            }
        } catch (error) {
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-rating">
            <div className="modal-rating_information">
                <div>
                    <p className="text-rate">{t("rateMovieOrShow")}</p>
                    <p>{t("ratingHelp")}</p>
                </div>
                <div className="modal-rating_stars">
                    <StarRatings
                        {...styleRatingStars}
                        changeRating={setRating}
                    />
                </div>
            </div>
            <div className="buttons-wide button_sticky" onClick={putRating}>
                <button>
                    {!loading ? t("save") : <Spinner width={20} height={20} />}
                </button>
            </div>
        </div>
    );
};

export default ModalRating;
