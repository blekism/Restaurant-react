import React from "react";
import ItemTemplate from "./../ItemTemplate"; // Importing the ItemTemplate component
import "./ItemCart.css";

export default function ItemCart({ cartItems, removeFromCart }) {
  // Ensure cartItems is defined and is an array before trying to access its length
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  return (
    <div className="shoppingCartContainer">
      <div className="addCartContainer">
          <h3 className="addItem">Your Cart!</h3>
          <hr className="line" />

          {/* Check if there are any items in the cart */}
          {cartItems.length > 0 ? (
            <div className="cartItemsWrapper">
              <div className="scrollable-cart">
                {cartItems.map((cart) => (
                  <div className="cartCard" key={cart.id}>
                    <ItemTemplate
                      img={cart.image}  // Passing image to ItemTemplate
                      foodName={cart.name}  // Passing food name to ItemTemplate
                      price={`$${cart.price}`}  // Passing price formatted as a string
                      addToCart={() => removeFromCart(cart.id)}  // Passing remove from cart function
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <h3 className="totalTxt">
            Total Price: ${cartItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}
          </h3>
      </div>
    </div>
  );
}
