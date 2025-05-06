import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dessert.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);

    const loginData = { email, password };

    try {
      const response = await axios.post(
        "http://localhost/week6/PHP/API/login.php",
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Response:", response.data);

      if (response.data && response.data.status === 200 && response.data.user_id) {
        alert(response.data.message || "Login successful!");

        const userId = response.data.user_id;
        const userRole = response.data.role;

        // --- Store user info in localStorage ---
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_role', userRole);
        // --- End localStorage Update ---

        // --- Navigate to the standard MainDish route ---
        navigate(`/MainDish`); // Remove the user ID from the URL path
        // --- End Navigation Update ---

      } else {
        setError(response.data.message || "Login failed. Please check your credentials or ensure user_id is returned.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Login failed.'} (Status: ${err.response.status})`);
      } else if (err.request) {
        setError("Could not connect to the server. Please try again later.");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReg = () => {
    navigate("/Drinks"); // Navigate to registration page
  };

  return (
    <div className="loginWrapper">
      <div className="loginBox">
        <h2>Login</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="input-group mb-3">
          <span className="input-group-text">@</span>
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">🔒</span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleLoginSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          className="btn btn-secondary w-100"
          onClick={handleReg}
          disabled={loading}
        >
          Register
        </button>
      </div>
    </div>
  );
}