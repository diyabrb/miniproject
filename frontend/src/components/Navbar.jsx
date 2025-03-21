import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { supabase } from "../supabaseClient"; // Ensure Supabase is imported

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        }
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut(); // Ensure user logs out properly
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg relative">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Nutrify</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                    {!isLoggedIn ? (
                        <>
                            <NavItem to="/" text="Welcome" />
                            <NavItem to="/signup" text="Sign Up" />
                            <NavItem to="/login" text="Login" />
                        </>
                    ) : (
                        <>
                            <NavItem to="/home" text="Home" />
                            <NavItem to="/upload" text="Upload Report" />
                            <NavItem to="/bmi" text="Calculate BMI" />
                            <NavItem to="/personalized-diet" text="Personalized Diet" />
                            <NavItem to="/standard-diet" text="Standard Diet" />
                            <button onClick={handleLogout} className="text-red-300 hover:underline">
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-blue-600 md:hidden flex flex-col text-center py-4 space-y-3">
                    {!isLoggedIn ? (
                        <>
                            <NavItem to="/" text="Welcome" mobile />
                            <NavItem to="/signup" text="Sign Up" mobile />
                            <NavItem to="/login" text="Login" mobile />
                        </>
                    ) : (
                        <>
                            <NavItem to="/home" text="Home" mobile />
                            <NavItem to="/upload" text="Upload Report" mobile />
                            <NavItem to="/bmi" text="Calculate BMI" mobile />
                            <NavItem to="/personalized-diet" text="Personalized Diet" mobile />
                            <NavItem to="/standard-diet" text="Standard Diet" mobile />
                            <button onClick={handleLogout} className="text-red-300 hover:underline">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

// Reusable NavItem Component
const NavItem = ({ to, text, mobile }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`${isActive ? "text-yellow-300 font-bold" : "hover:underline"} ${mobile ? "block py-2" : ""}`}>
            {text}
        </Link>
    );
};

export default Navbar;
