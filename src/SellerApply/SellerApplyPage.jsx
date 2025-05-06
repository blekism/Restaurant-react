import React, { useState } from "react";
import axios from "axios"; // For API call
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export default function SellerApplyPage() {
  // State for file inputs - store the File objects to get their names
  const [barangayClearance, setBarangayClearance] = useState(null);
  const [validId, setValidId] = useState(null);
  const [businessPermit, setBusinessPermit] = useState(null);
  const [mayorPermit, setMayorPermit] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle file input changes - Store the File object
  const handleFileChange = (setter) => (event) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    } else {
      setter(null);
    }
  };

  // Function to handle post-successful submission actions
  const handleSuccessfulSubmission = () => {
    alert("Application submitted successfully! Please log in again to update your status.");
    // Clear user session data from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    // Redirect to the login page
    navigate('/'); // Assuming '/' is your login route
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user_id = localStorage.getItem('user_id');

    // Basic validation
    if (!user_id) {
      alert("Please log in to apply.");
      setLoading(false);
      return;
    }
    // Check if File objects exist in state before accessing .name
    if (!barangayClearance || !validId || !businessPermit || !mayorPermit) {
      alert("Please upload all required documents.");
      setLoading(false);
      return;
    }

    // Create JSON payload with filenames
    const applicationData = {
      user_id: user_id,
      barangay_clearance: barangayClearance.name, // Send only the filename
      valid_id: validId.name,                   // Send only the filename
      business_permit: businessPermit.name,       // Send only the filename
      mayor_permit: mayorPermit.name              // Send only the filename
    };

    console.log("Submitting application with JSON:", applicationData);

    try {
      // Send JSON data
      const response = await axios.post(
        "http://localhost/week6/PHP/API/applyseller.php", // Your endpoint
        applicationData, // Send the JSON object
        {
          headers: {
            // Explicitly set Content-Type to application/json
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.status === 200) {
        // Call the new function on success
        handleSuccessfulSubmission();
        // No need to reset form here as we are navigating away
        // e.target.reset();
      } else {
        // Use error message from backend if available
        alert(response.data.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error.response) {
         // Use error message from backend response if available
         alert(`Error: ${error.response.data.message || 'Could not submit application.'} (Status: ${error.response.status})`);
      } else if (error.request) {
         alert("Could not connect to the server. Please try again later.");
      } else {
         alert(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      // Set loading to false only if not navigating away on success
      // If handleSuccessfulSubmission is called, the component might unmount before this runs
      // It's generally safe to leave it, but be aware.
      setLoading(false);
    }
  };

  return (
    <div className="addItemParent">
      <h3 className="addItemTitle">Apply to Become a Seller</h3>
      <hr className="line" />
      <form onSubmit={handleSubmit}>

        {/* File Input for Barangay Clearance */}
        <div className="mb-3">
          <label htmlFor="barangayClearanceInput" className="form-label">Barangay Clearance</label>
          <input
            type="file"
            className="form-control"
            id="barangayClearanceInput"
            onChange={handleFileChange(setBarangayClearance)}
            accept="image/*,.pdf"
            required
          />
          {/* Optional: Display selected filename */}
          {barangayClearance && <small className="d-block text-muted mt-1">{barangayClearance.name}</small>}
        </div>

        {/* File Input for Valid ID */}
        <div className="mb-3">
          <label htmlFor="validIdInput" className="form-label">Valid ID</label>
          <input
            type="file"
            className="form-control"
            id="validIdInput"
            onChange={handleFileChange(setValidId)}
            accept="image/*,.pdf"
            required
          />
          {validId && <small className="d-block text-muted mt-1">{validId.name}</small>}
        </div>

        {/* File Input for Business Permit */}
        <div className="mb-3">
          <label htmlFor="businessPermitInput" className="form-label">Business Permit</label>
          <input
            type="file"
            className="form-control"
            id="businessPermitInput"
            onChange={handleFileChange(setBusinessPermit)}
            accept="image/*,.pdf"
            required
          />
          {businessPermit && <small className="d-block text-muted mt-1">{businessPermit.name}</small>}
        </div>

        {/* File Input for Mayor's Permit */}
        <div className="mb-3">
          <label htmlFor="mayorPermitInput" className="form-label">Mayor's Permit</label>
          <input
            type="file"
            className="form-control"
            id="mayorPermitInput"
            onChange={handleFileChange(setMayorPermit)}
            accept="image/*,.pdf"
            required
          />
          {mayorPermit && <small className="d-block text-muted mt-1">{mayorPermit.name}</small>}
        </div>

        <button
          type="submit"
          className="btn btn-primary fw-bold mt-4 btn-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}