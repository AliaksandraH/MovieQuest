import { useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import LogIn from "./pages/login/login";
import Registration from "./pages/registration/registration";
import "./App.scss";

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/registration" element={<Registration />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
