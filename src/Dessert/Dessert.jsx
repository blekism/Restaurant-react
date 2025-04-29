import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dessert.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/MainDish");
  };

  const handleReg = () => {
    navigate("/Drinks");
  };

  return (
    <div className="loginWrapper">
      <div className="loginBox">
        <h2>Login</h2>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">@</span>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon2">🔒</span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon2"
          />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
        <button className="btn btn-primary" onClick={handleReg}>
          Register
        </button>
      </div>
    </div>
  );
}
