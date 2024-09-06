import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SwitchSelector from "react-switch-selector";
import { api } from "../../helpers/constants";
import { setUserId } from "../../actions";
import "./auth.scss";

const Auth = ({ closeModalAuth }) => {
    const { t } = useTranslation();
    const { request } = useHttp();
    const dispatch = useDispatch();
    const [showSignIn, setShowSignIn] = useState(true);
    const [userSignIn, setUserSignIn] = useState({ email: "", password: "" });
    const [userSignUp, setUserSignUp] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const options = [
        {
            label: t("signIn"),
            value: "in",
            selectedBackgroundColor: "#9f0013",
        },
        {
            label: t("signUp"),
            value: "up",
            selectedBackgroundColor: "#9f0013",
        },
    ];

    const initialSelectedIndex = options.findIndex(
        ({ value }) => value === "in"
    );

    const changeType = (value) => {
        setShowSignIn(value === "in");
    };

    const onSignIn = async (e) => {
        e.preventDefault();
        try {
            const data = await request(api.login, "POST", userSignIn);

            if (data.message === "OK") {
                toast.success(t("loginSuccess"));
                setUserSignIn({ email: "", password: "" });
                localStorage.setItem("userId", data.userId);
                dispatch(setUserId(data.userId));
                closeModalAuth();
            } else {
                toast.error(t(data.message));
            }
        } catch (error) {
            toast.error(t("error"));
        }
    };

    const onSignUp = async (e) => {
        e.preventDefault();
        try {
            const data = await request(api.register, "POST", userSignUp);

            if (data.message === "OK") {
                toast.success(t("registrationSuccess"));
                setUserSignUp({
                    username: "",
                    email: "",
                    password: "",
                    passwordConfirm: "",
                });
            } else {
                toast.error(t(data.message));
            }
        } catch (error) {
            toast.error(t("error"));
        }
    };

    return (
        <div className="modal-auth">
            <div className="modal-auth_switch">
                <SwitchSelector
                    onChange={changeType}
                    options={options}
                    initialSelectedIndex={initialSelectedIndex}
                    backgroundColor={"#353b48"}
                    fontColor={"#e0dede"}
                    wrapperBorderRadius={0}
                    optionBorderRadius={10}
                />
            </div>
            {showSignIn ? (
                <form className="modal-auth_container" onSubmit={onSignIn}>
                    <input
                        type="email"
                        name="email"
                        className="modal-auth_input"
                        placeholder={t("email")}
                        value={userSignIn.email}
                        onChange={(e) =>
                            setUserSignIn({
                                ...userSignIn,
                                email: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        name="password"
                        className="modal-auth_input"
                        placeholder={t("password")}
                        value={userSignIn.password}
                        onChange={(e) =>
                            setUserSignIn({
                                ...userSignIn,
                                password: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <div className="buttons-wide button_sticky">
                        <button type="submit">{t("signIn")}</button>
                    </div>
                </form>
            ) : (
                <form className="modal-auth_container" onSubmit={onSignUp}>
                    <input
                        type="text"
                        name="username"
                        className="modal-auth_input"
                        placeholder={t("fullName")}
                        value={userSignUp.username}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                username: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <input
                        type="email"
                        name="email"
                        className="modal-auth_input"
                        placeholder={t("email")}
                        value={userSignUp.email}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                email: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        name="password"
                        className="modal-auth_input"
                        placeholder={t("password")}
                        value={userSignUp.password}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                password: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        name="passwordConfirm"
                        className="modal-auth_input"
                        placeholder={t("repeatPassword")}
                        value={userSignUp.passwordConfirm}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                passwordConfirm: e.target.value,
                            })
                        }
                        required
                        autoComplete="off"
                    />
                    <div className="buttons-wide button_sticky">
                        <button type="submit">{t("signUp")}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Auth;
