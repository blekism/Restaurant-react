import React from "react";
import "./ItemCart.css";
// import Items from "./ItemInCart.jsx";

export default function ItemCart({ cartItems, removeFromCart }) {
  return (
    <>
      <div className="shoppingCartContainer">
        <div className="addCartContainer">
          <center>
            <h3 className="addItem">Your Cart!</h3>
            <hr className="line" />

            <ul>
              {cartItems.map((cart) => (
                <li key={cart.id}>
                  <div className="cartItem">
                    <h4>{cart.name}</h4>
                    <p>Price: {cart.price}</p>
                    <p>Quantity: {cart.quantity}</p>
                    <button onClick={() => removeFromCart(cart.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="totalTxt">
              Total Price:{" "}
              {cartItems.reduce((acc, item) => acc + item.totalPrice, 0)}
            </h3>
          </center>
        </div>
      </div>
    </>
  );
}
