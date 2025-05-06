import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios"; // Import axios
import "./SideDish.css";
import Cart from "../ItemCart/ItemCart.jsx";

export default function SideDish({
  // itemInCart prop is removed as this component will now fetch its own data
  removeFromCart, // Keep removeFromCart if needed by Cart component
  // totalPrice prop might also be calculated locally now or fetched
}) {
  // State for storing fetched cart items
  const [cartItems, setCartItems] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);
  // State for calculated total price (optional, can be done in Cart component too)
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    const user_id = localStorage.getItem('user_id'); // Get user_id from localStorage

    if (!user_id) {
      setError("User not logged in.");
      setLoading(false);
      setCartItems([]); // Ensure cart is empty if no user ID
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/week6/PHP/API/readcart.php",
        { user_id: user_id }, // Send user_id in the request body
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Read Cart Response:", response.data);

      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
        // Calculate total price based on fetched items
        const calculatedTotal = response.data.data.reduce((sum, item) => {
          // Ensure price is a number before adding
          const price = parseFloat(item.price);
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
        setTotalPrice(calculatedTotal);
      } else {
        // Handle cases where data is not as expected or status is not 200
        setError(response.data.message || "Failed to load cart items.");
        setCartItems([]); // Clear items on error
        setTotalPrice(0);
      }
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Could not connect to the server or an error occurred while fetching the cart.");
      setCartItems([]); // Clear items on error
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch cart items when the component mounts
  useEffect(() => {
    fetchCartItems();
    // Optional: Add a listener or interval if the cart needs to refresh automatically
    // Be mindful of performance implications with frequent fetching.
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle removing an item - potentially refetch or update state locally
  const handleRemoveFromCart = async (cartIdToRemove) => {
      // Option 1: Refetch the entire cart after removal (simpler)
      // await callYourRemoveApiEndpoint(cartIdToRemove); // You'll need an API endpoint for removal
      // fetchCartItems();

      // Option 2: Update state locally (more responsive UI)
      // await callYourRemoveApiEndpoint(cartIdToRemove);
      const updatedCartItems = cartItems.filter(item => item.cart_id !== cartIdToRemove);
      setCartItems(updatedCartItems);
       // Recalculate total price
       const calculatedTotal = updatedCartItems.reduce((sum, item) => {
          const price = parseFloat(item.price);
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
       setTotalPrice(calculatedTotal);

      // Note: You still need a backend endpoint to actually remove the item from the DB.
      // The `removeFromCart` prop might need adjustment based on how removal is implemented.
      console.log("Removing item with cart_id:", cartIdToRemove);
      // If the original removeFromCart prop is needed for other state updates, call it here.
      if (removeFromCart) {
          removeFromCart(cartIdToRemove); // Adjust arguments if needed
      }
  };


  return (
    <div className="sideWrapper">
      {loading && <p>Loading cart...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <Cart
          // Pass the fetched cart items and the local handler for removal
          cartItems={cartItems}
          removeFromCart={handleRemoveFromCart} // Pass the local handler
          totalPrice={totalPrice} // Pass the calculated total price
        />
      )}
     
    </div>
  );
}