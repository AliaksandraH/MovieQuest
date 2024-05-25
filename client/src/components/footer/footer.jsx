import "./footer.scss";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer_container">
                <h4>Contacts</h4>
                <span>Email: aliaksandra.hurskaya@gmail.com</span>
            </div>
            <div className="footer_container">
                <h4>Tools</h4>
                <span>
                    Icons :{" "}
                    <a href="https://icons8.com/license">
                        https://icons8.com/license
                    </a>
                </span>
                <span>
                    API :{" "}
                    <a href="https://www.themoviedb.org/">
                        https://www.themoviedb.org/
                    </a>
                </span>
            </div>
        </div>
    );
};

export default Footer;
