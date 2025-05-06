import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainDishContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

// Category ID constant is no longer needed for filtering here
// const MAIN_DISH_CATEGORY_ID = 1;

export default function MainDishContainer({ addToCart }) {
  // Rename state to reflect it holds all items fetched, not just main dishes
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost/week6/PHP/API/readitems.php"
        );
        if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
          // Directly set all fetched items without filtering
          setItems(response.data.data);
        } else {
          console.error("Failed to fetch items:", response.data.message || 'Invalid data format');
          setError(response.data.message || "Failed to load items.");
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Could not connect to the server or an error occurred.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div className="MainDishParentContainer">
        {/* Consider making this title dynamic or more general if needed */}
        <h1 className="title">Products</h1>
        <center>
          {loading && <p>Loading products...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && (
            <div className="scrollable-main">
              {/* Map over the 'items' state variable */}
              {items.length > 0 ? (
                items.map((item) => (
                  <ItemTemplate
                    key={item.product_id} // Use product_id as key
                    product_id={item.product_id} // Pass product_id if needed by addToCart
                    product_name={item.product_name} // Pass product_name
                    price={item.price} // Pass price
                    // img prop removed
                    addToCart={() => addToCart(item)} // Pass the whole item object to addToCart
                  />
                ))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          )}
        </center>
      </div>
    </>
  );
}