import React from "react";
import DrinksContainer from "./DrinksContainer.jsx";
import Cart from "../ItemCart/ItemCart.jsx";
import "./Drinks.css";

export default function Drinks({
  items,
  addToCart,
  itemInCart,
  removeFromCart,
  totalPrice,
}) {
  return (
    <>
      <div className="drinkWrapper">
        <DrinksContainer DrinkProp={items} addToCart={addToCart} />
        <Cart
          cartItems={itemInCart}
          removeFromCart={removeFromCart}
          totalPrice={totalPrice}
        />
      </div>
    </>
  );
}
