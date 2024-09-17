import React from "react";
import "./MainDish.css";
import MainDishContainer from "./MainDishContainer.jsx";
import Cart from "../ItemCart/ItemCart.jsx";

export default function MainDish({
  items,
  addToCart,
  itemInCart,
  removeFromCart,
  totalPrice,
}) {
  return (
    <>
      <div className="MainDishWrapper">
        <MainDishContainer MainDishProp={items} addToCart={addToCart} />
        <Cart
          cartItems={itemInCart}
          removeFromCart={removeFromCart}
          totalPrice={totalPrice}
        />
      </div>
    </>
  );
}
