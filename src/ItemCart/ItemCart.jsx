import React from "react";
import axios from "axios"; // Import axios
import ItemTemplate from "./../ItemTemplate";
import "./ItemCart.css";

// Add onCheckoutSuccess prop to notify parent on successful checkout
export default function ItemCart({ cartItems, removeFromCart, totalPrice, onCheckoutSuccess }) {
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Function to handle the checkout process
  const handleCheckout = async () => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }

    // Confirmation dialog
    const isConfirmed = window.confirm(`Proceed to checkout with a total of ₱${totalPrice.toFixed(2)}?`);

    if (isConfirmed) {
      console.log("User confirmed checkout. Proceeding...");
      try {
        const response = await axios.post(
          "http://localhost/week6/PHP/API/checkoutcart.php",
          { user_id: user_id }, // Send user_id in the request body
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Checkout Response:", response.data);

        if (response.data && response.data.status === 200) {
          alert(response.data.message || "Checkout successful!");
          // Call the callback function passed from the parent to update its state
          if (onCheckoutSuccess) {
            onCheckoutSuccess();
          }
        } else {
          // Handle specific errors from the backend (e.g., out of stock)
          alert(response.data.message || "Checkout failed. Please try again.");
        }
      } catch (error) {
        console.error("Checkout Error:", error);
        if (error.response) {
          alert(`Error: ${error.response.data.message || 'Could not complete checkout.'} (Status: ${error.response.status})`);
        } else if (error.request) {
          alert("Could not connect to the server. Please try again later.");
        } else {
          alert(`An unexpected error occurred: ${error.message}`);
        }
      }
    } else {
      console.log("User cancelled checkout.");
    }
  };

  return (
    <div className="shoppingCartContainer">
      <div className="addCartContainer">
          <h3 className="addItem">Your Cart!</h3>
          <hr className="line" />

          {cartItems.length > 0 ? (
            <div className="cartItemsWrapper">
              <div className="scrollable-cart">
                {cartItems.map((item) => (
                  <ItemTemplate
                    key={item.cart_id}
                    product_id={item.product_id}
                    product_name={item.product_name}
                    price={item.price}
                    cart_id={item.cart_id}
                    showRemoveButton={true}
                    onRemoveClick={removeFromCart}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <h3 className="totalTxt">
            Total Price: ₱{totalPrice.toFixed(2)}
          </h3>

          {/* Add Checkout Button */}
          {cartItems.length > 0 && ( // Only show button if cart is not empty
            <button
              className="btn btn-success w-100 mt-3" // Style as needed
              onClick={handleCheckout}
            >
              Checkout
            </button>
          )}
      </div>
    </div>
  );
}