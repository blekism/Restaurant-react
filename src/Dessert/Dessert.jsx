import React from "react";
import DessertContainer from "./DessertsContainer.jsx";
import Cart from "../ItemCart/ItemCart.jsx";
import "./Dessert.css";

export default function Dessert({
  items,
  addToCart,
  itemInCart,
  removeFromCart,
  totalPrice,
}) {
  return (
    <div className="dessertWrapper">
      <DessertContainer dessertProp={items} addToCart={addToCart} />
      <Cart
        cartItems={itemInCart}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
      />
    </div>
  );
}
