import React, { useState } from "react";
import "./Drinks.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const handleRegister = () => {
    setSubmittedData({ email, password });
  };

  return (
    <div className="registerWrapper">
      <div className="registerBox">
        <h2>Register</h2>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">@</span>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-success" onClick={handleRegister}>
          Register
        </button>

        {submittedData && (
          <div className="mt-4">
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Password:</strong> {submittedData.password}</p>
          </div>
        )}
      </div>
    </div>
  );
}
