import React from "react";
import "./SideDish.css";
import Cart from "../ItemCart/ItemCart.jsx";

export default function SideDish({
  itemInCart,
  removeFromCart,
  totalPrice,
}) {
  return (
    <div className="sideWrapper">
      <Cart
        cartItems={itemInCart}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
      />
    </div>
  );
}
