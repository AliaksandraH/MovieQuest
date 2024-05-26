import { Link, NavLink } from "react-router-dom";
import Search from "../../assets/icons8-magnifier-64.png";
import Logo from "../../assets/icons8-film-reel-64.png";
import "./header.scss";

const Header = () => {
    return (
        <div className="header">
            <div className="header_logo">
                <img src={Logo} />
                <Link to="/">
                    <h3>MovieQuest</h3>
                </Link>
            </div>
            <div className="header_toolbar">
                {/* <div className="header_toolbar_search">
                    <input type="text" placeholder="Search..." />
                    <img src={Search} />
                </div>
                <NavLink to="/login">
                    <span>Login</span>
                </NavLink>
                <NavLink to="/registration">
                    <span>Registration</span>
                </NavLink> */}
            </div>
        </div>
    );
};

export default Header;
