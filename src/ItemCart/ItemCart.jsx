import React from "react";
import "./ItemCart.css";
// import Items from "./ItemInCart.jsx";

export default function ItemCart() {
  return (
    <>
      <div className="shoppingCartContainer">
        <div className="addCartContainer">
          <center>
            <h3 className="addItem">Your Cart!</h3>
            <hr className="line" />
          </center>
        </div>
      </div>
    </>
  );
}
