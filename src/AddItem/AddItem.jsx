import React, { useState, useEffect } from "react";
import Template from "../InputTemplate.jsx";
import "./AddItem.css";
import axios from "axios"; // Import axios

export default function AddItem({ addItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); // State for selected category ID
  const [categories, setCategories] = useState([]); // State to store fetched categories

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost/week6/PHP/API/readcategory.php"
        );
        if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
          // Set default category selection to the first category if available
          if (response.data.data.length > 0) {
            setCategoryId(response.data.data[0].category_id);
          }
        } else {
          console.error("Failed to fetch categories:", response.data.message || 'No data array found');
          setCategories([]); // Ensure categories is an array even on failure
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Ensure categories is an array on error
        alert("Could not load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e) => { // Make the function async
    e.preventDefault();

    if (name && price && categoryId) {
      const newItemData = {
        product_name: name,
        price: parseInt(price), // Ensure price is an integer as expected by PHP
        category_id: parseInt(categoryId), // Ensure category ID is an integer
      };

      try {
        const response = await axios.post(
          "http://localhost/week6/PHP/API/addnewitem.php",
          newItemData,
          {
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
          }
        );

        console.log("Add Item Response:", response.data); // Log the response

        if (response.data && response.data.status === 200) {
          alert(response.data.message || "Item added successfully!");

          // Optionally call addItem prop if needed for parent state update
          // You might need the backend to return the newly created item's ID
          // addItem({ ...newItemData, id: response.data.new_product_id });

          // Reset form fields
          setName("");
          setPrice("");
          // Reset category to the first available option or empty if none
          setCategoryId(categories.length > 0 ? categories[0].category_id : "");

        } else {
          alert(response.data.message || "Failed to add item.");
        }
      } catch (error) {
        console.error("Error adding item:", error);
        if (error.response) {
          console.error("Error data:", error.response.data);
          alert(`Error: ${error.response.data.message || 'Could not add item.'} (Status: ${error.response.status})`);
        } else if (error.request) {
          alert("Could not connect to the server. Please try again later.");
        } else {
          alert(`An unexpected error occurred: ${error.message}`);
        }
      }
    } else {
      alert("Please fill out Item Name, Price, and select a Category.");
    }
  };

  // Removed generateID and handleImageChange functions

  return (
    <div className="addItemParent">
      <h3 className="addItemTitle">Add a new Item!</h3>
      <hr className="line" />
      <form onSubmit={handleSubmit}>
        <Template
          desc="Item Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Template
          desc="Item Price"
          type="number" // Use number type for price
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          step="0.01" // Optional: allow decimal prices
          min="0" // Optional: prevent negative prices
        />

        {/* Category Selection Dropdown */}
        <div className="mb-3">
          <label htmlFor="categorySelect" className="form-label">Item Category</label>
          <select
            id="categorySelect"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={categories.length === 0} // Disable if categories haven't loaded
          >
            <option value="" disabled> -- Select a Category -- </option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name} {/* Assuming the category object has category_name */}
                </option>
              ))
            ) : (
              <option value="" disabled>Loading categories...</option>
            )}
          </select>
           {categories.length === 0 && <small className="text-danger">Could not load categories.</small>}
        </div>

        {/* Removed Image Input Section */}

        <button
          type="submit"
          className="btn btn-primary fw-bold mt-4 btn-lg"
          // Removed onClick={generateID}
        >
          Submit
        </button>
      </form>
    </div>
  );
}