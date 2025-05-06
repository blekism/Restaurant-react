import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./Drinks.css"; // Assuming you have styles defined here

// Consider renaming this component to RegisterPage.jsx for clarity
export default function RegisterPage() {
  // Add state for all required fields based on function.php
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); // Optional: for loading state

  // Make the handler async to use await
  const handleRegister = async () => {
    // Basic client-side validation (optional but recommended)
    if (!email || !password || !fullname || !address || !contact || !username) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true); // Set loading state

    // Data object matching the PHP function's expectations
    const userData = {
      email: email,
      password: password, // Consider hashing the password on the client-side (less secure) or ideally HTTPS + server-side hashing
      fullname: fullname,
      address: address,
      contact: contact,
      username: username,
    };

    try {
      const response = await axios.post(
        "http://localhost/week6/PHP/API/register.php", // Your registration endpoint
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration Response:", response.data);

      if (response.data && response.data.status === 200) {
        alert(response.data.message || "Registration successful!");
        // Clear the form after successful registration
        setEmail("");
        setPassword("");
        setFullname("");
        setAddress("");
        setContact("");
        setUsername("");
      } else {
        // Handle errors returned from the backend (e.g., validation errors)
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      // Handle network errors or other issues
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        alert(`Error: ${error.response.data.message || 'Could not register.'} (Status: ${error.response.status})`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Could not connect to the server. Please check your network.");
      } else {
        // Something else happened
        alert(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="registerWrapper">
      <div className="registerBox">
        <h2>Register</h2>

        {/* Add input fields for all required data */}
        <div className="input-group mb-3">
          <span className="input-group-text">👤</span>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">@</span>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
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

        <div className="input-group mb-3">
          <span className="input-group-text">📝</span>
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">🏠</span>
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">📞</span>
          <input
            type="text" // Consider type="tel" for better mobile UX
            className="form-control"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-success w-100" // Make button full width
          onClick={handleRegister}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Removed the submittedData display logic */}
      </div>
    </div>
  );
}