import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-gray-100 to-green-500 text-gray-900 p-6">
            {/* Main Content */}
            <div className="text-center max-w-2xl">
                <p className="text-sm font-semibold text-green-700 tracking-wide uppercase">
                    Transform Your Health Journey
                </p>
                <h1 className="text-5xl font-extrabold mt-4 leading-tight">
                    Eat Smart, <span className="text-green-800">Live Better,</span><br />
                    Feel Amazing.
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                    Discover personalized nutrition plans that align with your body's unique needs.
                </p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col md:flex-row items-center gap-6 w-full max-w-lg">
                {/* Sign Up Button */}
                <button
                    onClick={() => navigate("/signup")}
                    className="w-full md:w-1/2 bg-green-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-green-900 transition-all"
                >
                    Sign Up
                    <p className="text-sm font-light mt-1">Create your account & start your journey</p>
                </button>

                {/* Login Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="w-full md:w-1/2 bg-white text-gray-900 py-4 rounded-xl font-semibold shadow-md border border-gray-300 hover:bg-gray-100 transition-all"
                >
                    Log in
                    <p className="text-sm font-light mt-1">Already have an account? Continue</p>
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 text-green-600 font-semibold opacity-70 text-lg hidden md:block">
                <p>Start your wellness journey today!</p>
            </div>
        </div>
    );
};

export default Welcome;