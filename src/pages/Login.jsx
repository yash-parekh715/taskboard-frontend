import React, { useState } from "react";
import Errorpopup from "../components/Errorpopup.jsx";
import Successpopup from "../components/Successpopup.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const toggleMode = () => {
    setForm({ username: "", email: "", password: "" });
    setIsSignup(!isSignup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (isSignup && !form.username)) {
      return setError("All fields are required.");
    }

    const url = isSignup ? "/signup" : "/login";
    const payload = isSignup
      ? form
      : { email: form.email, password: form.password };
    const loginUrl = import.meta.env.VITE_API_AUTH_URL;

    try {
      const res = await fetch(`${loginUrl}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) return setError(data.error);
      if (isSignup) return setSuccess(data.message);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transform hover:scale-[1.02] transition-all font-medium"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            className="text-purple-600 font-medium ml-2 hover:underline"
            onClick={toggleMode}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
      {error && <Errorpopup message={error} onClose={() => setError(null)} />}
      {success && (
        <Successpopup message={success} onClose={() => setSuccess(null)} />
      )}
    </div>
  );
}

export default Login;
