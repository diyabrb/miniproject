import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Ensure correct import

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !phoneNo || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // ✅ Step 1: Sign up user using Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // ✅ Step 2: Get the `auth_uid` from Supabase Auth
            const auth_uid = authData.user?.id; // Changed from user_id/auth_id to auth_uid
            if (!auth_uid) throw new Error("User ID not received from Supabase.");

            console.log("New user auth UID:", auth_uid);

            // ✅ Step 3: Insert user details into UserTable with `auth_uid`
            const { error: userError } = await supabase
                .from("UserTable")
                .insert([{ auth_uid, firstname: firstName, lastname: lastName, phoneno: phoneNo, email }]);

            if (userError) throw userError;

            console.log("User added to UserTable successfully.");

            // ✅ Step 4: Redirect to login page
            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSignup} className="mt-4">
                    <input type="text" placeholder="First Name" className="w-full p-2 border rounded-lg mb-3" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Last Name" className="w-full p-2 border rounded-lg mb-3" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded-lg mb-3" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded-lg mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded-lg mb-3" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition-all">
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-3">
                    Already have an account? <a href="/login" className="text-green-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
