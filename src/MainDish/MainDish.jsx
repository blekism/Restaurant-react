import React from "react";
import "./MainDish.css";
import MainDishContainer from "./MainDishContainer.jsx";

export default function MainDish({
  // items prop is removed as MainDishContainer fetches its own data
  addToCart,
  // Other props like itemInCart, removeFromCart, totalPrice might still be needed
  // depending on where cart logic resides, but are not used by MainDishContainer directly.
}) {
  return (
    <div className="MainDishWrapper">
      {/* Pass only the necessary props */}
      <MainDishContainer addToCart={addToCart} />
    </div>
  );
}