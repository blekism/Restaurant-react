import React from "react";
import axios from "axios";

// Add showRemoveButton and onRemoveClick to props
export default function ItemTemplate({
  product_id,
  product_name,
  price,
  addToCart, // Keep for product listing pages
  showRemoveButton = false, // Default to false (show Add button)
  onRemoveClick, // Function to call when Remove is clicked
  cart_id // Needed for removal
}) {

  const handleAddToCartClick = async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert("Please log in to add items to your cart.");
      return;
    }
    const cartItemData = { user_id, product_id, qty: 1 }; // Use qty instead of quantity

    try {
      const response = await axios.post(
        "http://localhost/week6/PHP/API/addtocart.php",
        cartItemData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Add to Cart Response:", response.data);
      if (response.data && response.data.status === 200) {
        if (addToCart) {
           addToCart(); // Call parent's update function if provided
        }
        alert(response.data.message || "Item added to cart successfully!");
      } else {
        alert(response.data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Could not add item to cart.'} (Status: ${error.response.status})`);
      } else if (error.request) {
        alert("Could not connect to the server. Please try again later.");
      } else {
        alert(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  // Simple handler for the remove button
  const handleRemoveClick = () => {
    if (onRemoveClick && cart_id) {
      onRemoveClick(cart_id); // Call the passed remove function with cart_id
    } else {
      console.error("onRemoveClick function or cart_id not provided to ItemTemplate");
    }
  };


  return (
    <>
      {/* Use consistent styling, maybe adjust card style for cart view if needed */}
      <div className="card" style={{ width: "18rem", height: "fit-content", margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">{product_name}</h5>
          {/* Ensure price is displayed correctly */}
          <p className="card-text">₱{parseFloat(price).toFixed(2)}</p>

          {/* Conditional Button Rendering */}
          {showRemoveButton ? (
            <button
              type="button"
              className="btn btn-danger btn-sm" // Use danger style for remove
              onClick={handleRemoveClick} // Call remove handler
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddToCartClick} // Call add handler
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
}