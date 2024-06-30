import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SwitchSelector from "react-switch-selector";
import "./auth.scss";

const Auth = () => {
    const { t } = useTranslation();
    const [showSignIn, setShowSignIn] = useState(true);
    const [userSignIn, setUserSignIn] = useState({ email: "", password: "" });
    const [userSignUp, setUserSignUp] = useState({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
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
                <div className="modal-auth_container">
                    <input
                        type="email"
                        name="email"
                        className="modal-auth_input"
                        placeholder={`${t("email")}`}
                        value={userSignIn.email}
                        onChange={(e) =>
                            setUserSignIn({
                                ...userSignIn,
                                email: e.target.value,
                            })
                        }
                    />
                    <input
                        type="password"
                        name="password"
                        className="modal-auth_input"
                        placeholder={`${t("password")}`}
                        value={userSignIn.password}
                        onChange={(e) =>
                            setUserSignIn({
                                ...userSignIn,
                                password: e.target.value,
                            })
                        }
                    />
                </div>
            ) : (
                <div className="modal-auth_container">
                    <input
                        type="text"
                        name="name"
                        className="modal-auth_input"
                        placeholder={`${t("fullName")}`}
                        value={userSignUp.name}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                name: e.target.value,
                            })
                        }
                    />
                    <input
                        type="email"
                        name="email"
                        className="modal-auth_input"
                        placeholder={`${t("email")}`}
                        value={userSignUp.email}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                email: e.target.value,
                            })
                        }
                    />
                    <input
                        type="password"
                        name="password"
                        className="modal-auth_input"
                        placeholder={`${t("password")}`}
                        value={userSignUp.password}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                password: e.target.value,
                            })
                        }
                    />
                    <input
                        type="password"
                        name="repeatPassword"
                        className="modal-auth_input"
                        placeholder={`${t("repeatPassword")}`}
                        value={userSignUp.repeatPassword}
                        onChange={(e) =>
                            setUserSignUp({
                                ...userSignUp,
                                repeatPassword: e.target.value,
                            })
                        }
                    />
                </div>
            )}
            <div
                className="buttons-wide button_sticky"
                onClick={() => {
                    toast.error(t("textCannotBeMade"));
                }}
            >
                <button>{showSignIn ? t("signIn") : t("signUp")}</button>
            </div>
        </div>
    );
};

export default Auth;
