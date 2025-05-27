import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Dummy users except trainer (trainer will be authenticated from backend)
  const users = [
    { email: "sales@123.com", password: "1234", role: "sales" },
    { email: "training@123.com", password: "1234", role: "training" },
    { email: "placement@123.com", password: "1234", role: "placement" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email is one of dummy users first
    const user = users.find((u) => u.email === email);

    if (user) {
      // If found in dummy users, check password locally
      if (user.password === password) {
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);

        if (user.role === "sales") navigate("/sales-dashboard");
        else if (user.role === "training") navigate("/training-dashboard");
        else if (user.role === "placement") navigate("/placement-dashboard");
      } else {
        alert("Invalid credentials");
      }
    } else {
      // If not dummy user, then assume trainer and call backend
      try {
        const res = await fetch(
          `http://crm-backend-production-ad67.up.railway.app/authentication?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
          {
            method: "POST",
          }
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        console.log("Backend response:", data);

        if (data === true) {
          localStorage.setItem("role", "trainer");
          localStorage.setItem("email", email);
          navigate("/trainer-dashboard");
        } else {
          alert("Invalid trainer credentials");
        }
      } catch (error) {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl mb-4 text-center font-bold text-[#134C93]">
          Login to Your Account
        </h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
          placeholder="Enter your email"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border rounded"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-[#134C93] text-white py-2 rounded hover:bg-[#0f3c6a]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
