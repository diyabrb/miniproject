import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UploadReport from "./pages/UploadReport";
import BMI from "./pages/BMI";
import PersonalizedDiet from "./pages/PersonalizedDiet";
import StandardDiet from "./pages/StandardDiet";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                {!isLoggedIn ? (
                    <>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/upload" element={<UploadReport />} />
                        <Route path="/bmi" element={<BMI />} />
                        <Route path="/personalized-diet" element={<PersonalizedDiet />} />
                        <Route path="/standard-diet" element={<StandardDiet />} />
                        <Route path="*" element={<Navigate to="/home" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;