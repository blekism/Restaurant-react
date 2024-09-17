import React from "react";
import "./SideDish.css";
import SideDishContainer from "./SideDishConatiner.jsx";
import Cart from "../ItemCart/ItemCart.jsx";

export default function SideDish({
  items,
  addToCart,
  itemInCart,
  removeFromCart,
  totalPrice,
}) {
  return (
    <>
      <div className="sideWrapper">
        <SideDishContainer SideDishProp={items} addToCart={addToCart} />
        <Cart
          cartItems={itemInCart}
          removeFromCart={removeFromCart}
          totalPrice={totalPrice}
        />
      </div>
    </>
  );
}
