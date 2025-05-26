import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from '../assets/react.svg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Hardcoded users
    const users = [
      { email: "sales@123.com", password: "1234", role: "sales" },
      { email: "training@123.com", password: "1234", role: "training" },
      { email: "placement@123.com", password: "1234", role: "placement" },
    ];

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      // Store role in localStorage (or you can use context)
      localStorage.setItem("role", user.role);

      // Navigate to respective dashboards
      if (user.role === "sales") navigate("/sales-dashboard");
      else if (user.role === "training") navigate("/training-dashboard");
      else if (user.role === "placement") navigate("/placement-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl px-8 py-10 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
