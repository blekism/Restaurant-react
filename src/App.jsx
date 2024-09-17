import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import MainDish from "./MainDish/MainDish.jsx";
import SideDish from "./SideDish/SideDish.jsx";
import Dessert from "./Dessert/Dessert.jsx";
import Drinks from "./Drinks/Drinks.jsx";
import AddItem from "./AddItem/AddItem.jsx";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                totalPrice: Number(cartItem.totalPrice) + Number(item.price),
              }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          { ...item, quantity: 1, totalPrice: Number(item.price) },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="parentContainer">
      <Router>
        <nav class="navbar navbar-expand-lg navbar-light bg-custom">
          <div class="container-fluid">
            <h2 className="titleTxt">Shopee To pre</h2>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                  <Link to="/" class="nav-link">
                    Dessert
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/Drinks" class="nav-link">
                    Drinks
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/MainDish" class="nav-link">
                    Main Dish
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/SideDish" class="nav-link">
                    Side Dish
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/AddItem" class="nav-link">
                    Add Item
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Dessert
                items={items}
                addToCart={addToCart}
                itemInCart={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/Drinks"
            element={
              <Drinks
                items={items}
                addToCart={addToCart}
                itemInCart={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/MainDish"
            element={
              <MainDish
                items={items}
                addToCart={addToCart}
                itemInCart={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/SideDish"
            element={
              <SideDish
                items={items}
                addToCart={addToCart}
                itemInCart={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/AddItem"
            element={
              <AddItem
                addItem={addItem}
                addToCart={addToCart}
                itemInCart={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
