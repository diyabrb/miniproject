import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Signup failed: " + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      alert("User authentication failed.");
      setLoading(false);
      return;
    }

    // Store user in UserTable
    const { error: dbError } = await supabase.from("UserTable").insert([
      { user_id: user.id, full_name: fullName, email: email },
    ]);

    if (dbError) {
      console.error("Database Insert Error:", dbError.message);
      alert("Could not save user details. Try again.");
      setLoading(false);
      return;
    }

    alert("Signup successful!");
    navigate("/upload");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
}
